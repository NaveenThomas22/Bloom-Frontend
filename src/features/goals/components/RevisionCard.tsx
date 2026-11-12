import React from 'react';
import { RotateCcw, Calendar, AlertCircle, FastForward, Clock } from 'lucide-react';
import type { RevisionSchedule } from '@/types/goals';

interface RevisionCardProps {
  schedule: RevisionSchedule;
  onReview: (schedule: RevisionSchedule) => void;
  onReschedule: (schedule: RevisionSchedule) => void;
  onSkip: (schedule: RevisionSchedule) => void;
}

export const RevisionCard: React.FC<RevisionCardProps> = ({
  schedule,
  onReview,
  onReschedule,
  onSkip,
}) => {
  const isOverdue = schedule.status === 'Overdue';
  const isDueToday = schedule.status === 'DueToday';

  const badgeConfig = isOverdue
    ? { text: 'Overdue', bg: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300', icon: AlertCircle }
    : isDueToday
    ? { text: 'Due Today', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300', icon: Clock }
    : { text: 'Upcoming', bg: 'bg-sage-100 text-forest dark:bg-dark-card dark:text-sage-200', icon: Calendar };

  const BadgeIcon = badgeConfig.icon;

  return (
    <div
      className={`rounded-2xl border p-4 transition-all shadow-soft-sm ${
        isOverdue
          ? 'bg-rose-50/40 dark:bg-dark-surface border-rose-200/80 dark:border-rose-900/40'
          : isDueToday
          ? 'bg-amber-50/30 dark:bg-dark-surface border-amber-200/70 dark:border-amber-900/30'
          : 'bg-white dark:bg-dark-surface border-sage-200/60 dark:border-dark-border'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${badgeConfig.bg}`}>
              <BadgeIcon className="w-3 h-3" />
              {badgeConfig.text}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-sage-100 dark:bg-dark-card text-sage-700 dark:text-sage-300">
              Step {schedule.stepNumber}
            </span>
            {schedule.subjectName && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-200">
                {schedule.subjectName}
              </span>
            )}
          </div>

          <h4 className="font-serif text-base font-semibold text-forest dark:text-sage-100 truncate">
            {schedule.topicName}
          </h4>

          <div className="flex items-center gap-3 text-xs text-sage-500 dark:text-dark-muted mt-1">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-sage-400" />
              {schedule.scheduledDate}
            </span>
            <span>Policy: {schedule.policyName}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 pt-3 border-t border-sage-100 dark:border-dark-border/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onReschedule(schedule)}
            className="px-2.5 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border text-sage-600 dark:text-sage-300 text-xs font-medium hover:bg-sage-50 dark:hover:bg-dark-card transition-colors flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" /> Reschedule
          </button>
          <button
            onClick={() => onSkip(schedule)}
            className="px-2.5 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border text-sage-500 dark:text-dark-muted text-xs font-medium hover:bg-sage-50 dark:hover:bg-dark-card transition-colors flex items-center gap-1"
          >
            <FastForward className="w-3 h-3" /> Skip
          </button>
        </div>

        <button
          onClick={() => onReview(schedule)}
          className="px-3.5 py-1.5 rounded-xl bg-forest hover:bg-forest/90 text-ivory-100 text-xs font-semibold shadow-soft-sm flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3 h-3" /> Review Now
        </button>
      </div>
    </div>
  );
};

