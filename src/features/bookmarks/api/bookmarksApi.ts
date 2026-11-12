import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/auth';
import type { Question, PagedResult } from '@/types/questions';

export const bookmarksApi = {
  async getBookmarks(subjectId?: number, topicId?: number, page = 1, pageSize = 20): Promise<PagedResult<Question>> {
    const params = new URLSearchParams();
    if (subjectId) params.append('subjectId', subjectId.toString());
    if (topicId) params.append('topicId', topicId.toString());
    params.append('page', page.toString());
    params.append('pageSize', pageSize.toString());

    const res = await apiClient.get<ApiResponse<PagedResult<Question>>>(`/bookmarks?${params.toString()}`);
    return res.data.data;
  },

  async addBookmark(questionId: number, note?: string): Promise<boolean> {
    const res = await apiClient.post<ApiResponse<boolean>>(`/bookmarks/${questionId}`, { note });
    return res.data.data;
  },

  async removeBookmark(questionId: number): Promise<boolean> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/bookmarks/${questionId}`);
    return res.data.data;
  },
};

