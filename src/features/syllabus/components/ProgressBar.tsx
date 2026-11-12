import React from 'react';

export interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  size = 'md',
  className = '',
}) => {
  // Clamp progress between 0 and 100
  const clamped = Math.min(100, Math.max(0, isNaN(progress) ? 0 : progress));
  const rounded = Math.round(clamped);

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-3.5',
  };

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && (
            <span className="font-medium text-sage-800 dark:text-sage-200">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="font-semibold text-forest dark:text-sage-300 ml-auto tabular-nums">
              {rounded}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-sage-200/60 dark:bg-dark-border/80 rounded-full overflow-hidden ${heightClasses[size]}`}
        role="progressbar"
        aria-valuenow={rounded}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? 'Syllabus progress'}
      >
        <div
          className="h-full bg-gradient-to-r from-mint to-forest dark:from-forest dark:to-sage-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

