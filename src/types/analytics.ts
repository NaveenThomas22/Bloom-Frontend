export interface AnalyticsFilterRequest {
  timeRange: 'Today' | 'Last7Days' | 'Last30Days' | 'ThisMonth' | 'LastMonth' | 'Custom' | 'AllTime';
  startDate?: string;
  endDate?: string;
  timezoneId?: string;
  subjectId?: number;
  topicId?: number;
}

export interface AnalyticsOverviewDto {
  studyHoursPeriod: number;
  studyHoursAllTime: number;
  questionsAttempted: number;
  questionsCorrect: number;
  practiceAccuracy: number;
  topicsMastered: number;
  topicsCompleted: number;
  totalTopics: number;
  mockTestsCompleted: number;
  averageMockScore: number;
  currentStreakDays: number;
  hasActiveTimer: boolean;
  activeTimerMinutes: number;
}

export interface SubjectPerformanceDto {
  subjectId: number;
  subjectCode: string;
  subjectName: string;
  totalTopics: number;
  completedTopics: number;
  masteredTopics: number;
  studyHours: number;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracyPercentage: number;
  averageTimeSpentSeconds: number;
}

export interface TopicPerformanceDto {
  topicId: number;
  topicName: string;
  subjectCode: string;
  subjectName: string;
  moduleName: string;
  status: string;
  confidenceRating: number;
  questionsAttempted: number;
  questionsCorrect: number;
  accuracyPercentage: number;
  studyHours: number;
}

export interface DailyStudyTrendDto {
  date: string;
  studyHours: number;
  qaHours: number;
  dilrHours: number;
  varcHours: number;
  otherHours: number;
}

export interface TimeOfDayDistributionDto {
  timeBlock: string;
  studyHours: number;
  activityCount: number;
}

export interface LifeCategoryDistributionDto {
  categoryGroup: string;
  categoryName: string;
  color: string;
  totalHours: number;
  percentage: number;
}

export interface LifeAccountingDayDto {
  date: string;
  accountedHours: number;
  untrackedHours: number;
  calendarDayHours: number;
}

export interface PlanAdherenceDto {
  totalPlannedHours: number;
  totalActualHours: number;
  completedPlansCount: number;
  totalScheduledPlansCount: number;
  adherenceRatePercentage: number;
}

export interface QuestionPracticeSummaryDto {
  totalSessions: number;
  totalQuestionsAttempted: number;
  totalQuestionsCorrect: number;
  overallAccuracy: number;
  mcqAttempted: number;
  mcqCorrect: number;
  mcqAccuracy: number;
  titaAttempted: number;
  titaCorrect: number;
  titaAccuracy: number;
  easyAccuracy: number;
  mediumAccuracy: number;
  hardAccuracy: number;
  avgSecondsPerQuestion: number;
}

export interface MockSectionScoreDto {
  sectionName: string;
  score: number;
  maxScore: number;
  attempted: number;
  correct: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
}

export interface MockTestSummaryItemDto {
  attemptId: number;
  examTemplateId: number;
  examTitle: string;
  examType: string;
  submittedAtUtc: string;
  totalScore: number;
  maxPossibleScore: number;
  accuracyPercentage: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  timeSpentSeconds: number;
  sectionScores: MockSectionScoreDto[];
}

export interface MockTestAnalyticsDto {
  totalCompletedMocks: number;
  averageScore: number;
  cohortStatus: string;
  attempts: MockTestSummaryItemDto[];
}

export interface RevisionRetentionDto {
  totalSchedules: number;
  completedSchedules: number;
  overdueSchedules: number;
  upcomingSchedules: number;
  completionRatePercentage: number;
  averageConfidence: number;
  understandingDistribution: Record<string, number>;
}

export interface GoalAnalyticsDto {
  goalId: number;
  title: string;
  goalPeriod: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  progressPercentage: number;
  isCompleted: boolean;
}

export interface HabitConsistencyDto {
  habitId: number;
  habitName: string;
  categoryName: string;
  frequency: string;
  currentStreak: number;
  longestStreak: number;
  completionRatePercentage: number;
  totalCompleted: number;
  totalSkipped: number;
  totalMissed: number;
}

export interface MoodCountDto {
  moodCode: string;
  moodName: string;
  emoji: string;
  color: string;
  count: number;
  percentage: number;
}

export interface MindsetGrowthDto {
  morningReflectionsCount: number;
  eveningReflectionsCount: number;
  totalDaysWithReflections: number;
  averageMorningEnergy: number | null;
  averageEveningSatisfaction: number | null;
  totalPlannedStudyMinutes: number;
  actualStudyMinutes: number;
  moodDistribution: MoodCountDto[];
}

export interface SmartRecommendationDto {
  id: string;
  category: string;
  priority: 'Critical' | 'Important' | 'Informational';
  title: string;
  message: string;
  actionLabel: string;
  actionUrl: string;
}

