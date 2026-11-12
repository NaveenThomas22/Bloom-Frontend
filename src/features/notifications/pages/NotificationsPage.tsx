import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, Settings, ExternalLink, Loader2 } from 'lucide-react';
import { notificationsApi } from '@/lib/api/notificationsApi';
import type { UserNotification } from '@/types/notifications';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const data = await notificationsApi.getNotifications({
        status: filter === 'unread' ? 'Unread' : undefined,
      });
      setNotifications(data);
    } catch (err) {
      // Handled gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [filter]);

  const handleMarkAsRead = async (id: number) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: 'Read' } : n))
      );
    } catch (err) {
      // Handled
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, status: 'Read' })));
    } catch (err) {
      // Handled
    }
  };

  const handleDismiss = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await notificationsApi.dismissNotification(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      // Handled
    }
  };

  const handleNotificationClick = async (notif: UserNotification) => {
    if (notif.status === 'Unread') {
      await handleMarkAsRead(notif.id);
    }
    if (notif.deepLink) {
      navigate(notif.deepLink);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest dark:text-sage-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-sage-600 dark:text-sage-400" />
            Notification Sanctuary
          </h1>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-0.5">
            Timely revision schedules, reflective rituals, and habit check-ins
          </p>
        </div>

        <button
          onClick={() => navigate('/notification-settings')}
          className="p-2.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border text-sage-600 dark:text-dark-muted hover:text-forest transition-colors shadow-soft-sm"
          title="Notification Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Chips & Mark All Read */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'all'
                ? 'bg-forest text-white'
                : 'bg-white/80 dark:bg-dark-surface text-sage-700 dark:text-dark-muted border border-sage-200/60'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              filter === 'unread'
                ? 'bg-forest text-white'
                : 'bg-white/80 dark:bg-dark-surface text-sage-700 dark:text-dark-muted border border-sage-200/60'
            }`}
          >
            Unread Only
          </button>
        </div>

        <button
          onClick={handleMarkAllAsRead}
          className="flex items-center gap-1 text-[11px] font-semibold text-sage-600 dark:text-dark-muted hover:text-forest transition-colors"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          <span>Mark all read</span>
        </button>
      </div>

      {/* Notifications List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-sage-500">
          <Loader2 className="w-7 h-7 animate-spin mb-2 text-sage-400" />
          <p className="text-xs">Gathering alerts...</p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white/60 dark:bg-dark-surface border border-dashed border-sage-300">
          <Bell className="w-10 h-10 mx-auto text-sage-400/80 mb-2" />
          <h3 className="font-serif font-bold text-forest dark:text-sage-200 text-sm">Quiet & Serene</h3>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-1 max-w-xs mx-auto">
            You are all caught up with your CAT revision schedules and reminders.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => {
            const isUnread = notif.status === 'Unread';

            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer group shadow-soft-sm ${
                  isUnread
                    ? 'bg-white dark:bg-dark-surface border-sage-300/80 dark:border-sage-500/40 ring-1 ring-sage-400/20'
                    : 'bg-ivory-100/60 dark:bg-dark-surface/50 border-sage-200/50 dark:border-dark-border opacity-80'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        isUnread ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-transparent'
                      }`}
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-serif font-bold text-forest dark:text-sage-100">
                          {notif.title}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-sage-100 dark:bg-dark-bg text-sage-700 dark:text-dark-muted">
                          {notif.categoryCode}
                        </span>
                      </div>

                      <p className="text-xs text-sage-700 dark:text-dark-text mt-1 leading-relaxed">
                        {notif.message}
                      </p>

                      {notif.deepLink && (
                        <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-forest dark:text-sage-300 group-hover:underline">
                          <span>View Action</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDismiss(e, notif.id)}
                    className="p-1 text-sage-400 hover:text-rose-600 transition-colors shrink-0"
                    title="Dismiss"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
