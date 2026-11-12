import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '@/components/common/Logo';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '../hooks/useAuth';
import { Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, isLoggingIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password) {
      newErrors.password = 'Please enter your password.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    try {
      await login({ email: email.trim(), password });
    } catch (err: any) {
      const serverMessage =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        'Unable to sign in. Please verify your credentials.';
      setErrors({ general: serverMessage });
    }
  };

  return (
    <div className="space-y-6 text-center animate-in fade-in duration-300">
      <div className="flex flex-col items-center space-y-2">
        <Logo size="md" showSubtitle={true} />
        <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100 mt-2">
          Welcome Back
        </h1>
        <p className="text-xs text-sage-600 dark:text-dark-muted">
          Step back into your calm study sanctuary
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
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="aspirant@bloom.cat"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email}
            autoComplete="email"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            icon={<Lock className="w-4 h-4" />}
            error={errors.password}
            autoComplete="current-password"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isLoggingIn}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Enter Sanctuary
          </Button>
        </form>
      </Card>

      <p className="text-xs text-sage-600 dark:text-dark-muted">
        New aspirant?{' '}
        <Link to="/register" className="font-semibold text-forest dark:text-sage-300 hover:underline">
          Create your journey
        </Link>
      </p>
    </div>
  );
};

