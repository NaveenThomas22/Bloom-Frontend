import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import type { LearningStatus, TopicPriority } from '@/types/syllabus';

describe('StatusBadge', () => {
  const statuses: Array<{ status: LearningStatus; expectedText: string }> = [
    { status: 'NotStarted', expectedText: 'Not Started' },
    { status: 'Learning', expectedText: 'Learning' },
    { status: 'Practicing', expectedText: 'Practicing' },
    { status: 'Completed', expectedText: 'Completed' },
    { status: 'RevisionDue', expectedText: 'Revision Due' },
    { status: 'Mastered', expectedText: 'Mastered' },
  ];

  statuses.forEach(({ status, expectedText }) => {
    it(`renders correct label for status: ${status}`, () => {
      render(<StatusBadge status={status} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
});

describe('PriorityBadge', () => {
  const priorities: Array<{ priority: TopicPriority; expectedText: string }> = [
    { priority: 'Low', expectedText: 'Low' },
    { priority: 'Medium', expectedText: 'Medium' },
    { priority: 'High', expectedText: 'High' },
    { priority: 'Urgent', expectedText: 'Urgent' },
  ];

  priorities.forEach(({ priority, expectedText }) => {
    it(`renders correct label for priority: ${priority}`, () => {
      render(<PriorityBadge priority={priority} />);
      expect(screen.getByText(expectedText)).toBeInTheDocument();
    });
  });
});
