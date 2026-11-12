import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { StudyPage } from '@/features/study/pages/StudyPage';
import { syllabusApi } from '../api/syllabusApi';
import type { SyllabusOverview } from '@/types/syllabus';

vi.mock('../api/syllabusApi', () => ({
  syllabusApi: {
    getOverview: vi.fn(),
  },
}));

describe('StudyPage (Syllabus Sanctuary Overview)', () => {
  const mockOverview: SyllabusOverview = {
    totalTopics: 42,
    completedTopics: 18,
    masteredTopics: 5,
    inProgressTopics: 10,
    revisionDueTopics: 3,
    notStartedTopics: 6,
    overallProgressPercentage: 61.9,
    estimatedTotalHours: 168.0,
    estimatedRemainingHours: 64.0,
    subjects: [
      {
        id: 1,
        code: 'QA',
        name: 'Quantitative Aptitude',
        description: 'Arithmetic, Algebra, Geometry, Numbers and Modern Math',
        isCustom: false,
        moduleCount: 5,
        topicCount: 22,
        completedTopicCount: 14,
        progressPercentage: 63.6,
        displayOrder: 1,
      },
      {
        id: 2,
        code: 'DILR',
        name: 'Data Interpretation & Logical Reasoning',
        description: 'Tables, Charts, Puzzles, Arrangements and Networks',
        isCustom: false,
        moduleCount: 3,
        topicCount: 12,
        completedTopicCount: 7,
        progressPercentage: 58.3,
        displayOrder: 2,
      },
      {
        id: 3,
        code: 'VARC',
        name: 'Verbal Ability & Reading Comprehension',
        description: 'RC Passages, Para Summary, Para Jumbles and Completion',
        isCustom: false,
        moduleCount: 3,
        topicCount: 8,
        completedTopicCount: 5,
        progressPercentage: 62.5,
        displayOrder: 3,
      },
      {
        id: 4,
        code: 'GK',
        name: 'General Knowledge & Current Affairs',
        description: 'Custom preparation for IIFT, XAT and SNAP',
        isCustom: true,
        moduleCount: 1,
        topicCount: 2,
        completedTopicCount: 0,
        progressPercentage: 0.0,
        displayOrder: 4,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders overall syllabus metrics and all subjects from backend', async () => {
    vi.mocked(syllabusApi.getOverview).mockResolvedValueOnce(mockOverview);

    renderWithProviders(<StudyPage />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText('CAT Syllabus & Progress')).toBeInTheDocument();
    });

    // Check overall percentage (rounded 62%)
    expect(screen.getByText('62%')).toBeInTheDocument();
    expect(screen.getByText('64 hrs')).toBeInTheDocument();

    // Check metric counts
    expect(screen.getByText('23')).toBeInTheDocument(); // completed (18) + mastered (5)
    expect(screen.getByText('10')).toBeInTheDocument(); // in progress
    expect(screen.getByText('3')).toBeInTheDocument();  // revision due
    expect(screen.getByText('42')).toBeInTheDocument(); // total topics

    // Check subjects rendered dynamically
    expect(screen.getByText('Quantitative Aptitude')).toBeInTheDocument();
    expect(screen.getByText('Data Interpretation & Logical Reasoning')).toBeInTheDocument();
    expect(screen.getByText('Verbal Ability & Reading Comprehension')).toBeInTheDocument();
    expect(screen.getByText('General Knowledge & Current Affairs')).toBeInTheDocument();

    // Check custom badge on the custom subject
    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('renders error state and retry button on fetch failure', async () => {
    vi.mocked(syllabusApi.getOverview).mockRejectedValueOnce(new Error('Network error'));

    renderWithProviders(<StudyPage />);

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Syllabus')).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
