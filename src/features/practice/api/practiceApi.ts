import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/auth';
import type {
  StartPracticeSessionRequest,
  PracticeSession,
  SavePracticeAnswerRequest,
  SubmitPracticeSessionResponse,
} from '@/types/practice';

export const practiceApi = {
  async startSession(request: StartPracticeSessionRequest): Promise<PracticeSession> {
    const res = await apiClient.post<ApiResponse<PracticeSession>>('/practice-sessions', request);
    return res.data.data;
  },

  async getRecentSessions(limit = 20): Promise<PracticeSession[]> {
    const res = await apiClient.get<ApiResponse<PracticeSession[]>>(`/practice-sessions?limit=${limit}`);
    return res.data.data;
  },

  async getSessionById(id: number): Promise<PracticeSession> {
    const res = await apiClient.get<ApiResponse<PracticeSession>>(`/practice-sessions/${id}`);
    return res.data.data;
  },

  async saveAnswer(sessionId: number, request: SavePracticeAnswerRequest): Promise<boolean> {
    const res = await apiClient.post<ApiResponse<boolean>>(`/practice-sessions/${sessionId}/answers`, request);
    return res.data.data;
  },

  async submitSession(sessionId: number): Promise<SubmitPracticeSessionResponse> {
    const res = await apiClient.post<ApiResponse<SubmitPracticeSessionResponse>>(`/practice-sessions/${sessionId}/submit`);
    return res.data.data;
  },
};

