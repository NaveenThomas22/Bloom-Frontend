import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { goalsApi } from '../api/goalsApi';
import type {
  CreateGoalDto,
  CreateMilestoneDto,
  CreateRevisionPolicyDto,
  RecordRevisionAttemptRequest,
  RescheduleRevisionRequest,
  UpdateGoalDto,
  UpdateMilestoneDto,
  UpdateRevisionPolicyDto,
} from '@/types/goals';

export const goalKeys = {
  all: ['goals'] as const,
  lists: () => [...goalKeys.all, 'list'] as const,
  list: (period?: string, status?: string) => [...goalKeys.lists(), { period, status }] as const,
  dashboards: () => [...goalKeys.all, 'dashboard'] as const,
  dashboard: (period: string, date?: string) => [...goalKeys.dashboards(), { period, date }] as const,
  detail: (id: number) => [...goalKeys.all, 'detail', id] as const,

  milestones: ['milestones'] as const,
  milestonesList: (status?: string) => [...goalKeys.milestones, 'list', { status }] as const,

  revisions: ['revisions'] as const,
  revisionDashboard: (date?: string) => [...goalKeys.revisions, 'dashboard', { date }] as const,
  upcomingRevisions: (limit: number) => [...goalKeys.revisions, 'upcoming', { limit }] as const,
  revisionCalendar: (startDate: string, endDate: string) => [...goalKeys.revisions, 'calendar', { startDate, endDate }] as const,
  revisionAttempts: (topicId: number) => [...goalKeys.revisions, 'attempts', topicId] as const,

  policies: ['revision-policies'] as const,
};

// Goals Hooks
export const useGoals = (period?: string, status?: string) => {
  return useQuery({
    queryKey: goalKeys.list(period, status),
    queryFn: () => goalsApi.getGoals(period, status),
  });
};

export const useGoalDashboard = (period: string = 'Daily', date?: string) => {
  return useQuery({
    queryKey: goalKeys.dashboard(period, date),
    queryFn: () => goalsApi.getGoalDashboard(period, date),
  });
};

export const useCreateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalDto) => goalsApi.createGoal(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

export const useUpdateGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGoalDto }) => goalsApi.updateGoal(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

export const useDeleteGoal = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => goalsApi.deleteGoal(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.all });
    },
  });
};

// Milestones Hooks
export const useMilestones = (status?: string) => {
  return useQuery({
    queryKey: goalKeys.milestonesList(status),
    queryFn: () => goalsApi.getMilestones(status),
  });
};

export const useCreateMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMilestoneDto) => goalsApi.createMilestone(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.milestones });
    },
  });
};

export const useUpdateMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateMilestoneDto }) => goalsApi.updateMilestone(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.milestones });
    },
  });
};

export const useDeleteMilestone = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => goalsApi.deleteMilestone(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.milestones });
    },
  });
};

// Revisions Hooks
export const useRevisionDashboard = (date?: string) => {
  return useQuery({
    queryKey: goalKeys.revisionDashboard(date),
    queryFn: () => goalsApi.getRevisionDashboard(date),
  });
};

export const useUpcomingRevisions = (limit: number = 30) => {
  return useQuery({
    queryKey: goalKeys.upcomingRevisions(limit),
    queryFn: () => goalsApi.getUpcomingRevisions(limit),
  });
};

export const useRevisionCalendar = (startDate: string, endDate: string) => {
  return useQuery({
    queryKey: goalKeys.revisionCalendar(startDate, endDate),
    queryFn: () => goalsApi.getRevisionCalendar(startDate, endDate),
    enabled: Boolean(startDate && endDate),
  });
};

export const useScheduleTopicRevision = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ topicId, policyId, fromDate }: { topicId: number; policyId?: number; fromDate?: string }) =>
      goalsApi.scheduleTopicRevision(topicId, policyId, fromDate),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.revisions });
    },
  });
};

export const useRecordRevisionAttempt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RecordRevisionAttemptRequest) => goalsApi.recordAttempt(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.revisions });
      qc.invalidateQueries({ queryKey: goalKeys.all }); // Refresh goals that track revisions
    },
  });
};

export const useRescheduleRevision = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RescheduleRevisionRequest }) =>
      goalsApi.rescheduleRevision(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.revisions });
    },
  });
};

export const useSkipRevision = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: number; reason?: string }) => goalsApi.skipRevision(id, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.revisions });
    },
  });
};

// Policies Hooks
export const useRevisionPolicies = () => {
  return useQuery({
    queryKey: goalKeys.policies,
    queryFn: () => goalsApi.getRevisionPolicies(),
  });
};

export const useCreateRevisionPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateRevisionPolicyDto) => goalsApi.createRevisionPolicy(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.policies });
    },
  });
};

export const useUpdateRevisionPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRevisionPolicyDto }) =>
      goalsApi.updateRevisionPolicy(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.policies });
    },
  });
};

export const useDeleteRevisionPolicy = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => goalsApi.deleteRevisionPolicy(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: goalKeys.policies });
    },
  });
};

