import { apiClient } from './client';
import type { ApiResponse } from '@/types/auth';
import type {
  ReflectionMood,
  DailyReflection,
  SaveMorningReflectionRequest,
  SaveEveningReflectionRequest,
  WeeklyReflectionSummary,
} from '@/types/reflections';

export const reflectionsApi = {
  getMoods: async (): Promise<ReflectionMood[]> => {
    const res = await apiClient.get<ApiResponse<ReflectionMood[]>>('/reflections/moods');
    return res.data.data;
  },

  getReflectionByDate: async (date?: string): Promise<DailyReflection | null> => {
    const res = await apiClient.get<ApiResponse<DailyReflection>>('/reflections', {
      params: date ? { date } : undefined,
    });
    return res.data.data;
  },

  saveMorningReflection: async (data: SaveMorningReflectionRequest): Promise<DailyReflection> => {
    const res = await apiClient.post<ApiResponse<DailyReflection>>('/reflections/morning', data);
    return res.data.data;
  },

  saveEveningReflection: async (data: SaveEveningReflectionRequest): Promise<DailyReflection> => {
    const res = await apiClient.post<ApiResponse<DailyReflection>>('/reflections/evening', data);
    return res.data.data;
  },

  getWeeklySummary: async (date?: string): Promise<WeeklyReflectionSummary> => {
    const res = await apiClient.get<ApiResponse<WeeklyReflectionSummary>>('/reflections/summary/weekly', {
      params: date ? { referenceDate: date } : undefined,
    });
    return res.data.data;
  },
};

