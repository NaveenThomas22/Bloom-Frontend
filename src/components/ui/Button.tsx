import React from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none select-none';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-3 text-sm gap-2',
    lg: 'px-6 py-3.5 text-base gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-forest text-white hover:bg-forest-light dark:bg-forest dark:hover:bg-forest-light shadow-soft',
    secondary:
      'bg-white dark:bg-dark-surface text-forest dark:text-sage-200 border border-sage-200 dark:border-dark-border hover:bg-sage-50 dark:hover:bg-dark-card',
    outline:
      'bg-transparent text-forest dark:text-sage-300 border border-forest/30 dark:border-sage-400/30 hover:bg-sage-100/50 dark:hover:bg-dark-surface',
    ghost:
      'bg-transparent text-forest dark:text-sage-200 hover:bg-sage-100/40 dark:hover:bg-dark-surface',
    danger:
      'bg-rose-dark text-white hover:bg-rose-dark/90 shadow-soft',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        icon && <span className="inline-flex shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};

