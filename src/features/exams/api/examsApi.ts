import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/auth';
import type {
  ExamTemplate,
  ActiveExamAttempt,
  SaveExamAnswerRequest,
  SaveExamAnswerResponse,
  TransitionSectionRequest,
  ExamResult,
  ExamReview,
  ExamAttemptSummary,
} from '@/types/exams';

export const examsApi = {
  async getTemplates(examType?: string): Promise<ExamTemplate[]> {
    const params = new URLSearchParams();
    if (examType) params.append('examType', examType);
    const res = await apiClient.get<ApiResponse<ExamTemplate[]>>(`/exams/templates?${params.toString()}`);
    return res.data.data;
  },

  async getTemplateById(id: number): Promise<ExamTemplate> {
    const res = await apiClient.get<ApiResponse<ExamTemplate>>(`/exams/templates/${id}`);
    return res.data.data;
  },

  async startAttempt(templateId: number): Promise<ActiveExamAttempt> {
    const res = await apiClient.post<ApiResponse<ActiveExamAttempt>>(`/exams/templates/${templateId}/start`);
    return res.data.data;
  },

  async getActiveAttempt(): Promise<ActiveExamAttempt | null> {
    const res = await apiClient.get<ApiResponse<ActiveExamAttempt | null>>('/exams/attempts/active');
    return res.data.data;
  },

  async getRecentAttempts(limit = 20): Promise<ExamAttemptSummary[]> {
    const res = await apiClient.get<ApiResponse<ExamAttemptSummary[]>>(`/exams/attempts/recent?limit=${limit}`);
    return res.data.data;
  },

  async getAttemptById(attemptId: number): Promise<ActiveExamAttempt> {
    const res = await apiClient.get<ApiResponse<ActiveExamAttempt>>(`/exams/attempts/${attemptId}`);
    return res.data.data;
  },

  async saveAnswer(attemptId: number, request: SaveExamAnswerRequest): Promise<SaveExamAnswerResponse> {
    const res = await apiClient.post<ApiResponse<SaveExamAnswerResponse>>(`/exams/attempts/${attemptId}/answers`, request);
    return res.data.data;
  },

  async transitionSection(attemptId: number, request: TransitionSectionRequest): Promise<ActiveExamAttempt> {
    const res = await apiClient.post<ApiResponse<ActiveExamAttempt>>(`/exams/attempts/${attemptId}/navigate`, request);
    return res.data.data;
  },

  async submitAttempt(attemptId: number): Promise<ExamResult> {
    const res = await apiClient.post<ApiResponse<ExamResult>>(`/exams/attempts/${attemptId}/submit`);
    return res.data.data;
  },

  async getResults(attemptId: number): Promise<ExamResult> {
    const res = await apiClient.get<ApiResponse<ExamResult>>(`/exams/attempts/${attemptId}/results`);
    return res.data.data;
  },

  async getReview(attemptId: number): Promise<ExamReview> {
    const res = await apiClient.get<ApiResponse<ExamReview>>(`/exams/attempts/${attemptId}/review`);
    return res.data.data;
  },
};

