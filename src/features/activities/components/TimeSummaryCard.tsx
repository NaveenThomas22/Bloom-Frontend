import React from 'react';
import type { DailyTimeSummaryDto } from '@/types/activity';
import { formatDurationMinutes } from '@/lib/utils/dateUtils';
import { PieChart, BookOpen, Moon, Utensils, Clock } from 'lucide-react';

interface TimeSummaryCardProps {
  summary: DailyTimeSummaryDto;
}

export const TimeSummaryCard: React.FC<TimeSummaryCardProps> = ({ summary }) => {
  const totalDayMinutes = summary.totalDayMinutes ?? (summary as any).TotalDayMinutes ?? 1440;
  const trackedMinutes = summary.trackedMinutes ?? (summary as any).TrackedMinutes ?? 0;
  const untrackedMinutes = summary.untrackedMinutes ?? (summary as any).UntrackedMinutes ?? 0;
  const studyMinutes = summary.studyMinutes ?? (summary as any).StudyMinutes ?? 0;
  const sleepMinutes = summary.sleepMinutes ?? (summary as any).SleepMinutes ?? 0;
  const mealMinutes = summary.mealMinutes ?? (summary as any).MealMinutes ?? 0;
  const distribution = summary.distribution ?? (summary as any).Distribution ?? [];
  const subjectBreakdown = summary.subjectStudyBreakdown ?? (summary as any).SubjectStudyBreakdown ?? [];

  const trackedPct =
    totalDayMinutes > 0 ? Math.min(100, Math.round((trackedMinutes / totalDayMinutes) * 100)) : 0;

  return (
    <div className="bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-3xl p-5 border border-sage-200/70 dark:border-dark-border shadow-soft-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-sm font-bold text-sage-950 dark:text-sage-100 flex items-center gap-2">
          <PieChart className="w-4 h-4 text-forest dark:text-sage-300" />
          24-Hour Time Accounting
        </h3>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-200">
          {trackedPct}% Day Accounted
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="p-3 rounded-2xl bg-forest/5 dark:bg-forest/10 border border-forest/10 dark:border-forest/20 space-y-1">
          <div className="flex items-center gap-1.5 text-forest dark:text-sage-300 font-medium text-[11px]">
            <BookOpen className="w-3.5 h-3.5" />
            CAT Study
          </div>
          <div className="text-base font-bold text-sage-950 dark:text-sage-100">
            {formatDurationMinutes(studyMinutes)}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-medium text-[11px]">
            <Moon className="w-3.5 h-3.5" />
            Rest & Sleep
          </div>
          <div className="text-base font-bold text-sage-950 dark:text-sage-100">
            {formatDurationMinutes(sleepMinutes)}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/40 space-y-1">
          <div className="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-medium text-[11px]">
            <Utensils className="w-3.5 h-3.5" />
            Meals & Breaks
          </div>
          <div className="text-base font-bold text-sage-950 dark:text-sage-100">
            {formatDurationMinutes(mealMinutes)}
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-stone-100/60 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 space-y-1">
          <div className="flex items-center gap-1.5 text-stone-600 dark:text-dark-muted font-medium text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            Untracked Gap
          </div>
          <div className="text-base font-bold text-sage-950 dark:text-sage-100">
            {formatDurationMinutes(untrackedMinutes)}
          </div>
        </div>
      </div>

      {/* CAT Subject Study Breakdown */}
      {subjectBreakdown.length > 0 && (
        <div className="pt-2 border-t border-sage-100 dark:border-dark-border/60 space-y-2">
          <div className="text-xs font-semibold text-sage-800 dark:text-sage-200">
            Subject Study Focus
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {subjectBreakdown.map((subj: any) => {
              const code = subj.subjectCode ?? subj.SubjectCode;
              const hours = subj.totalHours ?? subj.TotalHours;
              return (
                <div
                  key={code}
                  className="p-2.5 rounded-xl bg-ivory-100 dark:bg-dark-surface border border-sage-200/50 dark:border-dark-border/50 text-center"
                >
                  <div className="text-[10px] font-mono text-sage-500 uppercase tracking-wider">
                    {code}
                  </div>
                  <div className="font-bold text-sage-900 dark:text-sage-100 text-xs mt-0.5">
                    {hours}h
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Group Distribution Bars */}
      {distribution.length > 0 && (
        <div className="pt-2 border-t border-sage-100 dark:border-dark-border/60 space-y-2">
          <div className="text-xs font-semibold text-sage-800 dark:text-sage-200">
            Time Distribution Across Life Spheres
          </div>
          <div className="space-y-1.5">
            {distribution.map((item: any) => {
              const group = item.categoryGroup ?? item.CategoryGroup;
              const color = item.color ?? item.Color;
              const totalMins = item.totalMinutes ?? item.TotalMinutes ?? 0;
              const pct = item.percentageOfDay ?? item.PercentageOfDay ?? 0;
              return (
                <div key={group} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-sage-600 dark:text-dark-muted">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      {group}
                    </span>
                    <span className="font-mono">
                      {formatDurationMinutes(totalMins)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-ivory-200 dark:bg-dark-surface rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, pct)}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
