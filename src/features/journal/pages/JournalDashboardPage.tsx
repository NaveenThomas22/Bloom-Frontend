import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Plus, Search, Calendar, Trash2, Edit3, Loader2 } from 'lucide-react';
import { journalApi } from '@/lib/api/journalApi';
import type { JournalCategory, JournalEntry } from '@/types/journal';

export const JournalDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [cats, ents] = await Promise.all([
        journalApi.getCategories(),
        journalApi.getEntries({
          categoryId: selectedCategory ?? undefined,
          searchTerm: searchTerm.trim() || undefined,
          includeDrafts: true,
        }),
      ]);
      setCategories(cats);
      setEntries(ents);
    } catch (err) {
      setError('Unable to cultivate journal entries right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    try {
      await journalApi.deleteEntry(id);
      setEntries((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete entry.');
    }
  };

  const totalWords = entries.reduce((acc, curr) => acc + (curr.wordCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest dark:text-sage-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-sage-600 dark:text-sage-400" />
            Garden Journal
          </h1>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-0.5">
            Reflective sanctuary for CAT insights, breakthroughs, and thoughts
          </p>
        </div>

        <button
          onClick={() => navigate('/journal/new')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-forest dark:bg-sage-600 text-white text-xs font-semibold hover:bg-forest/90 active:scale-95 transition-all shadow-soft-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Write Entry</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
          <div className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Total Entries</div>
          <div className="text-xl font-bold font-serif text-forest dark:text-sage-100 mt-1">{entries.length}</div>
        </div>
        <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
          <div className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Words Written</div>
          <div className="text-xl font-bold font-serif text-forest dark:text-sage-100 mt-1">{totalWords.toLocaleString()}</div>
        </div>
        <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
          <div className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Categories</div>
          <div className="text-xl font-bold font-serif text-forest dark:text-sage-100 mt-1">{categories.length}</div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sage-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search journal entries by title or content..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400 shadow-soft-sm"
          />
        </form>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === null
                ? 'bg-forest text-white'
                : 'bg-white/80 dark:bg-dark-surface text-sage-700 dark:text-dark-muted border border-sage-200/60 dark:border-dark-border hover:bg-mint/40'
            }`}
          >
            All Categories
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-forest text-white'
                  : 'bg-white/80 dark:bg-dark-surface text-sage-700 dark:text-dark-muted border border-sage-200/60 dark:border-dark-border hover:bg-mint/40'
              }`}
            >
              {c.categoryName}
            </button>
          ))}
        </div>
      </div>

      {/* Entry List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 text-sage-500">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-sage-400" />
          <p className="text-xs">Gathering your notes...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200/60 text-xs text-rose-700 dark:text-rose-300">
          {error}
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white/60 dark:bg-dark-surface border border-dashed border-sage-300/80 dark:border-dark-border">
          <BookOpen className="w-10 h-10 mx-auto text-sage-400/80 mb-2" />
          <h3 className="font-serif font-bold text-forest dark:text-sage-200 text-sm">Your Journal is Quiet</h3>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-1 max-w-xs mx-auto">
            Document your thought patterns, CAT mock analysis, breakthroughs, or lessons learned.
          </p>
          <button
            onClick={() => navigate('/journal/new')}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-forest text-white text-xs font-semibold hover:bg-forest/90 shadow-soft-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Entry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => navigate(`/journal/${entry.id}`)}
              className="p-4 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border hover:border-sage-400 dark:hover:border-sage-500/50 shadow-soft-sm cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                      style={{
                        backgroundColor: entry.categoryColor ? `${entry.categoryColor}25` : '#A8BDA525',
                        color: entry.categoryColor || '#405B49',
                      }}
                    >
                      {entry.categoryName || 'General'}
                    </span>
                    {entry.isDraft && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300">
                        Draft
                      </span>
                    )}
                    <span className="text-[11px] text-sage-500 dark:text-dark-muted flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.entryDate}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-forest dark:text-sage-100 text-sm group-hover:text-forest-dark transition-colors">
                    {entry.title}
                  </h3>

                  <p className="text-xs text-sage-700 dark:text-dark-text mt-1 line-clamp-2 leading-relaxed">
                    {entry.content.replace(/[#*_`]/g, '')}
                  </p>
                </div>

                <div className="flex items-center gap-1 pt-1 opacity-80 group-hover:opacity-100">
                  <button
                    onClick={(e) => handleDelete(e, entry.id)}
                    className="p-1.5 rounded-lg text-sage-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <Edit3 className="w-3.5 h-3.5 text-sage-400 group-hover:text-forest" />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-sage-100 dark:border-dark-border/40 flex items-center justify-between text-[11px] text-sage-500 dark:text-dark-muted">
                <span>{entry.wordCount} words</span>
                <span>v{entry.version}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

