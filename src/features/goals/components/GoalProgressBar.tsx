import React from 'react';

interface GoalProgressBarProps {
  progressPercentage: number;
  isAchieved?: boolean;
  className?: string;
}

export const GoalProgressBar: React.FC<GoalProgressBarProps> = ({
  progressPercentage,
  isAchieved = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, progressPercentage));

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center text-xs mb-1 font-sans">
        <span className="text-sage-600 dark:text-sage-400 font-medium">
          {progressPercentage.toFixed(0)}%
        </span>
        {isAchieved && (
          <span className="text-forest dark:text-sage-200 text-[11px] font-semibold flex items-center gap-1">
            ✓ Target Achieved
          </span>
        )}
      </div>
      <div className="w-full h-2.5 bg-sage-100 dark:bg-dark-border rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 rounded-full ${
            isAchieved
              ? 'bg-gradient-to-r from-forest to-sage-600'
              : progressPercentage >= 50
              ? 'bg-gradient-to-r from-sage-400 to-forest'
              : 'bg-sage-400'
          }`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
};

