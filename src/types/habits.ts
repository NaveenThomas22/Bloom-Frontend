export interface HabitCategory {
  id: number;
  userId?: number;
  categoryCode: string;
  categoryName: string;
  description?: string;
  icon: string;
  color: string;
  displayOrder: number;
  isActive: boolean;
}

export interface HabitCompletion {
  id: number;
  userId: number;
  habitId: number;
  completionDate: string; // YYYY-MM-DD
  status: 'Completed' | 'Partial' | 'Skipped';
  actualValue: number;
  skipReason?: string;
  notes?: string;
  createdAtUtc: string;
}

export interface UserHabit {
  id: number;
  userId: number;
  categoryId: number;
  categoryName?: string;
  categoryCode?: string;
  categoryIcon?: string;
  categoryColor?: string;
  name: string;
  description?: string;
  frequency: string;
  targetFrequencyDays: number;
  targetValue: number;
  targetUnit: string;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  displayOrder: number;
  todayCompletion?: HabitCompletion;
  currentStreak: number;
}

export interface CreateHabitRequest {
  categoryId: number;
  name: string;
  description?: string;
  frequency: string;
  targetFrequencyDays: number;
  targetValue: number;
  targetUnit: string;
  startDate: string;
  endDate?: string;
  displayOrder?: number;
}

export interface UpdateHabitRequest extends CreateHabitRequest {
  isActive: boolean;
}

export interface HabitStreak {
  habitId: number;
  habitName: string;
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  completionRate30Days: number;
  lastCompletedDate?: string;
}

export interface HabitOverview {
  referenceDate: string;
  habits: UserHabit[];
  streaks: HabitStreak[];
  totalHabits: number;
  completedToday: number;
  todayCompletionRate: number;
  currentBestStreak: number;
}

export interface PersonalMilestone {
  id: number;
  userId: number;
  title: string;
  description?: string;
  category: string;
  targetValue: number;
  currentValue: number;
  progressPercentage: number;
  unit: string;
  targetDate?: string;
  status: 'InProgress' | 'Achieved' | 'Abandoned';
  achievedAtUtc?: string;
  createdAtUtc: string;
}

export interface CreateMilestoneRequest {
  title: string;
  description?: string;
  category: string;
  targetValue: number;
  currentValue?: number;
  unit: string;
  targetDate?: string;
}

export interface UpdateMilestoneRequest {
  title: string;
  description?: string;
  category: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  targetDate?: string;
  status: string;
}

export interface MilestoneOverview {
  milestones: PersonalMilestone[];
  totalMilestones: number;
  achievedCount: number;
  inProgressCount: number;
  overallProgressPercentage: number;
}

