import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'muted' | 'interactive';
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variantStyles = {
    default:
      'bg-white/95 dark:bg-dark-card/95 border border-sage-200/60 dark:border-dark-border shadow-soft',
    muted:
      'bg-ivory-100/80 dark:bg-dark-surface/60 border border-sage-200/40 dark:border-dark-border/60',
    interactive:
      'bg-white/95 dark:bg-dark-card/95 border border-sage-200/60 dark:border-dark-border shadow-soft hover:shadow-soft-lg hover:border-sage-300 dark:hover:border-sage-700/60 cursor-pointer active:scale-[0.99] transition-all duration-200',
  };

  return (
    <div
      className={`rounded-3xl p-5 backdrop-blur-sm transition-all duration-200 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

