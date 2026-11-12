import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DailyTimeline } from '../components/DailyTimeline';
import type { TimelineItemDto } from '@/types/activity';

describe('DailyTimeline Component', () => {
  const mockItems: TimelineItemDto[] = [
    {
      itemType: 'Activity',
      activityId: 1,
      categoryId: 1,
      categoryCode: 'SLEEP',
      categoryName: 'Night Sleep',
      categoryGroup: 'RestAndSleep',
      color: '#405B49',
      icon: 'moon',
      title: 'Restorative Sleep',
      description: 'Solid 8 hours of sleep',
      startTimeLocal: '2026-11-05T00:00:00',
      endTimeLocal: '2026-11-05T07:00:00',
      durationMinutes: 420,
      isRunning: false,
    },
    {
      itemType: 'Untracked',
      categoryCode: 'UNTRACKED',
      categoryName: 'Untracked Time',
      categoryGroup: 'Other',
      color: '#E9E0D1',
      icon: 'clock',
      title: 'Untracked Interval',
      startTimeLocal: '2026-11-05T07:00:00',
      endTimeLocal: '2026-11-05T08:30:00',
      durationMinutes: 90,
      isRunning: false,
    },
    {
      itemType: 'Activity',
      activityId: 2,
      categoryId: 2,
      categoryCode: 'STUDY_QA',
      categoryName: 'Quant Study',
      categoryGroup: 'Study',
      color: '#1B4332',
      icon: 'calculator',
      title: 'Percentages & Profit Loss',
      description: 'Solved 25 drills',
      startTimeLocal: '2026-11-05T08:30:00',
      endTimeLocal: '2026-11-05T10:30:00',
      durationMinutes: 120,
      isRunning: false,
      studyDetails: {
        topicName: 'Percentages',
        subjectCode: 'QA',
        studyMode: 'Practice',
        questionsAttempted: 25,
        questionsCorrect: 22,
        sessionNotes: 'Speed improved',
      },
    },
  ];

  it('renders 24-hour horizon title and tracked vs untracked statistics', () => {
    render(
      <DailyTimeline
        timelineItems={mockItems}
        totalTrackedMinutes={540}
        untrackedMinutes={900}
        totalDayMinutes={1440}
      />
    );

    expect(screen.getByText(/24-Hour Horizon/i)).toBeInTheDocument();
    expect(screen.getByText(/540m|9h/i)).toBeInTheDocument();
    expect(screen.getAllByText(/untracked/i).length).toBeGreaterThan(0);
  });

  it('renders activity cards with titles, category pills and study details', () => {
    render(
      <DailyTimeline
        timelineItems={mockItems}
        totalTrackedMinutes={540}
        untrackedMinutes={900}
        totalDayMinutes={1440}
      />
    );

    expect(screen.getByText('Restorative Sleep')).toBeInTheDocument();
    expect(screen.getByText('Percentages & Profit Loss')).toBeInTheDocument();
    expect(screen.getByText('Percentages')).toBeInTheDocument();
    expect(screen.getByText('22/25 correct')).toBeInTheDocument();
  });

  it('provides quick "Log Time" button on untracked gaps', async () => {
    const user = userEvent.setup();
    const handleLogGap = vi.fn();

    render(
      <DailyTimeline
        timelineItems={mockItems}
        totalTrackedMinutes={540}
        untrackedMinutes={900}
        totalDayMinutes={1440}
        onLogGap={handleLogGap}
      />
    );

    const logButton = screen.getByRole('button', { name: /Log Time/i });
    expect(logButton).toBeInTheDocument();
    await user.click(logButton);

    expect(handleLogGap).toHaveBeenCalledWith('2026-11-05T07:00:00', '2026-11-05T08:30:00');
  });
});
