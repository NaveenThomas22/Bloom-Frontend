export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
  errors?: Record<string, string[]> | null;
  statusCode: number;
  timestampUtc: string;
}

export interface UserProfile {
  dateOfBirth?: string | null;
  catTargetYear: number;
  catExamDate?: string | null;
  preparationLevel: string;
  preparationMode: string;
  timezone: string;
}

export interface UserPreferences {
  theme: string;
  dailyStudyTargetMinutes: number;
  preferredWakeTime: string;
  preferredSleepTime: string;
  notificationEnabled: boolean;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  profilePictureUrl?: string | null;
  emailVerified: boolean;
  createdAtUtc: string;
  profile?: UserProfile | null;
  preferences?: UserPreferences | null;
}

export interface AuthResponse {
  accessToken: string;
  expiresInMinutes: number;
  user: User;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  catTargetYear?: number;
  preparationLevel?: string;
  preparationMode?: string;
  timezone?: string;
  theme?: string;
  dailyStudyTargetMinutes?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UpdateProfileRequest {
  fullName?: string;
  dateOfBirth?: string | null;
  catTargetYear?: number;
  catExamDate?: string | null;
  preparationLevel?: string;
  preparationMode?: string;
  timezone?: string;
}

export interface UpdatePreferencesRequest {
  theme?: string;
  dailyStudyTargetMinutes?: number;
  preferredWakeTime?: string;
  preferredSleepTime?: string;
  notificationEnabled?: boolean;
}

