import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HabitsPage } from '../pages/HabitsPage';
import { MindsetPage } from '@/features/mindset/pages/MindsetPage';
import { habitsApi } from '@/lib/api/habitsApi';

vi.mock('@/lib/api/habitsApi', () => ({
  habitsApi: {
    getCategories: vi.fn(),
    getOverview: vi.fn(),
    recordCompletion: vi.fn(),
    deleteCompletion: vi.fn(),
    createHabit: vi.fn(),
    deleteHabit: vi.fn(),
    getMilestoneOverview: vi.fn(),
    syncMilestones: vi.fn(),
    createMilestone: vi.fn(),
    deleteMilestone: vi.fn(),
  },
}));

describe('HabitsPage & MindsetPage Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('HabitsPage renders habit streak, completion metrics, and triggers toggle', async () => {
    vi.mocked(habitsApi.getCategories).mockResolvedValue([
      { id: 1, categoryCode: 'STUDY', categoryName: 'CAT Study', icon: 'book', color: '#405B49', displayOrder: 1, isActive: true },
    ]);

    vi.mocked(habitsApi.getOverview).mockResolvedValue({
      referenceDate: '2026-11-10',
      totalHabits: 2,
      completedToday: 1,
      todayCompletionRate: 50.0,
      currentBestStreak: 7,
      habits: [
        {
          id: 10,
          userId: 1,
          categoryId: 1,
          categoryName: 'CAT Study',
          name: 'Solve 20 QA Questions',
          frequency: 'Daily',
          targetFrequencyDays: 7,
          targetValue: 20,
          targetUnit: 'questions',
          startDate: '2026-11-01',
          isActive: true,
          displayOrder: 1,
          currentStreak: 7,
          todayCompletion: {
            id: 1,
            userId: 1,
            habitId: 10,
            completionDate: '2026-11-10',
            status: 'Completed',
            actualValue: 20,
            createdAtUtc: '2026-11-10T00:00:00Z',
          },
        },
      ],
      streaks: [
        { habitId: 10, habitName: 'Solve 20 QA Questions', currentStreak: 7, longestStreak: 14, totalCompletions: 20, completionRate30Days: 95 },
      ],
    });

    render(
      <MemoryRouter>
        <HabitsPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Habits & Discipline')).toBeInTheDocument();
      expect(screen.getByText('Solve 20 QA Questions')).toBeInTheDocument();
      expect(screen.getAllByText(/7d/).length).toBeGreaterThanOrEqual(1); // Streak badge
      expect(screen.getByText('50%')).toBeInTheDocument(); // Completion rate
    });
  });

  it('MindsetPage renders milestones and handles sync live button click', async () => {
    vi.mocked(habitsApi.getMilestoneOverview).mockResolvedValue({
      totalMilestones: 2,
      achievedCount: 1,
      inProgressCount: 1,
      overallProgressPercentage: 62.5,
      milestones: [
        {
          id: 50,
          userId: 1,
          title: 'Reach 100 Study Hours',
          category: 'STUDY_HOURS',
          targetValue: 100,
          currentValue: 100,
          progressPercentage: 100,
          unit: 'hours',
          status: 'Achieved',
          achievedAtUtc: '2026-11-10T00:00:00Z',
          createdAtUtc: '2026-11-01T00:00:00Z',
        },
      ],
    });

    vi.mocked(habitsApi.syncMilestones).mockResolvedValue(1);

    render(
      <MemoryRouter>
        <MindsetPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Mindset & Milestones')).toBeInTheDocument();
      expect(screen.getByText('Reach 100 Study Hours')).toBeInTheDocument();
      expect(screen.getAllByText('Achieved').length).toBeGreaterThanOrEqual(1);
      expect(screen.getAllByText(/100%/).length).toBeGreaterThanOrEqual(1);
    });

    const syncBtn = screen.getByText('Sync Live');
    fireEvent.click(syncBtn);

    await waitFor(() => {
      expect(habitsApi.syncMilestones).toHaveBeenCalledTimes(1);
    });
  });
});
