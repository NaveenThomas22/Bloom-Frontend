import { describe, it, expect, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPage } from '../pages/LoginPage';
import { renderWithProviders } from '@/test/test-utils';
import { authApi } from '../api/authApi';

vi.mock('../api/authApi', () => ({
  authApi: {
    login: vi.fn(),
  },
}));

describe('LoginPage Validation & Flow', () => {
  it('validates empty email and password', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    const submitBtn = screen.getByRole('button', { name: /enter sanctuary/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/please enter your email address/i)).toBeInTheDocument();
    expect(screen.getByText(/please enter your password/i)).toBeInTheDocument();
  });

  it('validates invalid email format', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), 'notanemail');
    await user.type(screen.getByPlaceholderText('••••••••••••'), 'password123');

    const submitBtn = screen.getByRole('button', { name: /enter sanctuary/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument();
  });

  it('handles server authentication errors gracefully', async () => {
    const user = userEvent.setup();
    vi.mocked(authApi.login).mockRejectedValueOnce({
      response: {
        status: 401,
        data: {
          detail: 'Invalid email or password.',
        },
      },
    });

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), 'wrong@bloom.com');
    await user.type(screen.getByPlaceholderText('••••••••••••'), 'WrongPass!1');

    const submitBtn = screen.getByRole('button', { name: /enter sanctuary/i });
    await user.click(submitBtn);

    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();
  });

  it('submits valid login credentials successfully', async () => {
    const user = userEvent.setup();
    const mockAuthResponse = {
      accessToken: 'valid.token',
      expiresInMinutes: 15,
      user: {
        id: 1,
        fullName: 'Test Aspirant',
        email: 'aspirant@bloom.com',
        emailVerified: true,
        createdAtUtc: new Date().toISOString(),
      },
    };

    vi.mocked(authApi.login).mockResolvedValueOnce(mockAuthResponse);

    renderWithProviders(<LoginPage />);

    await user.type(screen.getByLabelText(/email address/i), 'aspirant@bloom.com');
    await user.type(screen.getByPlaceholderText('••••••••••••'), 'ValidPass!123');

    const submitBtn = screen.getByRole('button', { name: /enter sanctuary/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(authApi.login).toHaveBeenCalledWith({
        email: 'aspirant@bloom.com',
        password: 'ValidPass!123',
      });
    });
  });
});
