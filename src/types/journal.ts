export interface JournalCategory {
  id: number;
  categoryCode: string;
  categoryName: string;
  description?: string;
  icon: string;
  color: string;
  isCustom: boolean;
  displayOrder: number;
}

export interface JournalEntry {
  id: number;
  userId: number;
  categoryId: number;
  categoryName?: string;
  categoryCode?: string;
  categoryIcon?: string;
  categoryColor?: string;
  title: string;
  content: string;
  entryDate: string; // YYYY-MM-DD
  isDraft: boolean;
  wordCount: number;
  version: number;
  createdAtUtc: string;
  updatedAtUtc: string;
}

export interface CreateJournalEntryRequest {
  categoryId: number;
  title: string;
  content: string;
  entryDate: string;
  isDraft?: boolean;
}

export interface UpdateJournalEntryRequest {
  categoryId: number;
  title: string;
  content: string;
  entryDate: string;
  isDraft?: boolean;
  expectedVersion: number;
}

export interface JournalQueryParameters {
  categoryId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  includeDrafts?: boolean;
  page?: number;
  pageSize?: number;
}

