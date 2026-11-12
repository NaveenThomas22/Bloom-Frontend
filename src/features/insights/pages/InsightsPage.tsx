import React, { useState } from 'react';
import {
  TrendingUp,
  LayoutDashboard,
  BookOpen,
  Clock,
  HeartPulse,
  Target,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import type { AnalyticsFilterRequest } from '@/types/analytics';
import {
  useAnalyticsOverview,
  useSubjectPerformance,
  useTopicPerformance,
  useStudyTrends,
  useTimeOfDay,
  useLifeDistribution,
  useDailyLifeAccounting,
  usePlanAdherence,
  useQuestionPractice,
  useMockTests,
  useRevisionRetention,
  useGoalAnalytics,
  useHabitConsistency,
  useMindsetGrowth,
  useSmartRecommendations,
} from '@/features/analytics/hooks/useAnalytics';

import { DateRangeFilter } from '@/features/analytics/components/DateRangeFilter';
import { AnalyticsOverviewCards } from '@/features/analytics/components/AnalyticsOverviewCards';
import { CatPerformanceView } from '@/features/analytics/components/CatPerformanceView';
import { StudyTimeAnalyticsView } from '@/features/analytics/components/StudyTimeAnalyticsView';
import { LifeManagementView } from '@/features/analytics/components/LifeManagementView';
import { QuestionAndMockView } from '@/features/analytics/components/QuestionAndMockView';
import { RetentionAndHabitsView } from '@/features/analytics/components/RetentionAndHabitsView';
import { MindsetAndGrowthView } from '@/features/analytics/components/MindsetAndGrowthView';
import { SmartRecommendationsWidget } from '@/features/analytics/components/SmartRecommendationsWidget';

type TabType = 'overview' | 'cat' | 'study' | 'life' | 'practice' | 'retention' | 'mindset';

export const InsightsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [filter, setFilter] = useState<AnalyticsFilterRequest>({
    timeRange: 'Last7Days',
    timezoneId: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
  });

  // Queries
  const { data: overview, isLoading: isOverviewLoading } = useAnalyticsOverview(filter);
  const { data: subjects, isLoading: isSubjectsLoading } = useSubjectPerformance(filter);
  const { data: topics, isLoading: isTopicsLoading } = useTopicPerformance(filter);
  const { data: trends, isLoading: isTrendsLoading } = useStudyTrends(filter);
  const { data: timeOfDay, isLoading: isTimeLoading } = useTimeOfDay(filter);
  const { data: lifeDist, isLoading: isLifeLoading } = useLifeDistribution(filter);
  const { data: adherence, isLoading: isAdherenceLoading } = usePlanAdherence(filter);
  const { data: accounting, isLoading: isAccountingLoading } = useDailyLifeAccounting(undefined, filter.timezoneId);
  const { data: practice, isLoading: isPracticeLoading } = useQuestionPractice(filter);
  const { data: mocks, isLoading: isMocksLoading } = useMockTests(filter);
  const { data: revisions, isLoading: isRevisionsLoading } = useRevisionRetention(filter);
  const { data: goals, isLoading: isGoalsLoading } = useGoalAnalytics();
  const { data: habits, isLoading: isHabitsLoading } = useHabitConsistency(filter);
  const { data: mindset, isLoading: isMindsetLoading } = useMindsetGrowth(filter);
  const { data: recommendations = [], isLoading: isRecsLoading } = useSmartRecommendations(filter.timezoneId);

  const TABS = [
    { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
    { id: 'cat' as TabType, label: 'CAT Mastery', icon: BookOpen },
    { id: 'study' as TabType, label: 'Study Time', icon: Clock },
    { id: 'life' as TabType, label: '24h Life', icon: HeartPulse },
    { id: 'practice' as TabType, label: 'Practice & Mocks', icon: Target },
    { id: 'retention' as TabType, label: 'Retention & Habits', icon: RotateCcw },
    { id: 'mindset' as TabType, label: 'Mindset & Growth', icon: Sparkles },
  ];

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-forest dark:text-sage-300" />
          Analytics, Insights & CAT Mastery
        </h1>
        <p className="text-xs text-sage-600 dark:text-dark-muted">
          Holistic command center integrating syllabus progress, study sessions, question bank accuracy, CBT mocks, spaced revision, and personal growth.
        </p>
      </div>

      {/* Date Range Filter Bar */}
      <DateRangeFilter filter={filter} onChange={setFilter} />

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 border-b border-sage-200/60 dark:border-dark-border">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
                isActive
                  ? 'border-forest text-forest dark:text-sage-100 bg-white/60 dark:bg-dark-card/60'
                  : 'border-transparent text-sage-600 dark:text-dark-muted hover:text-sage-900 hover:border-sage-300'
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <AnalyticsOverviewCards data={overview} isLoading={isOverviewLoading} />

          <SmartRecommendationsWidget
            recommendations={recommendations}
            isLoading={isRecsLoading}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CatPerformanceView
              subjects={subjects}
              topics={topics}
              isLoading={isSubjectsLoading || isTopicsLoading}
            />
            <StudyTimeAnalyticsView
              trends={trends}
              timeOfDay={timeOfDay}
              isLoading={isTrendsLoading || isTimeLoading}
            />
          </div>
        </div>
      )}

      {/* 2. CAT Mastery Tab */}
      {activeTab === 'cat' && (
        <CatPerformanceView
          subjects={subjects}
          topics={topics}
          isLoading={isSubjectsLoading || isTopicsLoading}
        />
      )}

      {/* 3. Study Time Tab */}
      {activeTab === 'study' && (
        <StudyTimeAnalyticsView
          trends={trends}
          timeOfDay={timeOfDay}
          isLoading={isTrendsLoading || isTimeLoading}
        />
      )}

      {/* 4. 24h Life Tab */}
      {activeTab === 'life' && (
        <LifeManagementView
          distribution={lifeDist}
          adherence={adherence}
          accounting={accounting}
          isLoading={isLifeLoading || isAdherenceLoading || isAccountingLoading}
        />
      )}

      {/* 5. Practice & Mocks Tab */}
      {activeTab === 'practice' && (
        <QuestionAndMockView
          practice={practice}
          mocks={mocks}
          isLoading={isPracticeLoading || isMocksLoading}
        />
      )}

      {/* 6. Retention & Habits Tab */}
      {activeTab === 'retention' && (
        <RetentionAndHabitsView
          revisions={revisions}
          goals={goals}
          habits={habits}
          isLoading={isRevisionsLoading || isGoalsLoading || isHabitsLoading}
        />
      )}

      {/* 7. Mindset & Growth Tab */}
      {activeTab === 'mindset' && (
        <MindsetAndGrowthView
          data={mindset}
          isLoading={isMindsetLoading}
        />
      )}
    </div>
  );
};
