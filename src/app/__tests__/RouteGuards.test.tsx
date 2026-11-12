import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { useAuthStore } from '@/store/useAuthStore';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { AuthLayout } from '../layouts/AuthLayout';

describe('Route Guards (AppLayout & AuthLayout)', () => {
  beforeEach(() => {
    useAuthStore.getState().clearAuth();
    useAuthStore.getState().setInitializing(false);
  });

  it('renders loading spinner while authentication is initializing', () => {
    useAuthStore.getState().setInitializing(true);

    renderWithProviders(
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<div>Secret Dashboard</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/dashboard'] }
    );

    expect(screen.getByText(/cultivating your space/i)).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated user from protected layout to /login', () => {
    useAuthStore.getState().clearAuth();
    useAuthStore.getState().setInitializing(false);

    renderWithProviders(
      <Routes>
        <Route path="/login" element={<div>Login Page Mock</div>} />
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<div>Secret Dashboard</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/dashboard'] }
    );

    expect(screen.getByText('Login Page Mock')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('allows authenticated user into protected AppLayout', () => {
    useAuthStore.getState().setAuth(
      {
        id: 1,
        fullName: 'Test User',
        email: 'test@bloom.com',
        emailVerified: true,
        createdAtUtc: new Date().toISOString(),
      },
      'valid.jwt.token'
    );
    useAuthStore.getState().setInitializing(false);

    renderWithProviders(
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<div>Secret Dashboard</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/dashboard'] }
    );

    expect(screen.getByText('Secret Dashboard')).toBeInTheDocument();
  });

  it('redirects authenticated user from AuthLayout to /dashboard', () => {
    useAuthStore.getState().setAuth(
      {
        id: 1,
        fullName: 'Test User',
        email: 'test@bloom.com',
        emailVerified: true,
        createdAtUtc: new Date().toISOString(),
      },
      'valid.jwt.token'
    );
    useAuthStore.getState().setInitializing(false);

    renderWithProviders(
      <Routes>
        <Route path="/dashboard" element={<div>Main Dashboard</div>} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<div>Login Form</div>} />
        </Route>
      </Routes>,
      { initialEntries: ['/login'] }
    );

    expect(screen.getByText('Main Dashboard')).toBeInTheDocument();
    expect(screen.queryByText('Login Form')).not.toBeInTheDocument();
  });
});
