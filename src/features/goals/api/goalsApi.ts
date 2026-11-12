import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/auth';
import type {
  CreateGoalDto,
  CreateMilestoneDto,
  CreateRevisionPolicyDto,
  GoalDashboardSummary,
  PreparationMilestone,
  RecordRevisionAttemptRequest,
  RescheduleRevisionRequest,
  RevisionAttempt,
  RevisionDashboardSummary,
  RevisionPolicy,
  RevisionSchedule,
  UpdateGoalDto,
  UpdateMilestoneDto,
  UpdateRevisionPolicyDto,
  UserGoal,
} from '@/types/goals';

export const goalsApi = {
  // Goals
  async getGoals(period?: string, status?: string): Promise<UserGoal[]> {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (status) params.append('status', status);
    const res = await apiClient.get<ApiResponse<UserGoal[]>>(`/goals?${params.toString()}`);
    return res.data.data;
  },

  async getGoalDashboard(period: string = 'Daily', date?: string): Promise<GoalDashboardSummary> {
    const params = new URLSearchParams({ period });
    if (date) params.append('date', date);
    const res = await apiClient.get<ApiResponse<GoalDashboardSummary>>(`/goals/dashboard?${params.toString()}`);
    return res.data.data;
  },

  async getGoal(id: number): Promise<UserGoal> {
    const res = await apiClient.get<ApiResponse<UserGoal>>(`/goals/${id}`);
    return res.data.data;
  },

  async createGoal(data: CreateGoalDto): Promise<UserGoal> {
    const res = await apiClient.post<ApiResponse<UserGoal>>('/goals', data);
    return res.data.data;
  },

  async updateGoal(id: number, data: UpdateGoalDto): Promise<UserGoal> {
    const res = await apiClient.put<ApiResponse<UserGoal>>(`/goals/${id}`, data);
    return res.data.data;
  },

  async deleteGoal(id: number): Promise<void> {
    await apiClient.delete(`/goals/${id}`);
  },

  // Milestones
  async getMilestones(status?: string): Promise<PreparationMilestone[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    const res = await apiClient.get<ApiResponse<PreparationMilestone[]>>(`/milestones?${params.toString()}`);
    return res.data.data;
  },

  async getMilestone(id: number): Promise<PreparationMilestone> {
    const res = await apiClient.get<ApiResponse<PreparationMilestone>>(`/milestones/${id}`);
    return res.data.data;
  },

  async createMilestone(data: CreateMilestoneDto): Promise<PreparationMilestone> {
    const res = await apiClient.post<ApiResponse<PreparationMilestone>>('/milestones', data);
    return res.data.data;
  },

  async updateMilestone(id: number, data: UpdateMilestoneDto): Promise<PreparationMilestone> {
    const res = await apiClient.put<ApiResponse<PreparationMilestone>>(`/milestones/${id}`, data);
    return res.data.data;
  },

  async deleteMilestone(id: number): Promise<void> {
    await apiClient.delete(`/milestones/${id}`);
  },

  // Spaced Repetition Revisions
  async getRevisionDashboard(date?: string): Promise<RevisionDashboardSummary> {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    const res = await apiClient.get<ApiResponse<RevisionDashboardSummary>>(`/revisions/dashboard?${params.toString()}`);
    return res.data.data;
  },

  async getUpcomingRevisions(limit: number = 30): Promise<RevisionSchedule[]> {
    const res = await apiClient.get<ApiResponse<RevisionSchedule[]>>(`/revisions/upcoming?limit=${limit}`);
    return res.data.data;
  },

  async getRevisionCalendar(startDate: string, endDate: string): Promise<RevisionSchedule[]> {
    const res = await apiClient.get<ApiResponse<RevisionSchedule[]>>(`/revisions/calendar?startDate=${startDate}&endDate=${endDate}`);
    return res.data.data;
  },

  async scheduleTopicRevision(topicId: number, policyId?: number, fromDate?: string): Promise<RevisionSchedule> {
    const res = await apiClient.post<ApiResponse<RevisionSchedule>>('/revisions/schedule', {
      topicId,
      policyId,
      fromDate,
    });
    return res.data.data;
  },

  async recordAttempt(data: RecordRevisionAttemptRequest): Promise<RevisionAttempt> {
    const res = await apiClient.post<ApiResponse<RevisionAttempt>>('/revisions/attempt', data);
    return res.data.data;
  },

  async rescheduleRevision(id: number, data: RescheduleRevisionRequest): Promise<RevisionSchedule> {
    const res = await apiClient.put<ApiResponse<RevisionSchedule>>(`/revisions/${id}/reschedule`, data);
    return res.data.data;
  },

  async skipRevision(id: number, reason?: string): Promise<RevisionSchedule> {
    const res = await apiClient.post<ApiResponse<RevisionSchedule>>(`/revisions/${id}/skip`, { reason });
    return res.data.data;
  },

  async getTopicAttempts(topicId: number): Promise<RevisionAttempt[]> {
    const res = await apiClient.get<ApiResponse<RevisionAttempt[]>>(`/revisions/attempts/topic/${topicId}`);
    return res.data.data;
  },

  async getRecentAttempts(limit: number = 50): Promise<RevisionAttempt[]> {
    const res = await apiClient.get<ApiResponse<RevisionAttempt[]>>(`/revisions/attempts/recent?limit=${limit}`);
    return res.data.data;
  },

  // Revision Policies
  async getRevisionPolicies(): Promise<RevisionPolicy[]> {
    const res = await apiClient.get<ApiResponse<RevisionPolicy[]>>('/revision-policies');
    return res.data.data;
  },

  async createRevisionPolicy(data: CreateRevisionPolicyDto): Promise<RevisionPolicy> {
    const res = await apiClient.post<ApiResponse<RevisionPolicy>>('/revision-policies', data);
    return res.data.data;
  },

  async updateRevisionPolicy(id: number, data: UpdateRevisionPolicyDto): Promise<RevisionPolicy> {
    const res = await apiClient.put<ApiResponse<RevisionPolicy>>(`/revision-policies/${id}`, data);
    return res.data.data;
  },

  async deleteRevisionPolicy(id: number): Promise<void> {
    await apiClient.delete(`/revision-policies/${id}`);
  },
};

