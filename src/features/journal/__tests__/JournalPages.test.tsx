import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { JournalDashboardPage } from '../pages/JournalDashboardPage';
import { journalApi } from '@/lib/api/journalApi';

vi.mock('@/lib/api/journalApi', () => ({
  journalApi: {
    getCategories: vi.fn(),
    getEntries: vi.fn(),
    deleteEntry: vi.fn(),
  },
}));

describe('JournalDashboardPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders journal entries, category filters, and statistics accurately', async () => {
    vi.mocked(journalApi.getCategories).mockResolvedValue([
      {
        id: 1,
        categoryCode: 'CAT_PREPARATION',
        categoryName: 'CAT Preparation',
        icon: 'book',
        color: '#405B49',
        isCustom: false,
        displayOrder: 1,
      },
    ]);

    vi.mocked(journalApi.getEntries).mockResolvedValue([
      {
        id: 101,
        userId: 1,
        categoryId: 1,
        categoryName: 'CAT Preparation',
        categoryColor: '#405B49',
        title: 'Breakthrough on Geometry Angles',
        content: 'Circles and tangent theorems are finally clicking!',
        entryDate: '2026-11-10',
        isDraft: false,
        wordCount: 8,
        version: 1,
        createdAtUtc: '2026-11-10T00:00:00Z',
        updatedAtUtc: '2026-11-10T00:00:00Z',
      },
    ]);

    render(
      <MemoryRouter>
        <JournalDashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Garden Journal')).toBeInTheDocument();
      expect(screen.getByText('Breakthrough on Geometry Angles')).toBeInTheDocument();
      expect(screen.getByText('Circles and tangent theorems are finally clicking!')).toBeInTheDocument();
      expect(screen.getByText(/8\s*words/i)).toBeInTheDocument();
      expect(screen.getAllByText('CAT Preparation').length).toBeGreaterThanOrEqual(1);
    });
  });

  it('displays empty state when no entries exist', async () => {
    vi.mocked(journalApi.getCategories).mockResolvedValue([]);
    vi.mocked(journalApi.getEntries).mockResolvedValue([]);

    render(
      <MemoryRouter>
        <JournalDashboardPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Your Journal is Quiet/i)).toBeInTheDocument();
      expect(screen.getByText(/Create First Entry/i)).toBeInTheDocument();
    });
  });
});
