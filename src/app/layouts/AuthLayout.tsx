import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center bg-ivory-200 dark:bg-dark-bg text-forest dark:text-sage-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-sage-400" />
        <p className="font-serif text-sm tracking-wide">Cultivating your space...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-ivory-200 dark:bg-dark-bg text-sage-950 dark:text-dark-text flex flex-col justify-center px-4 py-8 relative overflow-hidden transition-colors duration-200">
      <OfflineIndicator />

      {/* Decorative Botanical Orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-sage-200/50 dark:bg-dark-surface/40 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-rose/30 dark:bg-forest/20 blur-3xl pointer-events-none" />

      <main className="w-full max-w-md mx-auto relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

