export type CategoryGroup =
  | 'Study'
  | 'RestAndSleep'
  | 'MealsAndBreaks'
  | 'Personal'
  | 'WorkAndCommute'
  | 'HealthAndFitness'
  | 'LeisureAndSocial'
  | 'Other';

export interface ActivityCategoryDto {
  id: number;
  userId?: number | null;
  categoryCode: string;
  categoryName: string;
  description?: string | null;
  icon: string;
  color: string;
  categoryGroup: string;
  isActive: boolean;
  displayOrder: number;
  isCustom: boolean;
}

export interface CreateCategoryDto {
  categoryCode: string;
  categoryName: string;
  description?: string;
  icon?: string;
  color: string;
  categoryGroup: string;
  displayOrder?: number;
}

export interface UpdateCategoryDto {
  categoryName: string;
  description?: string;
  icon?: string;
  color: string;
  categoryGroup: string;
  isActive: boolean;
  displayOrder?: number;
}

export interface StudySessionDetailDto {
  activityId?: number;
  topicId?: number | null;
  topicName?: string | null;
  moduleName?: string | null;
  subjectCode?: string | null;
  subjectName?: string | null;
  studyMode?: string;
  difficultyLevel?: string;
  questionsAttempted?: number;
  questionsCorrect?: number;
  sessionNotes?: string | null;
}

export interface ActivityRecordDto {
  id: number;
  userId: number;
  activityCategoryId: number;
  categoryCode: string;
  categoryName: string;
  categoryGroup: string;
  color: string;
  icon: string;
  activityTitle: string;
  description?: string | null;
  startAtUtc: string;
  endAtUtc?: string | null;
  timezoneId: string;
  activityStatus: string;
  entrySource: string;
  isPlanned: boolean;
  sessionGroupId?: string | null;
  durationMinutes: number;
  studyDetails?: StudySessionDetailDto | null;
}

export interface CreateActivityRecordDto {
  activityCategoryId: number;
  activityTitle: string;
  description?: string;
  startAtUtc: string;
  endAtUtc?: string;
  timezoneId?: string;
  entrySource?: string;
  isPlanned?: boolean;
  sessionGroupId?: string;
  topicId?: number | null;
  studyMode?: string;
  difficultyLevel?: string;
  questionsAttempted?: number;
  questionsCorrect?: number;
  sessionNotes?: string;
}

export interface UpdateActivityRecordDto {
  activityCategoryId: number;
  activityTitle: string;
  description?: string;
  startAtUtc: string;
  endAtUtc: string;
  timezoneId?: string;
  topicId?: number | null;
  studyMode?: string;
  difficultyLevel?: string;
  questionsAttempted?: number;
  questionsCorrect?: number;
  sessionNotes?: string;
}

export interface PlannedActivityDto {
  id: number;
  userId: number;
  activityCategoryId: number;
  categoryCode: string;
  categoryName: string;
  categoryGroup: string;
  color: string;
  icon: string;
  title: string;
  description?: string | null;
  plannedStartAtUtc: string;
  plannedEndAtUtc: string;
  timezoneId: string;
  linkedTopicId?: number | null;
  linkedTopicName?: string | null;
  planStatus: string;
  actualActivityId?: number | null;
  plannedDurationMinutes: number;
}

export interface CreatePlannedActivityDto {
  activityCategoryId: number;
  title: string;
  description?: string;
  plannedStartAtUtc: string;
  plannedEndAtUtc: string;
  timezoneId?: string;
  linkedTopicId?: number | null;
}

export interface UpdatePlannedActivityDto {
  activityCategoryId: number;
  title: string;
  description?: string;
  plannedStartAtUtc: string;
  plannedEndAtUtc: string;
  timezoneId?: string;
  linkedTopicId?: number | null;
  planStatus?: string;
}

export interface TimelineItemDto {
  itemType: 'Activity' | 'Untracked' | 'Future';
  activityId?: number | null;
  categoryId?: number | null;
  categoryCode: string;
  categoryName: string;
  categoryGroup: string;
  color: string;
  icon: string;
  title: string;
  description?: string | null;
  startTimeLocal: string;
  endTimeLocal: string;
  durationMinutes: number;
  isRunning: boolean;
  studyDetails?: StudySessionDetailDto | null;
}

export interface DailyTimelineDto {
  targetDate: string;
  timezoneId: string;
  totalDayMinutes: number;
  trackedMinutes: number;
  untrackedMinutes: number;
  plannedMinutes: number;
  timelineItems: TimelineItemDto[];
  plannedItems: PlannedActivityDto[];
}

export interface CategoryTimeDistributionDto {
  categoryGroup: string;
  totalMinutes: number;
  percentageOfDay: number;
  color: string;
}

export interface SubjectStudyTimeDto {
  subjectCode: string;
  subjectName: string;
  totalMinutes: number;
  totalHours: number;
}

export interface DailyTimeSummaryDto {
  targetDate: string;
  timezoneId: string;
  totalDayMinutes: number;
  trackedMinutes: number;
  untrackedMinutes: number;
  studyMinutes: number;
  sleepMinutes: number;
  mealMinutes: number;
  workMinutes: number;
  fitnessMinutes: number;
  leisureMinutes: number;
  personalMinutes: number;
  otherMinutes: number;
  plannedMinutes: number;
  distribution: CategoryTimeDistributionDto[];
  subjectStudyBreakdown: SubjectStudyTimeDto[];
}

export interface ActiveTimerDto {
  hasActiveTimer: boolean;
  sessionGroupId?: string | null;
  activityCategoryId?: number | null;
  categoryName?: string | null;
  categoryCode?: string | null;
  color?: string | null;
  icon?: string | null;
  topicId?: number | null;
  topicName?: string | null;
  moduleName?: string | null;
  subjectCode?: string | null;
  title?: string | null;
  studyMode?: string | null;
  timerState?: 'Running' | 'Paused';
  startedAtUtc?: string | null;
  currentIntervalStartedAtUtc?: string | null;
  elapsedSeconds: number;
}

export interface StartTimerDto {
  activityCategoryId: number;
  title: string;
  topicId?: number | null;
  studyMode?: string;
  timezoneId?: string;
}

export interface CompleteTimerDto {
  sessionNotes?: string;
  questionsAttempted?: number;
  questionsCorrect?: number;
  difficultyLevel?: string;
}

export interface DailyReportSummaryDto {
  date: string;
  totalTrackedHours: number;
  studyHours: number;
  sleepHours: number;
  untrackedHours: number;
}

export interface WeeklyReportDto {
  startDate: string;
  endDate: string;
  totalTrackedHours: number;
  totalStudyHours: number;
  totalSleepHours: number;
  averageDailyStudyHours: number;
  averageDailySleepHours: number;
  dailySummaries: DailyReportSummaryDto[];
  categoryDistribution: CategoryTimeDistributionDto[];
  subjectBreakdown: SubjectStudyTimeDto[];
}

export interface MonthlyReportDto {
  year: number;
  month: number;
  totalTrackedHours: number;
  totalStudyHours: number;
  totalSleepHours: number;
  averageDailyStudyHours: number;
  totalActiveStudyDays: number;
  dailySummaries: DailyReportSummaryDto[];
  categoryDistribution: CategoryTimeDistributionDto[];
  subjectBreakdown: SubjectStudyTimeDto[];
}

