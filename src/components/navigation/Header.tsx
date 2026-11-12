import React from 'react';
import { NavLink } from 'react-router-dom';
import { Moon, Sun, Settings, Bell } from 'lucide-react';
import { Logo } from '../common/Logo';
import { useAuthStore } from '@/store/useAuthStore';

export const Header: React.FC = () => {
  const { theme, setTheme } = useAuthStore();
  const isDark = theme.toLowerCase().includes('dark') || theme.toLowerCase().includes('forest');

  const toggleTheme = () => {
    setTheme(isDark ? 'Sage Garden' : 'Dark Forest');
  };

  return (
    <header className="sticky top-0 z-30 bg-ivory-200/90 dark:bg-dark-bg/90 backdrop-blur-md border-b border-sage-200/40 dark:border-dark-border/40 px-4 py-3 transition-colors duration-200">
      <div className="max-w-lg mx-auto flex items-center justify-between">
        <NavLink to="/dashboard" className="flex items-center">
          <Logo size="sm" showSubtitle={false} />
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink
            to="/notifications"
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border text-sage-600 dark:text-sage-200 hover:text-forest transition-colors shadow-soft-sm active:scale-95"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
          </NavLink>

          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border text-sage-600 dark:text-sage-200 hover:text-forest transition-colors shadow-soft-sm active:scale-95"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <NavLink
            to="/settings"
            className="p-2.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border text-sage-600 dark:text-sage-200 hover:text-forest transition-colors shadow-soft-sm active:scale-95"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </NavLink>
        </div>
      </div>
    </header>
  );
};

