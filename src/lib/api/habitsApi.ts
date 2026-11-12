import { apiClient } from './client';
import type { ApiResponse } from '@/types/auth';
import type {
  HabitCategory,
  UserHabit,
  CreateHabitRequest,
  UpdateHabitRequest,
  HabitCompletion,
  HabitOverview,
  PersonalMilestone,
  CreateMilestoneRequest,
  UpdateMilestoneRequest,
  MilestoneOverview,
} from '@/types/habits';

export const habitsApi = {
  getCategories: async (): Promise<HabitCategory[]> => {
    const res = await apiClient.get<ApiResponse<HabitCategory[]>>('/habits/categories');
    return res.data.data;
  },

  getHabits: async (activeOnly = true): Promise<UserHabit[]> => {
    const res = await apiClient.get<ApiResponse<UserHabit[]>>('/habits', { params: { activeOnly } });
    return res.data.data;
  },

  getHabitById: async (id: number): Promise<UserHabit> => {
    const res = await apiClient.get<ApiResponse<UserHabit>>(`/habits/${id}`);
    return res.data.data;
  },

  createHabit: async (data: CreateHabitRequest): Promise<UserHabit> => {
    const res = await apiClient.post<ApiResponse<UserHabit>>('/habits', data);
    return res.data.data;
  },

  updateHabit: async (id: number, data: UpdateHabitRequest): Promise<UserHabit> => {
    const res = await apiClient.put<ApiResponse<UserHabit>>(`/habits/${id}`, data);
    return res.data.data;
  },

  deleteHabit: async (id: number): Promise<boolean> => {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/habits/${id}`);
    return res.data.data;
  },

  getCompletions: async (date: string): Promise<HabitCompletion[]> => {
    const res = await apiClient.get<ApiResponse<HabitCompletion[]>>('/habits/completions', { params: { date } });
    return res.data.data;
  },

  recordCompletion: async (
    habitId: number,
    data: { completionDate: string; status: string; actualValue: number; skipReason?: string; notes?: string }
  ): Promise<HabitCompletion> => {
    const res = await apiClient.post<ApiResponse<HabitCompletion>>(`/habits/${habitId}/completions`, data);
    return res.data.data;
  },

  deleteCompletion: async (habitId: number, date: string): Promise<boolean> => {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/habits/${habitId}/completions`, { params: { date } });
    return res.data.data;
  },

  getOverview: async (referenceDate?: string): Promise<HabitOverview> => {
    const res = await apiClient.get<ApiResponse<HabitOverview>>('/habits/overview', {
      params: referenceDate ? { referenceDate } : undefined,
    });
    return res.data.data;
  },

  // Personal Milestones
  getMilestones: async (status?: string): Promise<PersonalMilestone[]> => {
    const res = await apiClient.get<ApiResponse<PersonalMilestone[]>>('/personal-milestones', { params: { status } });
    return res.data.data;
  },

  getMilestoneOverview: async (): Promise<MilestoneOverview> => {
    const res = await apiClient.get<ApiResponse<MilestoneOverview>>('/personal-milestones/overview');
    return res.data.data;
  },

  createMilestone: async (data: CreateMilestoneRequest): Promise<PersonalMilestone> => {
    const res = await apiClient.post<ApiResponse<PersonalMilestone>>('/personal-milestones', data);
    return res.data.data;
  },

  updateMilestone: async (id: number, data: UpdateMilestoneRequest): Promise<PersonalMilestone> => {
    const res = await apiClient.put<ApiResponse<PersonalMilestone>>(`/personal-milestones/${id}`, data);
    return res.data.data;
  },

  deleteMilestone: async (id: number): Promise<boolean> => {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/personal-milestones/${id}`);
    return res.data.data;
  },

  syncMilestones: async (): Promise<number> => {
    const res = await apiClient.post<ApiResponse<number>>('/personal-milestones/sync');
    return res.data.data;
  },
};

