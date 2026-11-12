import React from 'react';
import { Target, Calendar, CheckCircle2, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { UserGoal } from '@/types/goals';
import { GoalProgressBar } from './GoalProgressBar';

interface GoalCardProps {
  goal: UserGoal;
  onEdit: (goal: UserGoal) => void;
  onDelete: (id: number) => void;
}

export const GoalCard: React.FC<GoalCardProps> = ({ goal, onEdit, onDelete }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="relative bg-white dark:bg-dark-surface rounded-2xl border border-sage-200/60 dark:border-dark-border p-4 shadow-soft-sm transition-all hover:shadow-soft-md">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sage-100 dark:bg-dark-card text-forest dark:text-sage-300">
              {goal.goalPeriod}
            </span>
            {goal.subjectName && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-200">
                {goal.subjectName}
              </span>
            )}
            {goal.isAchieved && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest text-ivory-100 dark:bg-sage-600">
                <CheckCircle2 className="w-3 h-3" /> Achieved
              </span>
            )}
          </div>
          <h4 className="font-serif text-base font-semibold text-forest dark:text-sage-100 truncate">
            {goal.title}
          </h4>
          {goal.description && (
            <p className="text-xs text-sage-600 dark:text-dark-muted line-clamp-1 mt-0.5">
              {goal.description}
            </p>
          )}
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg text-sage-400 hover:text-forest dark:hover:text-sage-200 transition-colors"
            aria-label="Goal options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-7 z-20 w-32 bg-white dark:bg-dark-card rounded-xl border border-sage-200/80 dark:border-dark-border shadow-soft-lg py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(goal);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-sage-700 dark:text-sage-300 hover:bg-sage-50 dark:hover:bg-dark-surface flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (confirm('Are you sure you want to delete this goal?')) {
                      onDelete(goal.id);
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Metric Target vs Current */}
      <div className="flex items-baseline justify-between mt-3 mb-1.5">
        <div className="flex items-center gap-1.5 text-xs text-sage-600 dark:text-sage-400">
          <Target className="w-3.5 h-3.5 text-sage-500" />
          <span>Progress</span>
        </div>
        <div className="text-right">
          <span className="font-sans font-semibold text-sm text-forest dark:text-sage-100">
            {goal.currentValue}
          </span>
          <span className="text-xs text-sage-500 dark:text-dark-muted">
            {' '}/ {goal.targetValue} {goal.unit}
          </span>
        </div>
      </div>

      <GoalProgressBar
        progressPercentage={goal.progressPercentage}
        isAchieved={goal.isAchieved}
      />

      {/* Target timeframe footer */}
      <div className="flex items-center justify-between text-[11px] text-sage-500 dark:text-dark-muted mt-3 pt-2 border-t border-sage-100 dark:border-dark-border/40">
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-sage-400" />
          {goal.startDate} to {goal.endDate}
        </span>
        {goal.daysRemaining > 0 ? (
          <span>{goal.daysRemaining} days left</span>
        ) : (
          <span>Final day</span>
        )}
      </div>
    </div>
  );
};

