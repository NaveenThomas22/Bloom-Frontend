import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useInitAuth } from '../hooks/useAuth';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi', () => ({
  authApi: {
    refreshToken: vi.fn(),
  },
}));

describe('Session Restoration (useInitAuth)', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
    useAuthStore.getState().setInitializing(true);
    vi.clearAllMocks();
  });

  it('silently restores session when valid refresh cookie exists', async () => {
    const mockAuthResponse = {
      accessToken: 'restored.jwt.token',
      expiresInMinutes: 15,
      user: {
        id: 10,
        fullName: 'Restored User',
        email: 'restored@bloom.com',
        emailVerified: true,
        createdAtUtc: new Date().toISOString(),
      },
    };

    vi.mocked(authApi.refreshToken).mockResolvedValueOnce(mockAuthResponse);

    renderHook(() => useInitAuth());

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.isInitializing).toBe(false);
      expect(state.isAuthenticated).toBe(true);
      expect(state.accessToken).toBe('restored.jwt.token');
      expect(state.user?.fullName).toBe('Restored User');
    });
  });

  it('marks initialization complete without authenticating if refresh fails', async () => {
    vi.mocked(authApi.refreshToken).mockRejectedValueOnce(new Error('No cookie found'));

    renderHook(() => useInitAuth());

    await waitFor(() => {
      const state = useAuthStore.getState();
      expect(state.isInitializing).toBe(false);
      expect(state.isAuthenticated).toBe(false);
      expect(state.accessToken).toBeNull();
    });
  });
});

