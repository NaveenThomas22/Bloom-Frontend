import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/test-utils';
import { ActiveTimerWidget } from '../components/ActiveTimerWidget';
import { activityApi } from '../api/activityApi';

vi.mock('../api/activityApi', () => ({
  activityApi: {
    getActiveTimer: vi.fn(),
    pauseTimer: vi.fn(),
    resumeTimer: vi.fn(),
    completeTimer: vi.fn(),
    cancelTimer: vi.fn(),
  },
}));

describe('ActiveTimerWidget Component', () => {
  it('renders nothing when no active timer exists', () => {
    vi.mocked(activityApi.getActiveTimer).mockResolvedValue({
      hasActiveTimer: false,
      elapsedSeconds: 0,
    });

    const { container } = renderWithProviders(<ActiveTimerWidget />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders running timer with title, category, and pause action', async () => {
    vi.mocked(activityApi.getActiveTimer).mockResolvedValue({
      hasActiveTimer: true,
      sessionGroupId: 'sess-1',
      title: 'Algebra Polynomials',
      categoryName: 'Quant Study',
      timerState: 'Running',
      elapsedSeconds: 125, // 00:02:05
    });

    renderWithProviders(<ActiveTimerWidget />);

    expect(await screen.findByText('Algebra Polynomials')).toBeInTheDocument();
    expect(screen.getByText('Quant Study')).toBeInTheDocument();
    expect(screen.getByText('00:02:05')).toBeInTheDocument();
    expect(screen.getByTitle('Pause Timer')).toBeInTheDocument();
    expect(screen.getByTitle('Complete Session')).toBeInTheDocument();
  });

  it('renders paused timer with resume button and paused status tag', async () => {
    vi.mocked(activityApi.getActiveTimer).mockResolvedValue({
      hasActiveTimer: true,
      sessionGroupId: 'sess-1',
      title: 'DILR Puzzles',
      categoryName: 'DILR Study',
      timerState: 'Paused',
      elapsedSeconds: 300,
    });

    renderWithProviders(<ActiveTimerWidget />);

    expect(await screen.findByText('DILR Puzzles')).toBeInTheDocument();
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByTitle('Resume Timer')).toBeInTheDocument();
  });
});
