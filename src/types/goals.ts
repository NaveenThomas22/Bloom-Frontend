export type GoalPeriod = 'Daily' | 'Weekly' | 'Monthly' | 'Custom';
export type TargetMetric = 'StudyMinutes' | 'TopicsCompleted' | 'SubtopicsCompleted' | 'RevisionsCompleted' | 'ActivitiesCount';
export type GoalUnit = 'Minutes' | 'Hours' | 'Topics' | 'Subtopics' | 'Revisions' | 'Sessions';
export type GoalStatus = 'Active' | 'Paused' | 'Completed' | 'Cancelled';

export interface UserGoal {
  id: number;
  userId: number;
  title: string;
  description?: string;
  goalPeriod: GoalPeriod;
  targetMetric: TargetMetric;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  subjectId?: number;
  subjectName?: string;
  topicId?: number;
  topicName?: string;
  status: GoalStatus;
  currentValue: number;
  progressPercentage: number;
  isAchieved: boolean;
  daysRemaining: number;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface CreateGoalDto {
  title: string;
  description?: string;
  goalPeriod: GoalPeriod;
  targetMetric: TargetMetric;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  subjectId?: number;
  topicId?: number;
}

export interface UpdateGoalDto {
  title: string;
  description?: string;
  targetValue: number;
  unit: string;
  startDate: string;
  endDate: string;
  subjectId?: number;
  topicId?: number;
  status: GoalStatus;
}

export interface GoalDashboardSummary {
  period: GoalPeriod;
  startDate: string;
  endDate: string;
  totalGoals: number;
  achievedGoals: number;
  averageProgressPercentage: number;
  goals: UserGoal[];
}

export type MilestonePriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type MilestoneStatus = 'Pending' | 'Completed' | 'Overdue' | 'Cancelled';

export interface PreparationMilestone {
  id: number;
  userId: number;
  title: string;
  description?: string;
  targetDate: string;
  subjectId?: number;
  subjectName?: string;
  topicId?: number;
  topicName?: string;
  priority: MilestonePriority;
  status: MilestoneStatus;
  completedAtUtc?: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface CreateMilestoneDto {
  title: string;
  description?: string;
  targetDate: string;
  subjectId?: number;
  topicId?: number;
  priority: MilestonePriority;
}

export interface UpdateMilestoneDto {
  title: string;
  description?: string;
  targetDate: string;
  subjectId?: number;
  topicId?: number;
  priority: MilestonePriority;
  status: MilestoneStatus;
}

export interface RevisionPolicy {
  id: number;
  userId?: number;
  policyName: string;
  description?: string;
  intervalsCsv: string;
  intervals: number[];
  isSystem: boolean;
  isActive: boolean;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface CreateRevisionPolicyDto {
  policyName: string;
  description?: string;
  intervalsCsv: string;
}

export interface UpdateRevisionPolicyDto {
  policyName: string;
  description?: string;
  intervalsCsv: string;
  isActive: boolean;
}

export type RevisionScheduleStatus = 'Upcoming' | 'DueToday' | 'Overdue' | 'Completed' | 'Skipped' | 'Rescheduled';
export type UnderstandingLevel = 'Difficult' | 'Partial' | 'Good' | 'Mastered';

export interface RevisionSchedule {
  id: number;
  userId: number;
  topicId: number;
  topicName: string;
  subjectId?: number;
  subjectName?: string;
  revisionPolicyId: number;
  policyName: string;
  stepNumber: number;
  scheduledDate: string;
  status: RevisionScheduleStatus;
  completedAtUtc?: string;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface RevisionAttempt {
  id: number;
  revisionScheduleId?: number;
  userId: number;
  topicId: number;
  topicName: string;
  revisedAtUtc: string;
  revisionDate: string;
  understandingLevel: UnderstandingLevel;
  confidenceRating: number;
  notes?: string;
  linkedActivityRecordId?: number;
  nextScheduledDate?: string;
  createdAtUtc: string;
}

export interface RecordRevisionAttemptRequest {
  revisionScheduleId?: number;
  topicId: number;
  understandingLevel: UnderstandingLevel;
  confidenceRating: number;
  notes?: string;
  minutesSpent?: number;
  createActivityRecord?: boolean;
}

export interface RescheduleRevisionRequest {
  newDate: string;
  reason?: string;
}

export interface RevisionDashboardSummary {
  dueTodayCount: number;
  overdueCount: number;
  upcomingCount: number;
  completedTotalCount: number;
  dueToday: RevisionSchedule[];
  overdue: RevisionSchedule[];
  upcoming: RevisionSchedule[];
}

