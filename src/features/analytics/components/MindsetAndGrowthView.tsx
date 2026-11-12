import React from 'react';
import { Sparkles, Sun, Moon, Zap, Smile } from 'lucide-react';
import type { MindsetGrowthDto } from '@/types/analytics';

interface MindsetAndGrowthProps {
  data?: MindsetGrowthDto;
  isLoading: boolean;
}

export const MindsetAndGrowthView: React.FC<MindsetAndGrowthProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="p-8 text-center text-sage-500 animate-pulse">
        Loading Mindset & Growth Analytics...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reflection Completion & Energy Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Morning Reflections */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-500 mb-2">
            <span className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Morning Check-ins</span>
            <Sun className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
            {data.morningReflectionsCount}
          </div>
        </div>

        {/* Evening Reflections */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-indigo-400 mb-2">
            <span className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Evening Reviews</span>
            <Moon className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
            {data.eveningReflectionsCount}
          </div>
        </div>

        {/* Morning Energy Level */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-forest dark:text-sage-300 mb-2">
            <span className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Avg Morning Energy</span>
            <Zap className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
            {data.averageMorningEnergy ? `${data.averageMorningEnergy} / 5` : 'N/A'}
          </div>
        </div>

        {/* Evening Satisfaction Rating */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-dark mb-2">
            <span className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Avg Day Satisfaction</span>
            <Smile className="w-4 h-4" />
          </div>
          <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
            {data.averageEveningSatisfaction ? `${data.averageEveningSatisfaction} / 5` : 'N/A'}
          </div>
        </div>
      </div>

      {/* Mood Distribution */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-forest dark:text-sage-300" />
          Reflected Mood Balance (Aggregated Self-Awareness)
        </h4>

        {data.moodDistribution.length === 0 ? (
          <p className="text-xs text-sage-500 py-3">
            No mood entries logged yet. Record daily morning intentions or evening reflections to visualize emotional patterns.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {data.moodDistribution.map((m) => (
              <div
                key={m.moodCode}
                className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border text-center space-y-1"
              >
                <div className="text-2xl">{m.emoji}</div>
                <div className="font-semibold text-xs text-sage-900 dark:text-sage-100">{m.moodName}</div>
                <div className="text-[10px] text-sage-500 dark:text-dark-muted">
                  {m.count} ({m.percentage}%)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Daily Intention vs Actual Study Minutes */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted">
          Study Intentionality Comparison
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 rounded-xl bg-sage-50 dark:bg-dark-surface space-y-1">
            <span className="text-[10px] text-sage-500">Total Planned Study Target</span>
            <div className="text-lg font-bold font-serif text-sage-950 dark:text-sage-100">
              {Math.round(data.totalPlannedStudyMinutes / 60)} hrs ({data.totalPlannedStudyMinutes} mins)
            </div>
          </div>
          <div className="p-3 rounded-xl bg-mint/30 dark:bg-dark-surface space-y-1">
            <span className="text-[10px] text-sage-600 dark:text-dark-muted font-medium">Actual Elapsed Study</span>
            <div className="text-lg font-bold font-serif text-forest dark:text-sage-200">
              {Math.round(data.actualStudyMinutes / 60)} hrs ({data.actualStudyMinutes} mins)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

