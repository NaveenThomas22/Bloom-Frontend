import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import {
  Palette,
  Clock,
  Bell,
  Save,
  CheckCircle,
  AlertCircle,
  Check
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updatePreferences, isUpdatingPreferences } = useAuth();

  const [formData, setFormData] = useState({
    theme: user?.preferences?.theme || 'Sage Garden',
    dailyStudyTargetMinutes: user?.preferences?.dailyStudyTargetMinutes || 360,
    preferredWakeTime: user?.preferences?.preferredWakeTime || '06:00:00',
    preferredSleepTime: user?.preferences?.preferredSleepTime || '22:30:00',
    notificationEnabled: user?.preferences?.notificationEnabled ?? true,
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      await updatePreferences({
        theme: formData.theme,
        dailyStudyTargetMinutes: Number(formData.dailyStudyTargetMinutes),
        preferredWakeTime: formData.preferredWakeTime,
        preferredSleepTime: formData.preferredSleepTime,
        notificationEnabled: formData.notificationEnabled,
      });

      setFeedback({ type: 'success', message: 'Preferences updated successfully.' });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Failed to update preferences.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const themes = [
    {
      id: 'Sage Garden',
      name: 'Sage Garden',
      desc: 'Serene earthy greens, warm ivory, soft botanical accents.',
      bgClass: 'bg-[#F8F5EB] border-[#A8BDA5]',
      accentClass: 'bg-[#A8BDA5]',
    },
    {
      id: 'Dark Forest',
      name: 'Dark Forest',
      desc: 'Muted charcoal and deep forest green for low-light focus.',
      bgClass: 'bg-[#141A17] border-[#405B49]',
      accentClass: 'bg-[#405B49]',
    },
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
          Preferences & Environment
        </h1>
        <p className="text-xs text-sage-600 dark:text-dark-muted">
          Tailor your daily study rhythms and sanctuary aesthetic
        </p>
      </div>

      {feedback && (
        <div
          className={`flex items-start gap-2.5 p-3 rounded-2xl text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-mint/60 text-forest border border-mint-dark/40 dark:bg-dark-surface dark:text-sage-200'
              : 'bg-rose/40 text-rose-dark border border-rose/60'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-forest shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-dark shrink-0 mt-0.5" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Picker */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-sage-900 dark:text-sage-100 flex items-center gap-2 border-b border-sage-200/50 dark:border-dark-border pb-3">
            <Palette className="w-4 h-4 text-forest dark:text-sage-300" />
            <span>Theme Aesthetic</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((t) => {
              const isSelected = formData.theme.toLowerCase() === t.id.toLowerCase();
              return (
                <div
                  key={t.id}
                  onClick={() => setFormData({ ...formData, theme: t.id })}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-forest dark:border-sage-300 shadow-soft-sm bg-white dark:bg-dark-surface'
                      : 'border-sage-200/70 dark:border-dark-border bg-white/60 dark:bg-dark-card/60 hover:border-sage-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${t.accentClass}`} />
                      <span className="text-xs font-semibold text-sage-950 dark:text-sage-100">
                        {t.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-forest dark:text-sage-300" />}
                  </div>
                  <p className="text-[11px] text-sage-600 dark:text-dark-muted leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Daily Study Goals & Timeline Rhythms */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-sage-900 dark:text-sage-100 flex items-center gap-2 border-b border-sage-200/50 dark:border-dark-border pb-3">
            <Clock className="w-4 h-4 text-forest dark:text-sage-300" />
            <span>Daily Schedule Targets</span>
          </h2>

          <Select
            label="Daily Study Target"
            value={formData.dailyStudyTargetMinutes}
            onChange={(e) =>
              setFormData({ ...formData, dailyStudyTargetMinutes: Number(e.target.value) })
            }
            options={[
              { value: 180, label: '3 Hours (180 min)' },
              { value: 240, label: '4 Hours (240 min)' },
              { value: 300, label: '5 Hours (300 min)' },
              { value: 360, label: '6 Hours (360 min) — Recommended' },
              { value: 420, label: '7 Hours (420 min)' },
              { value: 480, label: '8 Hours (480 min)' },
              { value: 600, label: '10 Hours (600 min)' },
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Preferred Wake Time"
              type="time"
              value={formData.preferredWakeTime}
              onChange={(e) => setFormData({ ...formData, preferredWakeTime: e.target.value })}
            />

            <Input
              label="Preferred Sleep Time"
              type="time"
              value={formData.preferredSleepTime}
              onChange={(e) => setFormData({ ...formData, preferredSleepTime: e.target.value })}
            />
          </div>
        </Card>

        {/* Notifications & Reminders */}
        <Card className="space-y-4">
          <h2 className="text-sm font-semibold text-sage-900 dark:text-sage-100 flex items-center gap-2 border-b border-sage-200/50 dark:border-dark-border pb-3">
            <Bell className="w-4 h-4 text-forest dark:text-sage-300" />
            <span>Spaced Repetition & Reminders</span>
          </h2>

          <label className="flex items-center justify-between p-3 rounded-2xl bg-sage-50/60 dark:bg-dark-surface border border-sage-200/50 dark:border-dark-border cursor-pointer select-none">
            <div className="space-y-0.5">
              <span className="text-xs font-semibold text-sage-900 dark:text-sage-100 block">
                Revision & Goal Alerts
              </span>
              <span className="text-[11px] text-sage-500 dark:text-dark-muted block">
                Receive notifications when topics are due for spaced repetition.
              </span>
            </div>

            <input
              type="checkbox"
              checked={formData.notificationEnabled}
              onChange={(e) => setFormData({ ...formData, notificationEnabled: e.target.checked })}
              className="w-5 h-5 rounded-lg accent-forest cursor-pointer"
            />
          </label>
        </Card>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isUpdatingPreferences}
          icon={<Save className="w-4 h-4" />}
        >
          Save All Preferences
        </Button>
      </form>
    </div>
  );
};
