import { create } from 'zustand';
import type { User, UserPreferences } from '@/types/auth';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isInitializing: boolean;
  theme: string;
  setAuth: (user: User, accessToken: string) => void;
  setUser: (user: User) => void;
  setUserPreferences: (preferences: UserPreferences) => void;
  setAccessToken: (token: string | null) => void;
  setInitializing: (loading: boolean) => void;
  setTheme: (theme: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isInitializing: true,
  theme: 'Sage Garden',

  setAuth: (user, accessToken) => {
    const theme = user.preferences?.theme || 'Sage Garden';
    applyThemeClass(theme);
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isInitializing: false,
      theme
    });
  },

  setUser: (user) => {
    const currentTheme = get().theme;
    const newTheme = user.preferences?.theme || currentTheme;
    applyThemeClass(newTheme);
    set({
      user,
      theme: newTheme
    });
  },

  setUserPreferences: (preferences) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, preferences };
      applyThemeClass(preferences.theme);
      set({
        user: updatedUser,
        theme: preferences.theme
      });
    }
  },

  setAccessToken: (token) => {
    set({
      accessToken: token,
      isAuthenticated: !!token
    });
  },

  setInitializing: (isInitializing) => {
    set({ isInitializing });
  },

  setTheme: (theme) => {
    applyThemeClass(theme);
    set({ theme });
  },

  clearAuth: () => {
    applyThemeClass('Sage Garden');
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isInitializing: false,
      theme: 'Sage Garden'
    });
  }
}));

function applyThemeClass(theme: string) {
  const root = document.documentElement;
  if (theme.toLowerCase().includes('dark') || theme.toLowerCase().includes('forest')) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

