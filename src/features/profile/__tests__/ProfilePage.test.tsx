import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProfilePage } from '../pages/ProfilePage';
import { renderWithProviders } from '@/test/test-utils';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/authApi';

vi.mock('@/features/auth/api/authApi', () => ({
  authApi: {
    updateUserProfile: vi.fn(),
    logout: vi.fn().mockResolvedValue(undefined),
    logoutAll: vi.fn().mockResolvedValue(undefined),
  },
}));

describe('ProfilePage', () => {
  beforeEach(() => {
    useAuthStore.getState().setAuth(
      {
        id: 7,
        fullName: 'Sneha Patel',
        email: 'sneha@cataspirant.in',
        emailVerified: true,
        createdAtUtc: '2026-01-15T00:00:00Z',
        profile: {
          catTargetYear: 2026,
          preparationLevel: 'Intermediate',
          preparationMode: 'Hybrid',
          timezone: 'Asia/Kolkata',
        },
      },
      'token-xyz'
    );
    vi.clearAllMocks();
  });

  it('renders aspirant profile information from auth store', () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByText('Sneha Patel')).toBeInTheDocument();
    expect(screen.getByText('sneha@cataspirant.in')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sneha Patel')).toBeInTheDocument();
  });

  it('saves updated profile and shows feedback', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.updateUserProfile).mockResolvedValueOnce({
      catTargetYear: 2027,
      preparationLevel: 'Advanced',
      preparationMode: 'SelfStudy',
      timezone: 'Asia/Kolkata',
    });

    renderWithProviders(<ProfilePage />);

    const nameInput = screen.getByDisplayValue('Sneha Patel');
    await user.clear(nameInput);
    await user.type(nameInput, 'Sneha V. Patel');

    const saveBtn = screen.getByRole('button', { name: /save profile changes/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(authApi.updateUserProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: 'Sneha V. Patel',
        })
      );
      expect(screen.getByText(/profile details saved successfully/i)).toBeInTheDocument();
    });
  });
});
