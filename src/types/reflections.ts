export interface ReflectionMood {
  id: number;
  moodCode: string;
  moodName: string;
  emoji: string;
  color: string;
  description?: string;
  displayOrder: number;
}

export interface DailyReflection {
  id: number;
  userId: number;
  reflectionDate: string; // YYYY-MM-DD

  // Morning Fields
  morningMoodId?: number;
  morningMoodName?: string;
  morningMoodEmoji?: string;
  morningMoodColor?: string;
  morningMoodIntensity?: number;
  morningEnergyLevel?: number;
  todayIntention?: string;
  mainPriority?: string;
  taskOne?: string;
  taskTwo?: string;
  taskThree?: string;
  studyTargetMinutes?: number;
  personalCommitment?: string;
  morningNotes?: string;
  morningCompletedAtUtc?: string;

  // Evening Fields
  eveningMoodId?: number;
  eveningMoodName?: string;
  eveningMoodEmoji?: string;
  eveningMoodColor?: string;
  eveningMoodIntensity?: number;
  howWasToday?: string;
  whatAccomplished?: string;
  whatWentWell?: string;
  couldHaveBeenBetter?: string;
  whatLearnedToday?: string;
  whatChallengedMe?: string;
  satisfactionRating?: number;
  improveTomorrow?: string;
  gratitudeEntry?: string;
  eveningCompletedAtUtc?: string;

  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface SaveMorningReflectionRequest {
  reflectionDate: string;
  morningMoodId: number;
  morningMoodIntensity: number;
  morningEnergyLevel: number;
  todayIntention: string;
  mainPriority?: string;
  taskOne?: string;
  taskTwo?: string;
  taskThree?: string;
  studyTargetMinutes?: number;
  personalCommitment?: string;
  morningNotes?: string;
}

export interface SaveEveningReflectionRequest {
  reflectionDate: string;
  eveningMoodId: number;
  eveningMoodIntensity: number;
  howWasToday?: string;
  whatAccomplished?: string;
  whatWentWell?: string;
  couldHaveBeenBetter?: string;
  whatLearnedToday?: string;
  whatChallengedMe?: string;
  satisfactionRating?: number;
  improveTomorrow?: string;
  gratitudeEntry?: string;
}

export interface WeeklyReflectionSummary {
  startOfWeek: string;
  endOfWeek: string;
  totalReflectionsLogged: number;
  morningReflectionsCount: number;
  eveningReflectionsCount: number;
  averageSatisfactionRating?: number;
  averageMorningEnergy?: number;
  topMood?: string;
  daysWithReflections: string[];
}

