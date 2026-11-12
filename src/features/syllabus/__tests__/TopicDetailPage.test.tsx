import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Routes, Route } from 'react-router-dom';
import { renderWithProviders } from '@/test/test-utils';
import { TopicDetailPage } from '../pages/TopicDetailPage';
import { syllabusApi } from '../api/syllabusApi';
import type { TopicDetail } from '@/types/syllabus';

vi.mock('../api/syllabusApi', () => ({
  syllabusApi: {
    getTopic: vi.fn(),
    updateTopicProgress: vi.fn(),
    updateSubtopicProgress: vi.fn(),
    createResource: vi.fn(),
    deleteResource: vi.fn(),
  },
}));

describe('TopicDetailPage', () => {
  const mockTopicDetail: TopicDetail = {
    topic: {
      id: 101,
      moduleId: 5,
      name: 'Time, Speed and Distance',
      description: 'Relative speed, trains, boats and streams, races and circular tracks',
      estimatedStudyHours: 6.0,
      difficultyLevel: 'Hard',
      importanceLevel: 'High',
      displayOrder: 1,
      isCustom: false,
      status: 'Learning',
      priority: 'High',
      targetDate: '2026-11-20T00:00:00.000Z',
      completionDate: null,
      confidenceRating: 3,
      personalNotes: 'Remember average speed formula 2xy/(x+y) applies only when distance is constant.',
      isCustomExcluded: false,
      subtopicCount: 2,
      completedSubtopicCount: 1,
    },
    moduleName: 'Arithmetic Mastery',
    subjectName: 'Quantitative Aptitude',
    subjectCode: 'QA',
    subtopics: [
      {
        id: 201,
        topicId: 101,
        name: 'Relative Speed & Overtaking',
        description: 'Objects moving in same and opposite directions',
        displayOrder: 1,
        isCustom: false,
        isCompleted: true,
        completedAtUtc: '2026-11-04T12:00:00.000Z',
        notes: null,
      },
      {
        id: 202,
        topicId: 101,
        name: 'Boats, Streams and Escalators',
        description: 'Upstream, downstream and moving walkways',
        displayOrder: 2,
        isCustom: false,
        isCompleted: false,
        completedAtUtc: null,
        notes: null,
      },
    ],
    resources: [
      {
        id: 301,
        topicId: 101,
        title: 'Arun Sharma TSD Chapter Notes',
        resourceType: 'Book',
        url: 'https://example.com/tsd-notes',
        notes: 'Review level 2 problems',
        isCustom: false,
        displayOrder: 1,
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders topic details, subtopics checklist and resources from backend', async () => {
    vi.mocked(syllabusApi.getTopic).mockResolvedValueOnce(mockTopicDetail);

    renderWithProviders(
      <Routes>
        <Route path="/study/topic/:id" element={<TopicDetailPage />} />
      </Routes>,
      {
        initialEntries: ['/study/topic/101'],
      }
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Time, Speed and Distance', level: 1 })
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/Arithmetic Mastery/)).toBeInTheDocument();
    expect(screen.getByText('Difficulty: Hard')).toBeInTheDocument();
    expect(screen.getByText('Estimated: 6 hrs')).toBeInTheDocument();

    // Subtopics rendered
    expect(screen.getByText('Relative Speed & Overtaking')).toBeInTheDocument();
    expect(screen.getByText('Boats, Streams and Escalators')).toBeInTheDocument();

    // Resources rendered
    expect(screen.getByText('Arun Sharma TSD Chapter Notes')).toBeInTheDocument();
  });

  it('submits updated progress and notes to the backend', async () => {
    const user = userEvent.setup();
    vi.mocked(syllabusApi.getTopic).mockResolvedValue(mockTopicDetail);
    vi.mocked(syllabusApi.updateTopicProgress).mockResolvedValueOnce({
      ...mockTopicDetail.topic,
      status: 'Practicing',
    });

    renderWithProviders(
      <Routes>
        <Route path="/study/topic/:id" element={<TopicDetailPage />} />
      </Routes>,
      {
        initialEntries: ['/study/topic/101'],
      }
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Time, Speed and Distance', level: 1 })
      ).toBeInTheDocument();
    });

    const statusSelect = screen.getByLabelText(/learning status/i);
    await user.selectOptions(statusSelect, 'Practicing');

    const saveButton = screen.getByRole('button', { name: /update progress/i });
    await user.click(saveButton);

    await waitFor(() => {
      expect(syllabusApi.updateTopicProgress).toHaveBeenCalledWith(
        101,
        expect.objectContaining({
          status: 'Practicing',
        })
      );
    });
  });

  it('toggles subtopic completion when checkbox is clicked', async () => {
    const user = userEvent.setup();
    vi.mocked(syllabusApi.getTopic).mockResolvedValue(mockTopicDetail);
    vi.mocked(syllabusApi.updateSubtopicProgress).mockResolvedValueOnce({
      ...mockTopicDetail.subtopics[1],
      isCompleted: true,
    });

    renderWithProviders(
      <Routes>
        <Route path="/study/topic/:id" element={<TopicDetailPage />} />
      </Routes>,
      {
        initialEntries: ['/study/topic/101'],
      }
    );

    await waitFor(() => {
      expect(screen.getByText('Boats, Streams and Escalators')).toBeInTheDocument();
    });

    const uncheckedSubtopic = screen.getByText('Boats, Streams and Escalators');
    await user.click(uncheckedSubtopic);

    await waitFor(() => {
      expect(syllabusApi.updateSubtopicProgress).toHaveBeenCalledWith(
        202,
        expect.objectContaining({
          isCompleted: true,
        })
      );
    });
  });
});
