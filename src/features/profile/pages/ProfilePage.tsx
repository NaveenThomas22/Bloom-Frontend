import React, { useState } from 'react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  User as UserIcon,
  Mail,
  LogOut,
  Save,
  CheckCircle,
  AlertCircle,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, isUpdatingProfile, logout, isLoggingOut } = useAuth();

  const currentYear = new Date().getFullYear();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    catTargetYear: user?.profile?.catTargetYear || currentYear,
    catExamDate: user?.profile?.catExamDate ? user.profile.catExamDate.split('T')[0] : '',
    dateOfBirth: user?.profile?.dateOfBirth ? user.profile.dateOfBirth.split('T')[0] : '',
    preparationLevel: user?.profile?.preparationLevel || 'Beginner',
    preparationMode: user?.profile?.preparationMode || 'SelfStudy',
    timezone: user?.profile?.timezone || 'Asia/Kolkata',
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    try {
      await updateProfile({
        fullName: formData.fullName.trim(),
        catTargetYear: Number(formData.catTargetYear),
        catExamDate: formData.catExamDate ? formData.catExamDate : null,
        dateOfBirth: formData.dateOfBirth ? formData.dateOfBirth : null,
        preparationLevel: formData.preparationLevel,
        preparationMode: formData.preparationMode,
        timezone: formData.timezone,
      });

      setFeedback({ type: 'success', message: 'Profile details saved successfully.' });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Failed to update profile.';
      setFeedback({ type: 'error', message: msg });
    }
  };

  const handleLogout = async (allDevices = false) => {
    await logout(allDevices);
  };

  const joinedDate = user?.createdAtUtc
    ? new Date(user.createdAtUtc).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : 'Recently';

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* User Header Card */}
      <Card className="flex items-center gap-4 bg-gradient-to-br from-white/95 to-mint/20 dark:from-dark-card dark:to-dark-surface/40">
        <div className="w-14 h-14 rounded-3xl bg-forest dark:bg-dark-surface text-white dark:text-sage-200 flex items-center justify-center font-serif text-2xl font-bold shadow-soft shrink-0">
          {user?.fullName?.charAt(0).toUpperCase() || 'A'}
        </div>

        <div className="space-y-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100 truncate">
              {user?.fullName || 'Aspirant'}
            </h1>
            <Badge variant="sage" className="text-[10px] py-0.5">
              CAT {user?.profile?.catTargetYear || currentYear}
            </Badge>
          </div>
          <p className="text-xs text-sage-600 dark:text-dark-muted truncate">{user?.email}</p>
          <p className="text-[10px] text-sage-500 dark:text-dark-muted">Nurturing since {joinedDate}</p>
        </div>
      </Card>

      {/* Edit Profile Form */}
      <Card className="space-y-5">
        <div className="flex items-center justify-between border-b border-sage-200/50 dark:border-dark-border pb-3">
          <h2 className="text-sm font-semibold text-sage-900 dark:text-sage-100 flex items-center gap-2">
            <Compass className="w-4 h-4 text-forest dark:text-sage-300" />
            <span>Preparation Profile</span>
          </h2>
          <span className="text-[11px] text-sage-500 dark:text-dark-muted">Synchronized with MySQL</span>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            icon={<UserIcon className="w-4 h-4" />}
            required
          />

          <Input
            label="Registered Email (Immutable)"
            type="email"
            value={user?.email || ''}
            disabled
            icon={<Mail className="w-4 h-4" />}
            helperText="Associated with your primary account credentials."
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Target CAT Year"
              value={formData.catTargetYear}
              onChange={(e) => setFormData({ ...formData, catTargetYear: Number(e.target.value) })}
              options={[
                { value: currentYear, label: `CAT ${currentYear}` },
                { value: currentYear + 1, label: `CAT ${currentYear + 1}` },
                { value: currentYear + 2, label: `CAT ${currentYear + 2}` },
              ]}
            />

            <Input
              label="Target Exam Date"
              type="date"
              value={formData.catExamDate}
              onChange={(e) => setFormData({ ...formData, catExamDate: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Preparation Level"
              value={formData.preparationLevel}
              onChange={(e) => setFormData({ ...formData, preparationLevel: e.target.value })}
              options={[
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
              ]}
            />

            <Select
              label="Preparation Mode"
              value={formData.preparationMode}
              onChange={(e) => setFormData({ ...formData, preparationMode: e.target.value })}
              options={[
                { value: 'SelfStudy', label: 'Self Study' },
                { value: 'Coaching', label: 'Coaching Institute' },
                { value: 'Hybrid', label: 'Hybrid' },
              ]}
            />
          </div>

          <Input
            label="Timezone"
            type="text"
            value={formData.timezone}
            onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
            helperText="Used to accurately anchor your 24-hour daily timeline."
          />

          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-2"
            isLoading={isUpdatingProfile}
            icon={<Save className="w-4 h-4" />}
          >
            Save Profile Changes
          </Button>
        </form>
      </Card>

      {/* Account Security & Logout */}
      <Card className="space-y-4">
        <h2 className="text-sm font-semibold text-sage-900 dark:text-sage-100 flex items-center gap-2 border-b border-sage-200/50 dark:border-dark-border pb-3">
          <ShieldCheck className="w-4 h-4 text-forest dark:text-sage-300" />
          <span>Session & Security</span>
        </h2>

        <div className="space-y-2.5">
          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full justify-between"
            onClick={() => handleLogout(false)}
            isLoading={isLoggingOut}
            icon={<LogOut className="w-4 h-4 text-sage-600" />}
          >
            Sign Out of this Device
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            className="w-full justify-between text-rose-dark hover:bg-rose/10 border-rose/30"
            onClick={() => handleLogout(true)}
            isLoading={isLoggingOut}
            icon={<LogOut className="w-4 h-4 text-rose-dark" />}
          >
            Revoke All Active Sessions (All Devices)
          </Button>
        </div>
      </Card>
    </div>
  );
};
