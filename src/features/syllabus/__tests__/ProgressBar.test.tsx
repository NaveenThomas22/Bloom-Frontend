import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressBar } from '../components/ProgressBar';

describe('ProgressBar', () => {
  it('renders progress percentage and label correctly', () => {
    render(<ProgressBar progress={68} label="Quantitative Aptitude" />);

    expect(screen.getByText('Quantitative Aptitude')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '68');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
  });

  it('clamps progress below 0 safely to 0%', () => {
    render(<ProgressBar progress={-25} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('clamps progress above 100 safely to 100%', () => {
    render(<ProgressBar progress={150} />);

    expect(screen.getByText('100%')).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '100');
  });

  it('handles NaN gracefully as 0%', () => {
    render(<ProgressBar progress={NaN} />);

    expect(screen.getByText('0%')).toBeInTheDocument();
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });
});
