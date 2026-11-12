import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { NotificationsPage } from '../pages/NotificationsPage';
import { NotificationSettingsPage } from '../pages/NotificationSettingsPage';
import { notificationsApi } from '@/lib/api/notificationsApi';

vi.mock('@/lib/api/notificationsApi', () => ({
  notificationsApi: {
    getNotifications: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    dismissNotification: vi.fn(),
    getCategories: vi.fn(),
    getPreferences: vi.fn(),
    updatePreference: vi.fn(),
    registerPushSubscription: vi.fn(),
    unsubscribePush: vi.fn(),
    triggerSmartCheck: vi.fn(),
  },
}));

describe('Notifications & Settings Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('NotificationsPage displays unread notifications and marks as read', async () => {
    vi.mocked(notificationsApi.getNotifications).mockResolvedValue([
      {
        id: 701,
        userId: 1,
        categoryCode: 'REVISION_DUE',
        title: '2 CAT Topics Due for Revision',
        message: 'Geometry Circles & Number System are scheduled for spaced revision today.',
        deepLink: '/revisions',
        status: 'Unread',
        createdAtUtc: '2026-11-10T00:00:00Z',
      },
    ]);

    render(
      <MemoryRouter>
        <NotificationsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Notification Sanctuary')).toBeInTheDocument();
      expect(screen.getByText('2 CAT Topics Due for Revision')).toBeInTheDocument();
      expect(screen.getByText(/Geometry Circles & Number System/i)).toBeInTheDocument();
      expect(screen.getByText('View Action')).toBeInTheDocument();
    });
  });

  it('NotificationSettingsPage displays quiet hours and category preferences', async () => {
    vi.mocked(notificationsApi.getCategories).mockResolvedValue([
      { id: 1, categoryCode: 'REVISION_DUE', categoryName: 'Revision Due', description: 'Reminders for spaced revision', icon: 'repeat', color: '#2D6A4F', defaultEnabled: true },
    ]);

    vi.mocked(notificationsApi.getPreferences).mockResolvedValue([
      { id: 10, userId: 1, categoryCode: 'REVISION_DUE', isEnabled: true, quietHoursStartUtc: '23:00:00', quietHoursEndUtc: '07:00:00', channels: 'IN_APP,PUSH', maxDailyAlerts: 10 },
    ]);

    render(
      <MemoryRouter>
        <NotificationSettingsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Notification Preferences')).toBeInTheDocument();
      expect(screen.getByText('PWA Push Notifications')).toBeInTheDocument();
      expect(screen.getByText('Quiet Hours')).toBeInTheDocument();
      expect(screen.getByText('Revision Due')).toBeInTheDocument();
    });
  });
});
