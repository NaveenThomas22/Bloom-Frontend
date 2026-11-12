import React from 'react';
import { Clock, Target, CheckCircle2, Award, Flame, PlayCircle } from 'lucide-react';
import type { AnalyticsOverviewDto } from '@/types/analytics';

interface OverviewCardsProps {
  data?: AnalyticsOverviewDto;
  isLoading: boolean;
}

export const AnalyticsOverviewCards: React.FC<OverviewCardsProps> = ({ data, isLoading }) => {
  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 animate-pulse">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-24 bg-sage-100/50 dark:bg-dark-surface/50 rounded-2xl border border-sage-200/40" />
        ))}
      </div>
    );
  }

  const syllabusPercent = data.totalTopics > 0
    ? Math.round(((data.topicsCompleted + data.topicsMastered) / data.totalTopics) * 100)
    : 0;

  return (
    <div className="space-y-3">
      {/* Active Timer Banner if running */}
      {data.hasActiveTimer && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-forest/10 dark:bg-forest/20 border border-forest/30 text-forest dark:text-sage-200">
          <div className="flex items-center gap-2.5">
            <PlayCircle className="w-5 h-5 animate-pulse text-forest dark:text-sage-300" />
            <div>
              <span className="text-xs font-bold uppercase tracking-wider">Live Timer Running</span>
              <p className="text-xs opacity-90">Session active for ~{data.activeTimerMinutes} mins (reported live, distinct from completed study history)</p>
            </div>
          </div>
        </div>
      )}

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Study Time */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-sage-600 dark:text-dark-muted mb-2">
            <span className="text-[11px] font-medium tracking-tight">Study Hours</span>
            <Clock className="w-4 h-4 text-forest dark:text-sage-300" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
              {data.studyHoursPeriod}h
            </div>
            <div className="text-[10px] text-sage-500 dark:text-dark-muted mt-0.5">
              All-Time: {data.studyHoursAllTime}h
            </div>
          </div>
        </div>

        {/* Practice Accuracy */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-sage-600 dark:text-dark-muted mb-2">
            <span className="text-[11px] font-medium tracking-tight">Practice Accuracy</span>
            <Target className="w-4 h-4 text-forest dark:text-sage-300" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
              {data.practiceAccuracy}%
            </div>
            <div className="text-[10px] text-sage-500 dark:text-dark-muted mt-0.5">
              {data.questionsCorrect} / {data.questionsAttempted} correct
            </div>
          </div>
        </div>

        {/* Syllabus Progress */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-sage-600 dark:text-dark-muted mb-2">
            <span className="text-[11px] font-medium tracking-tight">Syllabus Covered</span>
            <CheckCircle2 className="w-4 h-4 text-forest dark:text-sage-300" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
              {syllabusPercent}%
            </div>
            <div className="text-[10px] text-sage-500 dark:text-dark-muted mt-0.5">
              {data.topicsCompleted + data.topicsMastered} of {data.totalTopics} topics
            </div>
          </div>
        </div>

        {/* Topics Mastered */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-sage-600 dark:text-dark-muted mb-2">
            <span className="text-[11px] font-medium tracking-tight">Topics Mastered</span>
            <Award className="w-4 h-4 text-forest dark:text-sage-300" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
              {data.topicsMastered}
            </div>
            <div className="text-[10px] text-sage-500 dark:text-dark-muted mt-0.5">
              {data.topicsCompleted} completed
            </div>
          </div>
        </div>

        {/* Mock Tests Completed */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-sage-600 dark:text-dark-muted mb-2">
            <span className="text-[11px] font-medium tracking-tight">Mock Tests</span>
            <Award className="w-4 h-4 text-forest dark:text-sage-300" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
              {data.mockTestsCompleted}
            </div>
            <div className="text-[10px] text-sage-500 dark:text-dark-muted mt-0.5">
              Avg: {data.averageMockScore} marks
            </div>
          </div>
        </div>

        {/* Active Streak */}
        <div className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-sage-600 dark:text-dark-muted mb-2">
            <span className="text-[11px] font-medium tracking-tight">Active Streak</span>
            <Flame className="w-4 h-4 text-rose-dark" />
          </div>
          <div>
            <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
              {data.currentStreakDays} {data.currentStreakDays === 1 ? 'day' : 'days'}
            </div>
            <div className="text-[10px] text-sage-500 dark:text-dark-muted mt-0.5">
              Consistent daily study
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

