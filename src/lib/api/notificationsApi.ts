import { apiClient } from './client';
import type { ApiResponse } from '@/types/auth';
import type {
  NotificationCategory,
  UserNotificationPreference,
  UserNotification,
  NotificationOverview,
  PushSubscriptionRequest,
} from '@/types/notifications';

export const notificationsApi = {
  getCategories: async (): Promise<NotificationCategory[]> => {
    const res = await apiClient.get<ApiResponse<NotificationCategory[]>>('/notifications/categories');
    return res.data.data;
  },

  getPreferences: async (): Promise<UserNotificationPreference[]> => {
    const res = await apiClient.get<ApiResponse<UserNotificationPreference[]>>('/notifications/preferences');
    return res.data.data;
  },

  updatePreference: async (
    categoryCode: string,
    data: { isEnabled: boolean; preferredTimeUtc?: string; quietHoursStartUtc?: string; quietHoursEndUtc?: string; channels: string; maxDailyAlerts: number }
  ): Promise<boolean> => {
    const res = await apiClient.put<ApiResponse<boolean>>(`/notifications/preferences/${categoryCode}`, data);
    return res.data.data;
  },

  getNotifications: async (params?: { limit?: number; offset?: number; status?: string }): Promise<UserNotification[]> => {
    const res = await apiClient.get<ApiResponse<UserNotification[]>>('/notifications', { params });
    return res.data.data;
  },

  getOverview: async (): Promise<NotificationOverview> => {
    const res = await apiClient.get<ApiResponse<NotificationOverview>>('/notifications/overview');
    return res.data.data;
  },

  markAsRead: async (id: number): Promise<boolean> => {
    const res = await apiClient.put<ApiResponse<boolean>>(`/notifications/${id}/read`);
    return res.data.data;
  },

  markAllAsRead: async (): Promise<number> => {
    const res = await apiClient.put<ApiResponse<number>>('/notifications/read-all');
    return res.data.data;
  },

  dismissNotification: async (id: number): Promise<boolean> => {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/notifications/${id}`);
    return res.data.data;
  },

  registerPushSubscription: async (data: PushSubscriptionRequest): Promise<boolean> => {
    const res = await apiClient.post<ApiResponse<boolean>>('/notifications/push-subscribe', data);
    return res.data.data;
  },

  unsubscribePush: async (endpoint: string): Promise<boolean> => {
    const res = await apiClient.post<ApiResponse<boolean>>('/notifications/push-unsubscribe', endpoint, {
      headers: { 'Content-Type': 'application/json' },
    });
    return res.data.data;
  },

  triggerSmartCheck: async (date?: string): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('/notifications/trigger', null, {
      params: date ? { date } : undefined,
    });
    return res.data.data;
  },
};

