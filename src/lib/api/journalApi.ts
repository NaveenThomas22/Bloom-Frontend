import { apiClient } from './client';
import type { ApiResponse } from '@/types/auth';
import type {
  JournalCategory,
  JournalEntry,
  CreateJournalEntryRequest,
  UpdateJournalEntryRequest,
  JournalQueryParameters,
} from '@/types/journal';

export const journalApi = {
  getCategories: async (): Promise<JournalCategory[]> => {
    const res = await apiClient.get<ApiResponse<JournalCategory[]>>('/journal-categories');
    return res.data.data;
  },

  createCategory: async (data: { categoryCode: string; categoryName: string; description?: string; icon?: string; color?: string }): Promise<JournalCategory> => {
    const res = await apiClient.post<ApiResponse<JournalCategory>>('/journal-categories', data);
    return res.data.data;
  },

  getEntries: async (params?: JournalQueryParameters): Promise<JournalEntry[]> => {
    const res = await apiClient.get<ApiResponse<JournalEntry[]>>('/journal', { params });
    return res.data.data;
  },

  getEntryById: async (id: number): Promise<JournalEntry> => {
    const res = await apiClient.get<ApiResponse<JournalEntry>>(`/journal/${id}`);
    return res.data.data;
  },

  createEntry: async (data: CreateJournalEntryRequest): Promise<JournalEntry> => {
    const res = await apiClient.post<ApiResponse<JournalEntry>>('/journal', data);
    return res.data.data;
  },

  updateEntry: async (id: number, data: UpdateJournalEntryRequest): Promise<JournalEntry> => {
    const res = await apiClient.put<ApiResponse<JournalEntry>>(`/journal/${id}`, data);
    return res.data.data;
  },

  deleteEntry: async (id: number): Promise<boolean> => {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/journal/${id}`);
    return res.data.data;
  },
};

