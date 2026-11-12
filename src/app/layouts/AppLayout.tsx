import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Header } from '@/components/navigation/Header';
import { BottomNav } from '@/components/navigation/BottomNav';
import { ActiveTimerWidget } from '@/features/activities/components/ActiveTimerWidget';
import { OfflineIndicator } from '@/components/common/OfflineIndicator';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2 } from 'lucide-react';

export const AppLayout: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuthStore();

  if (isInitializing) {
    return (
      <div className="min-h-screen min-h-[100dvh] flex flex-col items-center justify-center bg-ivory-200 dark:bg-dark-bg text-forest dark:text-sage-300">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-sage-400" />
        <p className="font-serif text-sm tracking-wide">Cultivating your space...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen min-h-[100dvh] bg-ivory-200 dark:bg-dark-bg text-sage-950 dark:text-dark-text flex flex-col transition-colors duration-200">
      <OfflineIndicator />
      <Header />

      <main className="flex-1 w-full max-w-lg mx-auto px-4 pt-4 pb-28">
        <Outlet />
      </main>

      <ActiveTimerWidget />
      <BottomNav />
    </div>
  );
};

