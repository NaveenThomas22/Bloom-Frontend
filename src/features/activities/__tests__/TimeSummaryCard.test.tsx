import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TimeSummaryCard } from '../components/TimeSummaryCard';
import type { DailyTimeSummaryDto } from '@/types/activity';

describe('TimeSummaryCard Component', () => {
  const mockSummary: DailyTimeSummaryDto = {
    targetDate: '2026-11-05',
    timezoneId: 'Asia/Kolkata',
    totalDayMinutes: 1440,
    trackedMinutes: 600,
    untrackedMinutes: 840,
    studyMinutes: 240,
    sleepMinutes: 480,
    mealMinutes: 90,
    workMinutes: 0,
    fitnessMinutes: 60,
    leisureMinutes: 30,
    personalMinutes: 45,
    otherMinutes: 0,
    plannedMinutes: 300,
    distribution: [
      { categoryGroup: 'RestAndSleep', totalMinutes: 480, percentageOfDay: 33.3, color: '#5E81AC' },
      { categoryGroup: 'Study', totalMinutes: 240, percentageOfDay: 16.7, color: '#2D6A4F' },
      { categoryGroup: 'MealsAndBreaks', totalMinutes: 90, percentageOfDay: 6.3, color: '#D4A373' },
    ],
    subjectStudyBreakdown: [
      { subjectCode: 'QA', subjectName: 'Quantitative Aptitude', totalMinutes: 180, totalHours: 3.0 },
      { subjectCode: 'DILR', subjectName: 'Data Interpretation & LR', totalMinutes: 60, totalHours: 1.0 },
    ],
  };

  it('renders primary metric cards for Study, Sleep, Meals and Untracked time', () => {
    render(<TimeSummaryCard summary={mockSummary} />);

    expect(screen.getByText(/24-Hour Time Accounting/i)).toBeInTheDocument();
    expect(screen.getByText('CAT Study')).toBeInTheDocument();
    expect(screen.getByText('4h')).toBeInTheDocument(); // 240m = 4h
    expect(screen.getByText('Rest & Sleep')).toBeInTheDocument();
    expect(screen.getByText('8h')).toBeInTheDocument(); // 480m = 8h
    expect(screen.getByText('Meals & Breaks')).toBeInTheDocument();
    expect(screen.getByText('Untracked Gap')).toBeInTheDocument();
  });

  it('renders subject study breakdown with hours', () => {
    render(<TimeSummaryCard summary={mockSummary} />);

    expect(screen.getByText('Subject Study Focus')).toBeInTheDocument();
    expect(screen.getByText('QA')).toBeInTheDocument();
    expect(screen.getByText('3h')).toBeInTheDocument();
    expect(screen.getByText('DILR')).toBeInTheDocument();
    expect(screen.getByText('1h')).toBeInTheDocument();
  });
});

