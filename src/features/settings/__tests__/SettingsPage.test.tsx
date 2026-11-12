import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SettingsPage } from '../pages/SettingsPage';
import { renderWithProviders } from '@/test/test-utils';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/features/auth/api/authApi';

vi.mock('@/features/auth/api/authApi', () => ({
  authApi: {
    updateUserPreferences: vi.fn(),
  },
}));

describe('SettingsPage', () => {
  beforeEach(() => {
    useAuthStore.getState().setAuth(
      {
        id: 7,
        fullName: 'Sneha Patel',
        email: 'sneha@cataspirant.in',
        emailVerified: true,
        createdAtUtc: '2026-01-15T00:00:00Z',
        preferences: {
          theme: 'Sage Garden',
          dailyStudyTargetMinutes: 360,
          preferredWakeTime: '06:00:00',
          preferredSleepTime: '22:30:00',
          notificationEnabled: true,
        },
      },
      'token-xyz'
    );
    vi.clearAllMocks();
  });

  it('renders existing preferences in inputs and controls', () => {
    renderWithProviders(<SettingsPage />);

    expect(screen.getByText(/preferences & environment/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('06:00:00')).toBeInTheDocument();
    expect(screen.getByDisplayValue('22:30:00')).toBeInTheDocument();
  });

  it('submits updated preferences and calls backend endpoint', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.updateUserPreferences).mockResolvedValueOnce({
      theme: 'Dark Forest',
      dailyStudyTargetMinutes: 480,
      preferredWakeTime: '05:30:00',
      preferredSleepTime: '23:00:00',
      notificationEnabled: true,
    });

    renderWithProviders(<SettingsPage />);

    // Select Dark Forest theme card
    const darkForestCard = screen.getByText('Dark Forest');
    await user.click(darkForestCard);

    const saveBtn = screen.getByRole('button', { name: /save all preferences/i });
    await user.click(saveBtn);

    await waitFor(() => {
      expect(authApi.updateUserPreferences).toHaveBeenCalledWith(
        expect.objectContaining({
          theme: 'Dark Forest',
        })
      );
      expect(screen.getByText(/preferences updated successfully/i)).toBeInTheDocument();
    });
  });
});
