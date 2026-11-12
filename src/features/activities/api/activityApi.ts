import { apiClient } from '@/lib/api/client';
import type { ApiResponse } from '@/types/auth';
import type {
  ActivityCategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  ActivityRecordDto,
  CreateActivityRecordDto,
  UpdateActivityRecordDto,
  PlannedActivityDto,
  CreatePlannedActivityDto,
  UpdatePlannedActivityDto,
  DailyTimelineDto,
  DailyTimeSummaryDto,
  ActiveTimerDto,
  StartTimerDto,
  CompleteTimerDto,
  WeeklyReportDto,
  MonthlyReportDto,
} from '@/types/activity';

export const activityApi = {
  // Activity Categories
  async getCategories(includeInactive = false): Promise<ActivityCategoryDto[]> {
    const res = await apiClient.get<ApiResponse<ActivityCategoryDto[]>>('/activity-categories', {
      params: { includeInactive },
    });
    return res.data.data;
  },

  async getCategoryById(id: number): Promise<ActivityCategoryDto> {
    const res = await apiClient.get<ApiResponse<ActivityCategoryDto>>(`/activity-categories/${id}`);
    return res.data.data;
  },

  async createCategory(dto: CreateCategoryDto): Promise<ActivityCategoryDto> {
    const res = await apiClient.post<ApiResponse<ActivityCategoryDto>>('/activity-categories', dto);
    return res.data.data;
  },

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<ActivityCategoryDto> {
    const res = await apiClient.put<ApiResponse<ActivityCategoryDto>>(`/activity-categories/${id}`, dto);
    return res.data.data;
  },

  async deleteCategory(id: number): Promise<boolean> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/activity-categories/${id}`);
    return res.data.data;
  },

  // Activities & Timeline
  async getDailyTimeline(targetDate?: string, timezoneId?: string): Promise<DailyTimelineDto> {
    const res = await apiClient.get<ApiResponse<DailyTimelineDto>>('/activities/timeline', {
      params: { targetDate, timezoneId },
    });
    return res.data.data;
  },

  async getDailySummary(targetDate?: string, timezoneId?: string): Promise<DailyTimeSummaryDto> {
    const res = await apiClient.get<ApiResponse<DailyTimeSummaryDto>>('/activities/summary', {
      params: { targetDate, timezoneId },
    });
    return res.data.data;
  },

  async getActivityRecord(id: number): Promise<ActivityRecordDto> {
    const res = await apiClient.get<ApiResponse<ActivityRecordDto>>(`/activities/${id}`);
    return res.data.data;
  },

  async createActivityRecord(dto: CreateActivityRecordDto): Promise<ActivityRecordDto> {
    const res = await apiClient.post<ApiResponse<ActivityRecordDto>>('/activities', dto);
    return res.data.data;
  },

  async updateActivityRecord(id: number, dto: UpdateActivityRecordDto): Promise<ActivityRecordDto> {
    const res = await apiClient.put<ApiResponse<ActivityRecordDto>>(`/activities/${id}`, dto);
    return res.data.data;
  },

  async deleteActivityRecord(id: number): Promise<boolean> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/activities/${id}`);
    return res.data.data;
  },

  // Study Timer
  async getActiveTimer(): Promise<ActiveTimerDto> {
    const res = await apiClient.get<ApiResponse<ActiveTimerDto>>('/study-timer/active');
    return res.data.data;
  },

  async startTimer(dto: StartTimerDto): Promise<ActiveTimerDto> {
    const res = await apiClient.post<ApiResponse<ActiveTimerDto>>('/study-timer/start', dto);
    return res.data.data;
  },

  async pauseTimer(): Promise<ActiveTimerDto> {
    const res = await apiClient.post<ApiResponse<ActiveTimerDto>>('/study-timer/pause');
    return res.data.data;
  },

  async resumeTimer(): Promise<ActiveTimerDto> {
    const res = await apiClient.post<ApiResponse<ActiveTimerDto>>('/study-timer/resume');
    return res.data.data;
  },

  async completeTimer(dto: CompleteTimerDto): Promise<ActivityRecordDto> {
    const res = await apiClient.post<ApiResponse<ActivityRecordDto>>('/study-timer/complete', dto);
    return res.data.data;
  },

  async cancelTimer(): Promise<boolean> {
    const res = await apiClient.post<ApiResponse<boolean>>('/study-timer/cancel');
    return res.data.data;
  },

  // Planned Activities
  async getPlannedActivities(targetDate?: string, timezoneId?: string): Promise<PlannedActivityDto[]> {
    const res = await apiClient.get<ApiResponse<PlannedActivityDto[]>>('/planned-activities', {
      params: { targetDate, timezoneId },
    });
    return res.data.data;
  },

  async createPlannedActivity(dto: CreatePlannedActivityDto): Promise<PlannedActivityDto> {
    const res = await apiClient.post<ApiResponse<PlannedActivityDto>>('/planned-activities', dto);
    return res.data.data;
  },

  async updatePlannedActivity(id: number, dto: UpdatePlannedActivityDto): Promise<PlannedActivityDto> {
    const res = await apiClient.put<ApiResponse<PlannedActivityDto>>(`/planned-activities/${id}`, dto);
    return res.data.data;
  },

  async deletePlannedActivity(id: number): Promise<boolean> {
    const res = await apiClient.delete<ApiResponse<boolean>>(`/planned-activities/${id}`);
    return res.data.data;
  },

  async startPlannedActivity(id: number): Promise<ActivityRecordDto> {
    const res = await apiClient.post<ApiResponse<ActivityRecordDto>>(`/planned-activities/${id}/start`);
    return res.data.data;
  },

  async skipPlannedActivity(id: number): Promise<PlannedActivityDto> {
    const res = await apiClient.post<ApiResponse<PlannedActivityDto>>(`/planned-activities/${id}/skip`);
    return res.data.data;
  },

  // Reports
  async getWeeklyReport(referenceDate?: string, timezoneId?: string): Promise<WeeklyReportDto> {
    const res = await apiClient.get<ApiResponse<WeeklyReportDto>>('/activity-reports/weekly', {
      params: { referenceDate, timezoneId },
    });
    return res.data.data;
  },

  async getMonthlyReport(year?: number, month?: number, timezoneId?: string): Promise<MonthlyReportDto> {
    const res = await apiClient.get<ApiResponse<MonthlyReportDto>>('/activity-reports/monthly', {
      params: { year, month, timezoneId },
    });
    return res.data.data;
  },
};

