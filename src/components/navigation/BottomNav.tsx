import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, BookOpen, TrendingUp, User } from 'lucide-react';

interface NavItem {
  name: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/dashboard', icon: Home },
  { name: 'Planner', path: '/planner', icon: Calendar },
  { name: 'Study', path: '/study', icon: BookOpen },
  { name: 'Insights', path: '/insights', icon: TrendingUp },
  { name: 'Profile', path: '/profile', icon: User },
];

export const BottomNav: React.FC = () => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-dark-card/95 backdrop-blur-md border-t border-sage-200/60 dark:border-dark-border pb-[env(safe-area-inset-bottom,12px)] pt-2 shadow-soft-lg">
      <div className="max-w-lg mx-auto px-4 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-200 select-none ${isActive
                  ? 'text-forest dark:text-sage-100 font-semibold scale-105'
                  : 'text-sage-500 dark:text-dark-muted hover:text-forest dark:hover:text-sage-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`p-1 rounded-xl transition-all ${isActive ? 'bg-mint/60 dark:bg-dark-surface shadow-soft-sm' : ''
                      }`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] mt-0.5 tracking-tight">{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

