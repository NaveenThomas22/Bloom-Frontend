import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/auth';
import type {
  CreateModuleDto,
  CreateResourceDto,
  CreateSubjectDto,
  CreateSubtopicDto,
  CreateTopicDto,
  ModuleDetail,
  SubjectDetail,
  SubtopicDetail,
  SyllabusOverview,
  SyllabusResource,
  TopicDetail,
  TopicSummary,
  UpdateModuleDto,
  UpdateSubjectDto,
  UpdateSubtopicDto,
  UpdateSubtopicProgressDto,
  UpdateTopicDto,
  UpdateTopicProgressDto,
} from '@/types/syllabus';

export const syllabusApi = {
  async getOverview(): Promise<SyllabusOverview> {
    const res = await apiClient.get<ApiResponse<SyllabusOverview>>('/syllabus/overview');
    return res.data.data;
  },

  async getSubject(id: number): Promise<SubjectDetail> {
    const res = await apiClient.get<ApiResponse<SubjectDetail>>(`/syllabus/subjects/${id}`);
    return res.data.data;
  },

  async getTopic(id: number): Promise<TopicDetail> {
    const res = await apiClient.get<ApiResponse<TopicDetail>>(`/syllabus/topics/${id}`);
    return res.data.data;
  },

  async updateTopicProgress(id: number, data: UpdateTopicProgressDto): Promise<TopicSummary> {
    const res = await apiClient.put<ApiResponse<TopicSummary>>(`/syllabus/topics/${id}/progress`, data);
    return res.data.data;
  },

  async updateSubtopicProgress(id: number, data: UpdateSubtopicProgressDto): Promise<SubtopicDetail> {
    const res = await apiClient.put<ApiResponse<SubtopicDetail>>(`/syllabus/subtopics/${id}/progress`, data);
    return res.data.data;
  },

  async createSubject(data: CreateSubjectDto): Promise<SubjectDetail> {
    const res = await apiClient.post<ApiResponse<SubjectDetail>>('/syllabus/subjects', data);
    return res.data.data;
  },

  async updateSubject(id: number, data: UpdateSubjectDto): Promise<SubjectDetail> {
    const res = await apiClient.put<ApiResponse<SubjectDetail>>(`/syllabus/subjects/${id}`, data);
    return res.data.data;
  },

  async deleteSubject(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/syllabus/subjects/${id}`);
  },

  async createModule(data: CreateModuleDto): Promise<ModuleDetail> {
    const res = await apiClient.post<ApiResponse<ModuleDetail>>('/syllabus/modules', data);
    return res.data.data;
  },

  async updateModule(id: number, data: UpdateModuleDto): Promise<ModuleDetail> {
    const res = await apiClient.put<ApiResponse<ModuleDetail>>(`/syllabus/modules/${id}`, data);
    return res.data.data;
  },

  async deleteModule(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/syllabus/modules/${id}`);
  },

  async createTopic(data: CreateTopicDto): Promise<TopicSummary> {
    const res = await apiClient.post<ApiResponse<TopicSummary>>('/syllabus/topics', data);
    return res.data.data;
  },

  async updateTopic(id: number, data: UpdateTopicDto): Promise<TopicSummary> {
    const res = await apiClient.put<ApiResponse<TopicSummary>>(`/syllabus/topics/${id}`, data);
    return res.data.data;
  },

  async deleteTopic(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/syllabus/topics/${id}`);
  },

  async createSubtopic(data: CreateSubtopicDto): Promise<SubtopicDetail> {
    const res = await apiClient.post<ApiResponse<SubtopicDetail>>('/syllabus/subtopics', data);
    return res.data.data;
  },

  async updateSubtopic(id: number, data: UpdateSubtopicDto): Promise<SubtopicDetail> {
    const res = await apiClient.put<ApiResponse<SubtopicDetail>>(`/syllabus/subtopics/${id}`, data);
    return res.data.data;
  },

  async deleteSubtopic(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/syllabus/subtopics/${id}`);
  },

  async createResource(topicId: number, data: CreateResourceDto): Promise<SyllabusResource> {
    const res = await apiClient.post<ApiResponse<SyllabusResource>>(`/syllabus/topics/${topicId}/resources`, data);
    return res.data.data;
  },

  async deleteResource(id: number): Promise<void> {
    await apiClient.delete<ApiResponse>(`/syllabus/resources/${id}`);
  },
};

