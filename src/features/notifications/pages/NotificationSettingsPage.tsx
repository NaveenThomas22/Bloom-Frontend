import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, BellRing, Moon, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { notificationsApi } from '@/lib/api/notificationsApi';
import type { NotificationCategory, UserNotificationPreference } from '@/types/notifications';

export const NotificationSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<NotificationCategory[]>([]);
  const [preferences, setPreferences] = useState<UserNotificationPreference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPushSupported, setIsPushSupported] = useState(false);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [pushFeedback, setPushFeedback] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  // Quiet Hours (global preference representation)
  const [quietStart, setQuietStart] = useState('23:00');
  const [quietEnd, setQuietEnd] = useState('07:00');

  useEffect(() => {
    setIsPushSupported('Notification' in window && 'serviceWorker' in navigator);
    if ('Notification' in window) {
      setIsPushEnabled(Notification.permission === 'granted');
    }

    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        const [catList, prefList] = await Promise.all([
          notificationsApi.getCategories(),
          notificationsApi.getPreferences(),
        ]);
        setCategories(catList);
        setPreferences(prefList);

        if (prefList.length > 0 && prefList[0].quietHoursStartUtc) {
          setQuietStart(prefList[0].quietHoursStartUtc.substring(0, 5));
        }
        if (prefList.length > 0 && prefList[0].quietHoursEndUtc) {
          setQuietEnd(prefList[0].quietHoursEndUtc.substring(0, 5));
        }
      } catch (err) {
        // Handled
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggleCategory = async (categoryCode: string, currentEnabled: boolean) => {
    try {
      const newEnabled = !currentEnabled;
      await notificationsApi.updatePreference(categoryCode, {
        isEnabled: newEnabled,
        quietHoursStartUtc: `${quietStart}:00`,
        quietHoursEndUtc: `${quietEnd}:00`,
        channels: isPushEnabled ? 'IN_APP,PUSH' : 'IN_APP',
        maxDailyAlerts: 10,
      });

      setPreferences((prev) =>
        prev.map((p) => (p.categoryCode === categoryCode ? { ...p, isEnabled: newEnabled } : p))
      );
      setSaveFeedback(`Preference for ${categoryCode} updated.`);
      setTimeout(() => setSaveFeedback(null), 2500);
    } catch (err) {
      alert('Failed to update preference.');
    }
  };

  const handlePushToggle = async () => {
    if (!isPushSupported) {
      alert('Web Push is not supported in this browser.');
      return;
    }

    try {
      if (!isPushEnabled) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          setIsPushEnabled(true);
          // Register mock/browser push subscription
          await notificationsApi.registerPushSubscription({
            endpoint: `https://push.bloom.app/client/${Math.random().toString(36).substring(2)}`,
            p256dh: 'BNc4x-p256dh-sample-key-bloom-pwa',
            auth: 'sample-auth-secret',
            userAgent: navigator.userAgent,
          });
          setPushFeedback('Push notifications enabled for this device.');
        } else {
          setPushFeedback('Push permission was not granted by browser.');
        }
      } else {
        setIsPushEnabled(false);
        setPushFeedback('Push notifications deactivated.');
      }
      setTimeout(() => setPushFeedback(null), 3000);
    } catch (err) {
      alert('Error updating push subscription.');
    }
  };

  const handleTriggerEvaluation = async () => {
    try {
      const count = await notificationsApi.triggerSmartCheck();
      alert(`Smart check completed: ${count} notifications evaluated/triggered.`);
    } catch (err) {
      alert('Error evaluating notifications.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-sage-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-sage-400" />
        <p className="text-xs font-serif">Loading notification settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/notifications')}
          className="flex items-center gap-1 text-xs text-sage-600 dark:text-dark-muted hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Notifications</span>
        </button>

        <button
          onClick={handleTriggerEvaluation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sage-200 text-xs font-semibold text-sage-700 dark:text-dark-muted hover:text-forest"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Trigger Smart Check</span>
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-serif font-bold text-forest dark:text-sage-100 flex items-center gap-2">
          <BellRing className="w-6 h-6 text-sage-600 dark:text-sage-400" />
          Notification Preferences
        </h1>
        <p className="text-xs text-sage-600 dark:text-dark-muted mt-0.5">
          Control reminder categories, quiet hours, and PWA push notifications
        </p>
      </div>

      {saveFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{saveFeedback}</span>
        </div>
      )}

      {/* PWA Web Push Toggle */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-mint/50 dark:bg-dark-bg text-forest dark:text-sage-300">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest dark:text-sage-100">
                PWA Push Notifications
              </h3>
              <p className="text-[11px] text-sage-600 dark:text-dark-muted">
                Receive reminders directly on your desktop or mobile lockscreen
              </p>
            </div>
          </div>

          <button
            onClick={handlePushToggle}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
              isPushEnabled ? 'bg-forest justify-end' : 'bg-sage-300 dark:bg-dark-border justify-start'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-white shadow-soft-sm" />
          </button>
        </div>

        {pushFeedback && (
          <div className="text-[11px] text-sage-700 dark:text-dark-muted pt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{pushFeedback}</span>
          </div>
        )}
      </div>

      {/* Quiet Hours */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <div className="flex items-center gap-2.5">
          <Moon className="w-5 h-5 text-indigo-500" />
          <div>
            <h3 className="font-serif font-bold text-sm text-forest dark:text-sage-100">
              Quiet Hours
            </h3>
            <p className="text-[11px] text-sage-600 dark:text-dark-muted">
              Push alerts will be suppressed during your rest and sleep hours
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">
              Quiet Hours Start
            </label>
            <input
              type="time"
              value={quietStart}
              onChange={(e) => setQuietStart(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">
              Quiet Hours End
            </label>
            <input
              type="time"
              value={quietEnd}
              onChange={(e) => setQuietEnd(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Category Toggles */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <h3 className="font-serif font-bold text-sm text-forest dark:text-sage-100 mb-1">
          Notification Categories
        </h3>

        <div className="space-y-3 divide-y divide-sage-100 dark:divide-dark-border/40">
          {categories.map((cat) => {
            const pref = preferences.find((p) => p.categoryCode === cat.categoryCode);
            const isEnabled = pref ? pref.isEnabled : cat.defaultEnabled;

            return (
              <div key={cat.id} className="pt-3 first:pt-0 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-forest dark:text-sage-100">
                    {cat.categoryName}
                  </div>
                  <div className="text-[11px] text-sage-600 dark:text-dark-muted mt-0.5">
                    {cat.description}
                  </div>
                </div>

                <button
                  onClick={() => handleToggleCategory(cat.categoryCode, isEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 focus:outline-none ${
                    isEnabled ? 'bg-forest justify-end' : 'bg-sage-300 dark:bg-dark-border justify-start'
                  }`}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-soft-sm" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
