export interface NotificationCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  description?: string;
  icon: string;
  color: string;
  defaultEnabled: boolean;
}

export interface UserNotificationPreference {
  id: number;
  userId: number;
  categoryCode: string;
  isEnabled: boolean;
  preferredTimeUtc?: string;
  quietHoursStartUtc?: string;
  quietHoursEndUtc?: string;
  channels: string;
  maxDailyAlerts: number;
}

export interface UserNotification {
  id: number;
  userId: number;
  categoryCode: string;
  title: string;
  message: string;
  deepLink?: string;
  status: 'Unread' | 'Read' | 'Dismissed';
  readAtUtc?: string;
  createdAtUtc: string;
}

export interface NotificationOverview {
  unreadCount: number;
  recentNotifications: UserNotification[];
}

export interface PushSubscriptionRequest {
  endpoint: string;
  p256dh: string;
  auth: string;
  userAgent?: string;
}

