import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent, render } from '@testing-library/react';
import { GoalProgressBar } from '../components/GoalProgressBar';
import { GoalCard } from '../components/GoalCard';
import { MilestoneCard } from '../components/MilestoneCard';
import { RevisionCard } from '../components/RevisionCard';
import { RevisionAttemptModal } from '../components/RevisionAttemptModal';
import type { PreparationMilestone, RevisionSchedule, UserGoal } from '@/types/goals';

describe('Phase 6: Goals and Spaced Repetition Components', () => {
  it('GoalProgressBar displays accurate percentage and handles overachievement', () => {
    const { rerender } = render(<GoalProgressBar progressPercentage={45} isAchieved={false} />);
    expect(screen.getByText('45%')).toBeInTheDocument();
    expect(screen.queryByText(/Target Achieved/i)).toBeNull();

    rerender(<GoalProgressBar progressPercentage={125} isAchieved={true} />);
    expect(screen.getByText('125%')).toBeInTheDocument();
    expect(screen.getByText(/Target Achieved/i)).toBeInTheDocument();
  });

  it('GoalCard renders title, target metrics, and triggers callbacks', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const mockGoal: UserGoal = {
      id: 1,
      userId: 10,
      title: 'Daily QA Arithmetic',
      description: 'Solve 20 percentage and ratio questions',
      goalPeriod: 'Daily',
      targetMetric: 'StudyMinutes',
      targetValue: 120,
      unit: 'Minutes',
      startDate: '2026-11-05',
      endDate: '2026-11-05',
      subjectName: 'Quantitative Aptitude',
      status: 'Active',
      currentValue: 90,
      progressPercentage: 75,
      isAchieved: false,
      daysRemaining: 0,
      createdAtUtc: '2026-11-05T00:00:00Z',
      updatedAtUtc: '2026-11-05T00:00:00Z',
    };

    render(<GoalCard goal={mockGoal} onEdit={onEdit} onDelete={onDelete} />);

    expect(screen.getByText('Daily QA Arithmetic')).toBeInTheDocument();
    expect(screen.getByText('Quantitative Aptitude')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('/ 120 Minutes')).toBeInTheDocument();
  });

  it('MilestoneCard renders priority badge and triggers completion toggle', () => {
    const onToggle = vi.fn();
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const mockMilestone: PreparationMilestone = {
      id: 1,
      userId: 10,
      title: 'Finish Algebra Foundations',
      description: 'Target before Sectional Mocks',
      targetDate: '2026-11-20',
      priority: 'High',
      status: 'Pending',
      createdAtUtc: '2026-11-05T00:00:00Z',
      updatedAtUtc: '2026-11-05T00:00:00Z',
    };

    render(
      <MilestoneCard
        milestone={mockMilestone}
        onToggleComplete={onToggle}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );

    expect(screen.getByText('Finish Algebra Foundations')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();

    const checkButton = screen.getByRole('button', { name: /Mark complete/i });
    fireEvent.click(checkButton);
    expect(onToggle).toHaveBeenCalledWith(mockMilestone);
  });

  it('RevisionCard renders step number, due status, and triggers Review Now', () => {
    const onReview = vi.fn();
    const onReschedule = vi.fn();
    const onSkip = vi.fn();

    const mockSchedule: RevisionSchedule = {
      id: 10,
      userId: 10,
      topicId: 2,
      topicName: 'Reading Comprehension Strategies',
      subjectName: 'VARC',
      revisionPolicyId: 1,
      policyName: 'Standard',
      stepNumber: 2,
      scheduledDate: '2026-11-05',
      status: 'DueToday',
      createdAtUtc: '2026-11-05T00:00:00Z',
      updatedAtUtc: '2026-11-05T00:00:00Z',
    };

    render(
      <RevisionCard
        schedule={mockSchedule}
        onReview={onReview}
        onReschedule={onReschedule}
        onSkip={onSkip}
      />
    );

    expect(screen.getByText('Reading Comprehension Strategies')).toBeInTheDocument();
    expect(screen.getByText('Step 2')).toBeInTheDocument();
    expect(screen.getByText('Due Today')).toBeInTheDocument();

    const reviewBtn = screen.getByRole('button', { name: /Review Now/i });
    fireEvent.click(reviewBtn);
    expect(onReview).toHaveBeenCalledWith(mockSchedule);

    const skipBtn = screen.getByRole('button', { name: /Skip/i });
    fireEvent.click(skipBtn);
    expect(onSkip).toHaveBeenCalledWith(mockSchedule);
  });

  it('RevisionAttemptModal allows selecting understanding level and submits response', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    const onClose = vi.fn();

    const mockSchedule: RevisionSchedule = {
      id: 10,
      userId: 10,
      topicId: 2,
      topicName: 'Logarithms & Exponents',
      revisionPolicyId: 1,
      policyName: 'Standard',
      stepNumber: 1,
      scheduledDate: '2026-11-05',
      status: 'DueToday',
      createdAtUtc: '2026-11-05T00:00:00Z',
      updatedAtUtc: '2026-11-05T00:00:00Z',
    };

    render(
      <RevisionAttemptModal
        isOpen={true}
        onClose={onClose}
        onSubmit={onSubmit}
        schedule={mockSchedule}
      />
    );

    expect(screen.getByText('Log Spaced Revision')).toBeInTheDocument();
    expect(screen.getByText(/Logarithms & Exponents/i)).toBeInTheDocument();

    // Select "Mastered"
    const masteredBtn = screen.getByRole('button', { name: /Mastered/i });
    fireEvent.click(masteredBtn);

    const submitBtn = screen.getByRole('button', { name: /Save Revision/i });
    fireEvent.click(submitBtn);

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        revisionScheduleId: 10,
        topicId: 2,
        understandingLevel: 'Mastered',
        confidenceRating: 5,
        createActivityRecord: true,
      })
    );
  });
});

