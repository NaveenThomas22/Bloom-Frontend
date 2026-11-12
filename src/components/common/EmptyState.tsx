import React from 'react';
import { Card } from '../ui/Card';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  phaseBadge?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  phaseBadge = 'Coming in Upcoming Phase',
  actionText,
  onAction,
}) => {
  return (
    <Card className="flex flex-col items-center justify-center text-center p-8 border-dashed border-sage-300/80 dark:border-dark-border">
      <div className="w-16 h-16 rounded-3xl bg-mint/50 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 mb-4 shadow-soft-sm">
        {icon}
      </div>

      {phaseBadge && (
        <span className="inline-block px-3 py-1 rounded-full text-[11px] font-medium bg-sage-100 text-forest dark:bg-dark-surface dark:text-sage-300 border border-sage-200 dark:border-dark-border mb-3">
          {phaseBadge}
        </span>
      )}

      <h3 className="font-serif text-lg font-semibold text-sage-950 dark:text-sage-100 mb-1.5">
        {title}
      </h3>

      <p className="text-xs text-sage-600 dark:text-dark-muted max-w-xs leading-relaxed mb-5">
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-xs font-semibold text-forest dark:text-sage-300 hover:underline"
        >
          {actionText}
        </button>
      )}
    </Card>
  );
};

