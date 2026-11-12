import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { syllabusApi } from '../api/syllabusApi';
import type {
  CreateModuleDto,
  CreateResourceDto,
  CreateSubjectDto,
  CreateSubtopicDto,
  CreateTopicDto,
  UpdateModuleDto,
  UpdateSubjectDto,
  UpdateSubtopicDto,
  UpdateSubtopicProgressDto,
  UpdateTopicDto,
  UpdateTopicProgressDto,
} from '@/types/syllabus';

export const syllabusQueryKeys = {
  all: ['syllabus'] as const,
  overview: () => [...syllabusQueryKeys.all, 'overview'] as const,
  subject: (id: number) => [...syllabusQueryKeys.all, 'subject', id] as const,
  topic: (id: number) => [...syllabusQueryKeys.all, 'topic', id] as const,
};

export const useSyllabusOverview = () => {
  return useQuery({
    queryKey: syllabusQueryKeys.overview(),
    queryFn: () => syllabusApi.getOverview(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useSubjectDetail = (subjectId: number) => {
  return useQuery({
    queryKey: syllabusQueryKeys.subject(subjectId),
    queryFn: () => syllabusApi.getSubject(subjectId),
    enabled: subjectId > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useTopicDetail = (topicId: number) => {
  return useQuery({
    queryKey: syllabusQueryKeys.topic(topicId),
    queryFn: () => syllabusApi.getTopic(topicId),
    enabled: topicId > 0,
    staleTime: 1000 * 60 * 5,
  });
};

export const useUpdateTopicProgress = (topicId: number, subjectId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateTopicProgressDto) => syllabusApi.updateTopicProgress(topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.topic(topicId) });
      if (subjectId) {
        queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.subject(subjectId) });
      } else {
        queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.all });
      }
      queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.overview() });
    },
  });
};

export const useUpdateSubtopicProgress = (subtopicId: number, topicId: number, subjectId?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSubtopicProgressDto) => syllabusApi.updateSubtopicProgress(subtopicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.topic(topicId) });
      if (subjectId) {
        queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.subject(subjectId) });
      }
      queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.overview() });
    },
  });
};

export const useCreateResource = (topicId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateResourceDto) => syllabusApi.createResource(topicId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.topic(topicId) });
    },
  });
};

export const useDeleteResource = (topicId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (resourceId: number) => syllabusApi.deleteResource(resourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.topic(topicId) });
    },
  });
};

export const useSyllabusManagement = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: syllabusQueryKeys.all });
  };

  const createSubject = useMutation({
    mutationFn: (data: CreateSubjectDto) => syllabusApi.createSubject(data),
    onSuccess: invalidateAll,
  });

  const updateSubject = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubjectDto }) => syllabusApi.updateSubject(id, data),
    onSuccess: invalidateAll,
  });

  const deleteSubject = useMutation({
    mutationFn: (id: number) => syllabusApi.deleteSubject(id),
    onSuccess: invalidateAll,
  });

  const createModule = useMutation({
    mutationFn: (data: CreateModuleDto) => syllabusApi.createModule(data),
    onSuccess: invalidateAll,
  });

  const updateModule = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateModuleDto }) => syllabusApi.updateModule(id, data),
    onSuccess: invalidateAll,
  });

  const deleteModule = useMutation({
    mutationFn: (id: number) => syllabusApi.deleteModule(id),
    onSuccess: invalidateAll,
  });

  const createTopic = useMutation({
    mutationFn: (data: CreateTopicDto) => syllabusApi.createTopic(data),
    onSuccess: invalidateAll,
  });

  const updateTopic = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTopicDto }) => syllabusApi.updateTopic(id, data),
    onSuccess: invalidateAll,
  });

  const deleteTopic = useMutation({
    mutationFn: (id: number) => syllabusApi.deleteTopic(id),
    onSuccess: invalidateAll,
  });

  const createSubtopic = useMutation({
    mutationFn: (data: CreateSubtopicDto) => syllabusApi.createSubtopic(data),
    onSuccess: invalidateAll,
  });

  const updateSubtopic = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateSubtopicDto }) => syllabusApi.updateSubtopic(id, data),
    onSuccess: invalidateAll,
  });

  const deleteSubtopic = useMutation({
    mutationFn: (id: number) => syllabusApi.deleteSubtopic(id),
    onSuccess: invalidateAll,
  });

  return {
    createSubject,
    updateSubject,
    deleteSubject,
    createModule,
    updateModule,
    deleteModule,
    createTopic,
    updateTopic,
    deleteTopic,
    createSubtopic,
    updateSubtopic,
    deleteSubtopic,
  };
};

