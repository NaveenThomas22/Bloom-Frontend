import { apiClient } from './client';
import type { ApiResponse } from '@/types/auth';
import type {
  AnalyticsFilterRequest,
  AnalyticsOverviewDto,
  SubjectPerformanceDto,
  TopicPerformanceDto,
  DailyStudyTrendDto,
  TimeOfDayDistributionDto,
  LifeCategoryDistributionDto,
  LifeAccountingDayDto,
  PlanAdherenceDto,
  QuestionPracticeSummaryDto,
  MockTestAnalyticsDto,
  RevisionRetentionDto,
  GoalAnalyticsDto,
  HabitConsistencyDto,
  MindsetGrowthDto,
  SmartRecommendationDto,
} from '@/types/analytics';

export const analyticsApi = {
  getOverview: async (filter?: AnalyticsFilterRequest): Promise<AnalyticsOverviewDto> => {
    const res = await apiClient.get<ApiResponse<AnalyticsOverviewDto>>('/analytics/overview', { params: filter });
    return res.data.data;
  },

  getSubjectPerformance: async (filter?: AnalyticsFilterRequest): Promise<SubjectPerformanceDto[]> => {
    const res = await apiClient.get<ApiResponse<SubjectPerformanceDto[]>>('/analytics/subject-performance', { params: filter });
    return res.data.data;
  },

  getTopicPerformance: async (filter?: AnalyticsFilterRequest): Promise<TopicPerformanceDto[]> => {
    const res = await apiClient.get<ApiResponse<TopicPerformanceDto[]>>('/analytics/topic-performance', { params: filter });
    return res.data.data;
  },

  getStudyTrends: async (filter?: AnalyticsFilterRequest): Promise<DailyStudyTrendDto[]> => {
    const res = await apiClient.get<ApiResponse<DailyStudyTrendDto[]>>('/analytics/study-time-trends', { params: filter });
    return res.data.data;
  },

  getTimeOfDay: async (filter?: AnalyticsFilterRequest): Promise<TimeOfDayDistributionDto[]> => {
    const res = await apiClient.get<ApiResponse<TimeOfDayDistributionDto[]>>('/analytics/time-of-day', { params: filter });
    return res.data.data;
  },

  getLifeDistribution: async (filter?: AnalyticsFilterRequest): Promise<LifeCategoryDistributionDto[]> => {
    const res = await apiClient.get<ApiResponse<LifeCategoryDistributionDto[]>>('/analytics/life-distribution', { params: filter });
    return res.data.data;
  },

  getDailyLifeAccounting: async (date?: string, timezoneId?: string): Promise<LifeAccountingDayDto> => {
    const res = await apiClient.get<ApiResponse<LifeAccountingDayDto>>('/analytics/life-accounting-day', {
      params: { date, timezoneId },
    });
    return res.data.data;
  },

  getPlanAdherence: async (filter?: AnalyticsFilterRequest): Promise<PlanAdherenceDto> => {
    const res = await apiClient.get<ApiResponse<PlanAdherenceDto>>('/analytics/plan-adherence', { params: filter });
    return res.data.data;
  },

  getQuestionPractice: async (filter?: AnalyticsFilterRequest): Promise<QuestionPracticeSummaryDto> => {
    const res = await apiClient.get<ApiResponse<QuestionPracticeSummaryDto>>('/analytics/question-practice', { params: filter });
    return res.data.data;
  },

  getMockTests: async (filter?: AnalyticsFilterRequest): Promise<MockTestAnalyticsDto> => {
    const res = await apiClient.get<ApiResponse<MockTestAnalyticsDto>>('/analytics/mock-tests', { params: filter });
    return res.data.data;
  },

  getRevisions: async (filter?: AnalyticsFilterRequest): Promise<RevisionRetentionDto> => {
    const res = await apiClient.get<ApiResponse<RevisionRetentionDto>>('/analytics/revisions', { params: filter });
    return res.data.data;
  },

  getGoals: async (): Promise<GoalAnalyticsDto[]> => {
    const res = await apiClient.get<ApiResponse<GoalAnalyticsDto[]>>('/analytics/goals');
    return res.data.data;
  },

  getHabits: async (filter?: AnalyticsFilterRequest): Promise<HabitConsistencyDto[]> => {
    const res = await apiClient.get<ApiResponse<HabitConsistencyDto[]>>('/analytics/habits', { params: filter });
    return res.data.data;
  },

  getMindsetGrowth: async (filter?: AnalyticsFilterRequest): Promise<MindsetGrowthDto> => {
    const res = await apiClient.get<ApiResponse<MindsetGrowthDto>>('/analytics/mindset-growth', { params: filter });
    return res.data.data;
  },

  getRecommendations: async (timezoneId?: string): Promise<SmartRecommendationDto[]> => {
    const res = await apiClient.get<ApiResponse<SmartRecommendationDto[]>>('/analytics/recommendations', {
      params: { timezoneId },
    });
    return res.data.data;
  },
};

