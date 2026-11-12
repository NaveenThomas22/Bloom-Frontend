import { useQuery } from '@tanstack/react-query';
import { analyticsApi } from '@/lib/api/analyticsApi';
import type { AnalyticsFilterRequest } from '@/types/analytics';

export const analyticsKeys = {
  all: ['analytics'] as const,
  overview: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'overview', filter] as const,
  subjectPerformance: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'subjects', filter] as const,
  topicPerformance: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'topics', filter] as const,
  studyTrends: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'trends', filter] as const,
  timeOfDay: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'timeOfDay', filter] as const,
  lifeDistribution: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'lifeDist', filter] as const,
  dailyLifeAccounting: (date?: string, timezoneId?: string) => [...analyticsKeys.all, 'lifeAccounting', date, timezoneId] as const,
  planAdherence: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'planAdherence', filter] as const,
  questionPractice: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'practice', filter] as const,
  mockTests: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'mockTests', filter] as const,
  revisions: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'revisions', filter] as const,
  goals: () => [...analyticsKeys.all, 'goals'] as const,
  habits: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'habits', filter] as const,
  mindsetGrowth: (filter?: AnalyticsFilterRequest) => [...analyticsKeys.all, 'mindsetGrowth', filter] as const,
  recommendations: (timezoneId?: string) => [...analyticsKeys.all, 'recommendations', timezoneId] as const,
};

export const useAnalyticsOverview = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.overview(filter),
    queryFn: () => analyticsApi.getOverview(filter),
  });

export const useSubjectPerformance = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.subjectPerformance(filter),
    queryFn: () => analyticsApi.getSubjectPerformance(filter),
  });

export const useTopicPerformance = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.topicPerformance(filter),
    queryFn: () => analyticsApi.getTopicPerformance(filter),
  });

export const useStudyTrends = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.studyTrends(filter),
    queryFn: () => analyticsApi.getStudyTrends(filter),
  });

export const useTimeOfDay = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.timeOfDay(filter),
    queryFn: () => analyticsApi.getTimeOfDay(filter),
  });

export const useLifeDistribution = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.lifeDistribution(filter),
    queryFn: () => analyticsApi.getLifeDistribution(filter),
  });

export const useDailyLifeAccounting = (date?: string, timezoneId?: string) =>
  useQuery({
    queryKey: analyticsKeys.dailyLifeAccounting(date, timezoneId),
    queryFn: () => analyticsApi.getDailyLifeAccounting(date, timezoneId),
  });

export const usePlanAdherence = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.planAdherence(filter),
    queryFn: () => analyticsApi.getPlanAdherence(filter),
  });

export const useQuestionPractice = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.questionPractice(filter),
    queryFn: () => analyticsApi.getQuestionPractice(filter),
  });

export const useMockTests = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.mockTests(filter),
    queryFn: () => analyticsApi.getMockTests(filter),
  });

export const useRevisionRetention = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.revisions(filter),
    queryFn: () => analyticsApi.getRevisions(filter),
  });

export const useGoalAnalytics = () =>
  useQuery({
    queryKey: analyticsKeys.goals(),
    queryFn: () => analyticsApi.getGoals(),
  });

export const useHabitConsistency = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.habits(filter),
    queryFn: () => analyticsApi.getHabits(filter),
  });

export const useMindsetGrowth = (filter?: AnalyticsFilterRequest) =>
  useQuery({
    queryKey: analyticsKeys.mindsetGrowth(filter),
    queryFn: () => analyticsApi.getMindsetGrowth(filter),
  });

export const useSmartRecommendations = (timezoneId?: string) =>
  useQuery({
    queryKey: analyticsKeys.recommendations(timezoneId),
    queryFn: () => analyticsApi.getRecommendations(timezoneId),
  });

