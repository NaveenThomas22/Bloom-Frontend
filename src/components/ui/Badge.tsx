import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'sage' | 'mint' | 'forest' | 'rose' | 'beige';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'mint',
  className = '',
  ...props
}) => {
  const variantStyles = {
    mint: 'bg-mint/60 text-forest dark:bg-dark-surface dark:text-sage-300 border-sage-200/70 dark:border-dark-border',
    sage: 'bg-sage-100 text-forest dark:bg-sage-900/60 dark:text-sage-200 border-sage-300/60 dark:border-sage-800',
    forest: 'bg-forest text-white dark:bg-forest dark:text-sage-100 border-forest',
    rose: 'bg-rose/40 text-rose-dark dark:bg-rose-dark/20 dark:text-rose border-rose/60 dark:border-rose-dark/40',
    beige: 'bg-beige/60 text-sage-900 dark:bg-dark-surface dark:text-beige border-beige-dark/40 dark:border-dark-border',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-colors ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

