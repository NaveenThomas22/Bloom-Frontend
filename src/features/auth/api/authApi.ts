import { apiClient } from '@/lib/api/client';
import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdatePreferencesRequest,
  UpdateProfileRequest,
  User,
  UserPreferences,
  UserProfile,
} from '@/types/auth';

export const authApi = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  async refreshToken(): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/refresh', {});
    return response.data.data;
  },

  async logout(): Promise<void> {
    await apiClient.post<ApiResponse>('/auth/logout', {});
  },

  async logoutAll(): Promise<void> {
    await apiClient.post<ApiResponse>('/auth/logout-all', {});
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<ApiResponse<User>>('/auth/me');
    return response.data.data;
  },

  async getUserProfile(): Promise<UserProfile> {
    const response = await apiClient.get<ApiResponse<UserProfile>>('/users/me');
    return response.data.data;
  },

  async updateUserProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const response = await apiClient.put<ApiResponse<UserProfile>>('/users/me', data);
    return response.data.data;
  },

  async getUserPreferences(): Promise<UserPreferences> {
    const response = await apiClient.get<ApiResponse<UserPreferences>>('/users/me/preferences');
    return response.data.data;
  },

  async updateUserPreferences(data: UpdatePreferencesRequest): Promise<UserPreferences> {
    const response = await apiClient.put<ApiResponse<UserPreferences>>('/users/me/preferences', data);
    return response.data.data;
  },
};

