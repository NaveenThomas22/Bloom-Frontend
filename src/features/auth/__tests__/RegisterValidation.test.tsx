import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RegisterPage } from '../pages/RegisterPage';
import { renderWithProviders } from '@/test/test-utils';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi', () => ({
  authApi: {
    register: vi.fn(),
  },
}));

describe('RegisterPage Validation', () => {
  it('displays validation errors on invalid inputs', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const submitBtn = screen.getByRole('button', { name: /create my journey/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/full name must be at least 2 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/please provide a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
  });

  it('validates password complexity and mismatch', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterPage />);

    const nameInput = screen.getByLabelText(/full name/i);
    const emailInput = screen.getByLabelText(/email address/i);
    const passwordInputs = screen.getAllByLabelText(/^password/i);
    const passwordInput = passwordInputs[0];
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await user.type(nameInput, 'Arjun Mehta');
    await user.type(emailInput, 'arjun@catprep.com');
    await user.type(passwordInput, 'simplepass');
    await user.type(confirmPasswordInput, 'differentpass');

    const submitBtn = screen.getByRole('button', { name: /create my journey/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/must contain uppercase, lowercase, digit, and special character/i)).toBeInTheDocument();
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('submits successfully when validation passes', async () => {
    const user = userEvent.setup();
    const mockAuthResponse = {
      accessToken: 'mock.access.token',
      expiresInMinutes: 15,
      user: {
        id: 1,
        fullName: 'Arjun Mehta',
        email: 'arjun@catprep.com',
        emailVerified: false,
        createdAtUtc: new Date().toISOString(),
        profile: {
          catTargetYear: 2026,
          preparationLevel: 'Beginner',
          preparationMode: 'SelfStudy',
          timezone: 'Asia/Kolkata',
        },
        preferences: {
          theme: 'Sage Garden',
          dailyStudyTargetMinutes: 360,
          preferredWakeTime: '06:00:00',
          preferredSleepTime: '22:30:00',
          notificationEnabled: true,
        },
      },
    };

    vi.mocked(authApi.register).mockResolvedValueOnce(mockAuthResponse);

    renderWithProviders(<RegisterPage />);

    await user.type(screen.getByLabelText(/full name/i), 'Arjun Mehta');
    await user.type(screen.getByLabelText(/email address/i), 'arjun@catprep.com');
    const passwordInputs = screen.getAllByLabelText(/^password/i);
    await user.type(passwordInputs[0], 'SecureP@ss123');
    await user.type(screen.getByLabelText(/confirm password/i), 'SecureP@ss123');

    const submitBtn = screen.getByRole('button', { name: /create my journey/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(authApi.register).toHaveBeenCalledTimes(1);
    });
  });
});
