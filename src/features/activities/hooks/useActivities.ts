import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { activityApi } from '../api/activityApi';
import type {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateActivityRecordDto,
  UpdateActivityRecordDto,
  CreatePlannedActivityDto,
  UpdatePlannedActivityDto,
  StartTimerDto,
  CompleteTimerDto,
} from '@/types/activity';

export const activityQueryKeys = {
  all: ['activities'] as const,
  categories: (includeInactive = false) => [...activityQueryKeys.all, 'categories', { includeInactive }] as const,
  timeline: (targetDate?: string, timezoneId?: string) =>
    [...activityQueryKeys.all, 'timeline', { targetDate, timezoneId }] as const,
  summary: (targetDate?: string, timezoneId?: string) =>
    [...activityQueryKeys.all, 'summary', { targetDate, timezoneId }] as const,
  activeTimer: () => [...activityQueryKeys.all, 'active-timer'] as const,
  planned: (targetDate?: string, timezoneId?: string) =>
    [...activityQueryKeys.all, 'planned', { targetDate, timezoneId }] as const,
  weeklyReport: (referenceDate?: string, timezoneId?: string) =>
    [...activityQueryKeys.all, 'weekly-report', { referenceDate, timezoneId }] as const,
  monthlyReport: (year?: number, month?: number, timezoneId?: string) =>
    [...activityQueryKeys.all, 'monthly-report', { year, month, timezoneId }] as const,
};

// Activity Categories Hooks
export const useActivityCategories = (includeInactive = false) => {
  return useQuery({
    queryKey: activityQueryKeys.categories(includeInactive),
    queryFn: () => activityApi.getCategories(includeInactive),
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateCategoryDto) => activityApi.createCategory(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.categories(false) });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.categories(true) });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateCategoryDto }) => activityApi.updateCategory(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.categories(false) });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.categories(true) });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activityApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.categories(false) });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.categories(true) });
    },
  });
};

// Daily Timeline & Summary Hooks
export const useDailyTimeline = (targetDate?: string, timezoneId?: string) => {
  return useQuery({
    queryKey: activityQueryKeys.timeline(targetDate, timezoneId),
    queryFn: () => activityApi.getDailyTimeline(targetDate, timezoneId),
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useDailySummary = (targetDate?: string, timezoneId?: string) => {
  return useQuery({
    queryKey: activityQueryKeys.summary(targetDate, timezoneId),
    queryFn: () => activityApi.getDailySummary(targetDate, timezoneId),
    staleTime: 1000 * 30,
  });
};

// Study Timer Hooks
export const useActiveTimer = () => {
  return useQuery({
    queryKey: activityQueryKeys.activeTimer(),
    queryFn: () => activityApi.getActiveTimer(),
    refetchInterval: (query) => (query.state.data?.hasActiveTimer && query.state.data.timerState === 'Running' ? 10000 : false),
    staleTime: 1000 * 5,
  });
};

export const useStartTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: StartTimerDto) => activityApi.startTimer(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.activeTimer() });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

export const usePauseTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => activityApi.pauseTimer(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.activeTimer() });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

export const useResumeTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => activityApi.resumeTimer(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.activeTimer() });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

export const useCompleteTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CompleteTimerDto) => activityApi.completeTimer(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.activeTimer() });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['syllabus'] });
    },
  });
};

export const useCancelTimer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => activityApi.cancelTimer(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.activeTimer() });
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

// Activity Records CRUD Hooks
export const useLogActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateActivityRecordDto) => activityApi.createActivityRecord(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['syllabus'] });
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateActivityRecordDto }) =>
      activityApi.updateActivityRecord(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['syllabus'] });
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activityApi.deleteActivityRecord(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
      queryClient.invalidateQueries({ queryKey: ['syllabus'] });
    },
  });
};

// Planned Activities Hooks
export const usePlannedActivities = (targetDate?: string, timezoneId?: string) => {
  return useQuery({
    queryKey: activityQueryKeys.planned(targetDate, timezoneId),
    queryFn: () => activityApi.getPlannedActivities(targetDate, timezoneId),
    staleTime: 1000 * 60,
  });
};

export const useCreatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreatePlannedActivityDto) => activityApi.createPlannedActivity(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

export const useUpdatePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdatePlannedActivityDto }) =>
      activityApi.updatePlannedActivity(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

export const useDeletePlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activityApi.deletePlannedActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

export const useStartPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activityApi.startPlannedActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

export const useSkipPlan = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => activityApi.skipPlannedActivity(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: activityQueryKeys.all });
    },
  });
};

// Reports Hooks
export const useWeeklyReport = (referenceDate?: string, timezoneId?: string) => {
  return useQuery({
    queryKey: activityQueryKeys.weeklyReport(referenceDate, timezoneId),
    queryFn: () => activityApi.getWeeklyReport(referenceDate, timezoneId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useMonthlyReport = (year?: number, month?: number, timezoneId?: string) => {
  return useQuery({
    queryKey: activityQueryKeys.monthlyReport(year, month, timezoneId),
    queryFn: () => activityApi.getMonthlyReport(year, month, timezoneId),
    staleTime: 1000 * 60 * 5,
  });
};

