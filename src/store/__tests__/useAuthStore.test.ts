import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../useAuthStore';
import type { User } from '@/types/auth';

describe('useAuthStore', () => {
  const mockUser: User = {
    id: 42,
    fullName: 'Ananya Sharma',
    email: 'ananya@catprep.in',
    emailVerified: true,
    createdAtUtc: '2026-11-04T12:00:00Z',
    profile: {
      catTargetYear: 2026,
      preparationLevel: 'Intermediate',
      preparationMode: 'Hybrid',
      timezone: 'Asia/Kolkata',
    },
    preferences: {
      theme: 'Sage Garden',
      dailyStudyTargetMinutes: 360,
      preferredWakeTime: '06:00:00',
      preferredSleepTime: '22:30:00',
      notificationEnabled: true,
    },
  };

  beforeEach(() => {
    useAuthStore.getState().clearAuth();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('initializes with unauthenticated state and null token', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('sets authentication state in memory without writing tokens to localStorage', () => {
    useAuthStore.getState().setAuth(mockUser, 'test.jwt.token');

    const state = useAuthStore.getState();
    expect(state.user?.fullName).toBe('Ananya Sharma');
    expect(state.accessToken).toBe('test.jwt.token');
    expect(state.isAuthenticated).toBe(true);

    // Strict security check: No token in storage
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('updates access token independently', () => {
    useAuthStore.getState().setAuth(mockUser, 'initial.token');
    useAuthStore.getState().setAccessToken('rotated.token');

    const state = useAuthStore.getState();
    expect(state.accessToken).toBe('rotated.token');
    expect(state.user?.email).toBe('ananya@catprep.in');
  });

  it('updates preferences cleanly', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    useAuthStore.getState().setUserPreferences({
      theme: 'Dark Forest',
      dailyStudyTargetMinutes: 480,
      preferredWakeTime: '05:30:00',
      preferredSleepTime: '23:00:00',
      notificationEnabled: false,
    });

    const state = useAuthStore.getState();
    expect(state.user?.preferences?.theme).toBe('Dark Forest');
    expect(state.user?.preferences?.dailyStudyTargetMinutes).toBe(480);
  });

  it('clears authentication state completely upon logout', () => {
    useAuthStore.getState().setAuth(mockUser, 'token');
    useAuthStore.getState().clearAuth();

    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

