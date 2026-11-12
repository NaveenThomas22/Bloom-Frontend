import React from 'react';
import { RotateCcw, Target, Flame } from 'lucide-react';
import type { RevisionRetentionDto, GoalAnalyticsDto, HabitConsistencyDto } from '@/types/analytics';

interface RetentionAndHabitsProps {
  revisions?: RevisionRetentionDto;
  goals?: GoalAnalyticsDto[];
  habits?: HabitConsistencyDto[];
  isLoading: boolean;
}

export const RetentionAndHabitsView: React.FC<RetentionAndHabitsProps> = ({
  revisions,
  goals = [],
  habits = [],
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-sage-500 animate-pulse">
        Loading Retention, Goals & Habit Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Spaced Repetition Retention Card */}
      {revisions && (
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-forest dark:text-sage-300" />
              Spaced Repetition & Retention Health
            </h4>
            <span className="text-xs font-semibold text-forest dark:text-sage-300">
              {revisions.completionRatePercentage}% on-time completion
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border text-center">
              <span className="text-[10px] text-sage-500">Total Scheduled</span>
              <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
                {revisions.totalSchedules}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-mint/30 dark:bg-dark-surface text-center">
              <span className="text-[10px] text-sage-600 dark:text-dark-muted font-medium">Completed</span>
              <div className="text-xl font-bold font-serif text-forest dark:text-sage-200">
                {revisions.completedSchedules}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 text-center">
              <span className="text-[10px] text-rose-dark font-medium">Overdue</span>
              <div className="text-xl font-bold font-serif text-rose-dark">
                {revisions.overdueSchedules}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border text-center">
              <span className="text-[10px] text-sage-500">Avg Retention Rating</span>
              <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
                {revisions.averageConfidence} / 5
              </div>
            </div>
          </div>

          {/* Understanding Level Breakdown */}
          {Object.keys(revisions.understandingDistribution).length > 0 && (
            <div className="pt-2 border-t border-sage-100 dark:border-dark-border">
              <span className="text-[10px] font-bold uppercase text-sage-500 dark:text-dark-muted mb-2 block">
                Understanding Self-Assessment
              </span>
              <div className="flex flex-wrap gap-2">
                {Object.entries(revisions.understandingDistribution).map(([level, count]) => (
                  <span
                    key={level}
                    className="px-2.5 py-1 rounded-xl bg-sage-100/70 dark:bg-dark-surface text-xs text-sage-800 dark:text-sage-200 font-medium"
                  >
                    {level}: <strong>{count}</strong>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Goals & Habits Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Active Goals */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 text-forest dark:text-sage-300">
            <Target className="w-4 h-4" />
            <h4 className="font-serif font-bold text-sm text-sage-950 dark:text-sage-100">
              Active Goals & Targets
            </h4>
          </div>

          {goals.length === 0 ? (
            <p className="text-xs text-sage-500 py-3">No active goals configured yet.</p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {goals.map((g) => (
                <div
                  key={g.goalId}
                  className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sage-900 dark:text-sage-100">{g.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sage-200/60 dark:bg-dark-border text-sage-800 dark:text-sage-200">
                      {g.goalPeriod}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-sage-600 dark:text-dark-muted">
                      <span>{g.currentValue} / {g.targetValue} {g.unit}</span>
                      <span className="font-semibold">{Math.round(g.progressPercentage)}%</span>
                    </div>
                    <div className="w-full bg-sage-200/50 dark:bg-dark-surface h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-forest dark:bg-sage-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, g.progressPercentage)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Habit Consistency */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-dark">
            <Flame className="w-4 h-4" />
            <h4 className="font-serif font-bold text-sm text-sage-950 dark:text-sage-100">
              Habit Consistency & Streaks
            </h4>
          </div>

          {habits.length === 0 ? (
            <p className="text-xs text-sage-500 py-3">No habits tracked yet. Set up daily habits to build consistency.</p>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {habits.map((h) => (
                <div
                  key={h.habitId}
                  className="flex items-center justify-between p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-sage-900 dark:text-sage-100">{h.habitName}</div>
                    <div className="text-[10px] text-sage-500 dark:text-dark-muted">
                      {h.frequency} • {h.completionRatePercentage}% completion
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-dark font-bold text-xs">
                      <Flame className="w-3.5 h-3.5" />
                      {h.currentStreak}d
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
