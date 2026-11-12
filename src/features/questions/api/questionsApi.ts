import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/auth';
import type { Question, QuestionFilter, PagedResult } from '@/types/questions';

export const questionsApi = {
  async getQuestions(filter: QuestionFilter = {}): Promise<PagedResult<Question>> {
    const params = new URLSearchParams();
    if (filter.subjectId) params.append('subjectId', filter.subjectId.toString());
    if (filter.moduleId) params.append('moduleId', filter.moduleId.toString());
    if (filter.topicId) params.append('topicId', filter.topicId.toString());
    if (filter.subtopicId) params.append('subtopicId', filter.subtopicId.toString());
    if (filter.questionType) params.append('questionType', filter.questionType);
    if (filter.difficultyLevel) params.append('difficultyLevel', filter.difficultyLevel);
    if (filter.search) params.append('search', filter.search);
    if (filter.page) params.append('page', filter.page.toString());
    if (filter.pageSize) params.append('pageSize', filter.pageSize.toString());

    const res = await apiClient.get<ApiResponse<PagedResult<Question>>>(`/questions?${params.toString()}`);
    return res.data.data;
  },

  async getQuestion(id: number): Promise<Question> {
    const res = await apiClient.get<ApiResponse<Question>>(`/questions/${id}`);
    return res.data.data;
  },
};

