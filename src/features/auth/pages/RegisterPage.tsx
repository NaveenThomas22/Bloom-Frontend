import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, isRegistering } = useAuth();

  const currentYear = new Date().getFullYear();
  const defaultTargetYear = new Date().getMonth() >= 11 ? currentYear + 1 : currentYear;

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    catTargetYear: defaultTargetYear,
    preparationLevel: 'Beginner',
    preparationMode: 'SelfStudy',
    timezone: 'Asia/Kolkata',
    theme: 'Sage Garden',
    dailyStudyTargetMinutes: 360,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }

    if (!formData.password || formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    } else if (
      !/[A-Z]/.test(formData.password) ||
      !/[a-z]/.test(formData.password) ||
      !/[0-9]/.test(formData.password) ||
      !/[\W_]/.test(formData.password)
    ) {
      errs.password = 'Must contain uppercase, lowercase, digit, and special character.';
    }

    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }

    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    try {
      await register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        catTargetYear: Number(formData.catTargetYear),
        preparationLevel: formData.preparationLevel,
        preparationMode: formData.preparationMode,
        timezone: formData.timezone,
        theme: formData.theme,
        dailyStudyTargetMinutes: Number(formData.dailyStudyTargetMinutes),
      });
    } catch (err: any) {
      const serverDetail = err?.response?.data?.detail;
      const serverMessage = err?.response?.data?.message;
      const validationDict = err?.response?.data?.errors;

      if (validationDict && typeof validationDict === 'object') {
        const mappedErrors: Record<string, string> = {};
        Object.keys(validationDict).forEach((k) => {
          mappedErrors[k.toLowerCase()] = Array.isArray(validationDict[k])
            ? validationDict[k][0]
            : validationDict[k];
        });
        setErrors(mappedErrors);
      } else {
        setErrors({ general: serverDetail || serverMessage || 'Registration failed. Please check your details.' });
      }
    }
  };

  return (
    <div className="space-y-6 text-center animate-in fade-in duration-300">
      <div className="flex flex-col items-center space-y-2">
        <Logo size="md" showSubtitle={true} />
        <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100 mt-2">
          Plant Your Journey
        </h1>
        <p className="text-xs text-sage-600 dark:text-dark-muted">
          Configure your personal CAT aspirant profile
        </p>
      </div>

      <Card className="text-left space-y-5">
        {errors.general && (
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-rose/30 dark:bg-rose-dark/20 border border-rose/50 dark:border-rose-dark/40 text-rose-dark dark:text-rose text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Aspirant Name"
            icon={<User className="w-4 h-4" />}
            error={errors.fullName}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="aspirant@bloom.cat"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password}
              required
            />

            <Input
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••••••"
              icon={<Lock className="w-4 h-4" />}
              error={errors.confirmPassword}
              required
            />
          </div>

          <div className="border-t border-sage-200/60 dark:border-dark-border pt-3 space-y-3">
            <h4 className="text-xs font-semibold text-sage-900 dark:text-sage-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sage-500" />
              <span>CAT Preparation Defaults</span>
            </h4>

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

              <Select
                label="Preparation Mode"
                value={formData.preparationMode}
                onChange={(e) => setFormData({ ...formData, preparationMode: e.target.value })}
                options={[
                  { value: 'SelfStudy', label: 'Self-Study' },
                  { value: 'Coaching', label: 'Coaching Institute' },
                  { value: 'Hybrid', label: 'Hybrid' },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Current Level"
                value={formData.preparationLevel}
                onChange={(e) => setFormData({ ...formData, preparationLevel: e.target.value })}
                options={[
                  { value: 'Beginner', label: 'Beginner (Starting)' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced (Retaker)' },
                ]}
              />

              <Select
                label="Daily Study Goal"
                value={formData.dailyStudyTargetMinutes}
                onChange={(e) => setFormData({ ...formData, dailyStudyTargetMinutes: Number(e.target.value) })}
                options={[
                  { value: 240, label: '4 Hours (240 min)' },
                  { value: 360, label: '6 Hours (360 min)' },
                  { value: 480, label: '8 Hours (480 min)' },
                  { value: 600, label: '10 Hours (600 min)' },
                ]}
              />
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-4"
            isLoading={isRegistering}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Create My Journey
          </Button>
        </form>
      </Card>

      <p className="text-xs text-sage-600 dark:text-dark-muted">
        Already have a sanctuary?{' '}
        <Link to="/login" className="font-semibold text-forest dark:text-sage-300 hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

