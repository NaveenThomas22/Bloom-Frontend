import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ReflectionsDashboardPage } from '../pages/ReflectionsDashboardPage';
import { reflectionsApi } from '@/lib/api/reflectionsApi';

vi.mock('@/lib/api/reflectionsApi', () => ({
  reflectionsApi: {
    getMoods: vi.fn(),
    getReflectionByDate: vi.fn(),
    getWeeklySummary: vi.fn(),
  },
}));

describe('ReflectionsDashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders morning intention and evening reflection status cards', async () => {
    vi.mocked(reflectionsApi.getMoods).mockResolvedValue([
      { id: 1, moodCode: 'HAPPY', moodName: 'Happy', emoji: '😊', color: '#74C69D', displayOrder: 1 },
      { id: 3, moodCode: 'MOTIVATED', moodName: 'Motivated', emoji: '🔥', color: '#E76F51', displayOrder: 3 },
    ]);

    vi.mocked(reflectionsApi.getReflectionByDate).mockResolvedValue({
      id: 201,
      userId: 1,
      reflectionDate: '2026-11-10',
      morningMoodId: 3,
      morningMoodName: 'Motivated',
      morningMoodEmoji: '🔥',
      morningEnergyLevel: 5,
      todayIntention: 'Crush the DILR arrangement sets with composure',
      morningCompletedAtUtc: '2026-11-10T02:30:00Z',
      createdAtUtc: '2026-11-10T00:00:00Z',
      updatedAtUtc: '2026-11-10T00:00:00Z',
    });

    vi.mocked(reflectionsApi.getWeeklySummary).mockResolvedValue({
      startOfWeek: '2026-11-09',
      endOfWeek: '2026-11-15',
      totalReflectionsLogged: 5,
      morningReflectionsCount: 3,
      eveningReflectionsCount: 2,
      averageSatisfactionRating: 4.5,
      averageMorningEnergy: 4.2,
      daysWithReflections: ['2026-11-09', '2026-11-10'],
    });

    render(
      <MemoryRouter>
        <ReflectionsDashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Daily Reflections')).toBeInTheDocument();
      expect(screen.getByText('Morning Intention')).toBeInTheDocument();
      expect(screen.getByText('Evening Reflection')).toBeInTheDocument();
      expect(screen.getByText(/Crush the DILR arrangement sets/i)).toBeInTheDocument();
      expect(screen.getByText('3 / 7')).toBeInTheDocument(); // Morning reflections
      expect(screen.getByText('4.5 ★')).toBeInTheDocument(); // Avg satisfaction
    });
  });
});

