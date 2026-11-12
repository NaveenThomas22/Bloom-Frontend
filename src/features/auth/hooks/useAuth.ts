import { useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '@/store/useAuthStore';
import type { LoginRequest, RegisterRequest, UpdatePreferencesRequest, UpdateProfileRequest } from '@/types/auth';

export const AUTH_KEYS = {
  me: ['auth', 'me'] as const,
  profile: ['users', 'profile'] as const,
  preferences: ['users', 'preferences'] as const,
};

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user, isAuthenticated, isInitializing, setAuth, setUser, setUserPreferences, clearAuth } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: async (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      navigate('/dashboard', { replace: true });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (payload: RegisterRequest) => authApi.register(payload),
    onSuccess: async (data) => {
      setAuth(data.user, data.accessToken);
      queryClient.setQueryData(AUTH_KEYS.me, data.user);
      navigate('/dashboard', { replace: true });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async (allDevices?: boolean) => {
      try {
        if (allDevices) {
          await authApi.logoutAll();
        } else {
          await authApi.logout();
        }
      } catch (err) {
        console.warn('Backend logout failed, clearing local session anyway.', err);
      }
    },
    onSettled: () => {
      clearAuth();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (payload: UpdateProfileRequest) => authApi.updateUserProfile(payload),
    onSuccess: async (updatedProfile) => {
      if (user) {
        const updatedUser = { ...user, profile: updatedProfile };
        setUser(updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.profile });
    },
  });

  const updatePreferencesMutation = useMutation({
    mutationFn: (payload: UpdatePreferencesRequest) => authApi.updateUserPreferences(payload),
    onSuccess: async (updatedPreferences) => {
      setUserPreferences(updatedPreferences);
      if (user) {
        const updatedUser = { ...user, preferences: updatedPreferences };
        setUser(updatedUser);
      }
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.me });
      queryClient.invalidateQueries({ queryKey: AUTH_KEYS.preferences });
    },
  });

  return {
    user,
    isAuthenticated,
    isInitializing,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutateAsync,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutateAsync,
    isLoggingOut: logoutMutation.isPending,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    updatePreferences: updatePreferencesMutation.mutateAsync,
    isUpdatingPreferences: updatePreferencesMutation.isPending,
  };
}

/**
 * Initializes authentication on application bootstrap.
 * Attempts a silent refresh using the HttpOnly cookie.
 * In accordance with security requirements, private authentication credentials
 * and personal identity data are never cached in IndexedDB.
 */
export function useInitAuth() {
  const { setAuth, setInitializing, clearAuth } = useAuthStore();

  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      try {
        // Attempt silent token refresh via HttpOnly cookie
        const authData = await authApi.refreshToken();
        if (isMounted && authData?.user && authData?.accessToken) {
          setAuth(authData.user, authData.accessToken);
          return;
        }
      } catch {
        // Failed refresh indicates expired/absent cookie; remain unauthenticated
        if (isMounted) {
          clearAuth();
        }
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    }

    initSession();

    return () => {
      isMounted = false;
    };
  }, [setAuth, setInitializing, clearAuth]);
}
