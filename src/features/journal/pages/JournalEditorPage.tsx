import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Eye, Edit3, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { journalApi } from '@/lib/api/journalApi';
import type { JournalCategory } from '@/types/journal';

export const JournalEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState<JournalCategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(1);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [entryDate, setEntryDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [version, setVersion] = useState<number>(1);

  const [isLoading, setIsLoading] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const currentEntryIdRef = useRef<number | null>(id ? parseInt(id, 10) : null);
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const cats = await journalApi.getCategories();
        setCategories(cats);
        if (cats.length > 0 && !selectedCategoryId) {
          setSelectedCategoryId(cats[0].id);
        }

        if (id) {
          const entry = await journalApi.getEntryById(parseInt(id, 10));
          setTitle(entry.title);
          setContent(entry.content);
          setSelectedCategoryId(entry.categoryId);
          setEntryDate(entry.entryDate);
          setVersion(entry.version);
          currentEntryIdRef.current = entry.id;
        }
      } catch (err) {
        setErrorMessage('Failed to load journal entry.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInit();
  }, [id]);

  // Debounced Autosave for Drafts
  useEffect(() => {
    if (isLoading || !title.trim() || !content.trim()) return;

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        setAutosaveStatus('Autosaving draft...');
        if (currentEntryIdRef.current) {
          const updated = await journalApi.updateEntry(currentEntryIdRef.current, {
            categoryId: selectedCategoryId,
            title: title.trim(),
            content,
            entryDate,
            isDraft: true,
            expectedVersion: version,
          });
          setVersion(updated.version);
          setAutosaveStatus('Draft autosaved');
        } else {
          const created = await journalApi.createEntry({
            categoryId: selectedCategoryId,
            title: title.trim(),
            content,
            entryDate,
            isDraft: true,
          });
          currentEntryIdRef.current = created.id;
          setVersion(created.version);
          setAutosaveStatus('Draft created');
        }
      } catch (err: any) {
        if (err?.response?.status === 409) {
          setAutosaveStatus('Conflict: draft modified on another device.');
        } else {
          setAutosaveStatus(null);
        }
      }
    }, 2500);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [title, content, selectedCategoryId, entryDate]);

  const handleReloadLatest = async () => {
    if (!currentEntryIdRef.current) return;
    try {
      setIsLoading(true);
      const entry = await journalApi.getEntryById(currentEntryIdRef.current);
      setTitle(entry.title);
      setContent(entry.content);
      setSelectedCategoryId(entry.categoryId);
      setEntryDate(entry.entryDate);
      setVersion(entry.version);
      setErrorMessage(null);
      setAutosaveStatus('Reloaded latest version from server.');
    } catch {
      setErrorMessage('Failed to reload latest version.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (publish: boolean) => {
    if (!title.trim()) {
      setErrorMessage('Please provide a title for your journal entry.');
      return;
    }
    if (!content.trim()) {
      setErrorMessage('Please write some content in your entry.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      if (currentEntryIdRef.current) {
        await journalApi.updateEntry(currentEntryIdRef.current, {
          categoryId: selectedCategoryId,
          title: title.trim(),
          content,
          entryDate,
          isDraft: !publish,
          expectedVersion: version,
        });
      } else {
        await journalApi.createEntry({
          categoryId: selectedCategoryId,
          title: title.trim(),
          content,
          entryDate,
          isDraft: !publish,
        });
      }

      navigate('/journal');
    } catch (err: any) {
      if (err?.response?.status === 409) {
        setErrorMessage('Version Conflict: This entry was updated elsewhere. Please refresh and review.');
      } else {
        setErrorMessage(err?.response?.data?.message || 'Failed to save journal entry.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-sage-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-sage-400" />
        <p className="text-xs font-serif">Opening journal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/journal')}
          className="flex items-center gap-1 text-xs text-sage-600 dark:text-dark-muted hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Journal</span>
        </button>

        <div className="flex items-center gap-2">
          {autosaveStatus && (
            <span className="text-[11px] text-sage-500 dark:text-dark-muted flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-sage-600" />
              {autosaveStatus}
            </span>
          )}

          <button
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-xl border border-sage-200/60 dark:border-dark-border text-xs font-semibold text-sage-700 dark:text-dark-muted hover:bg-white dark:hover:bg-dark-surface active:scale-95 transition-all"
          >
            Save Draft
          </button>

          <button
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-forest dark:bg-sage-600 text-white text-xs font-semibold hover:bg-forest/90 active:scale-95 transition-all shadow-soft-sm"
          >
            {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Publish</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          {errorMessage.includes('Conflict') && currentEntryIdRef.current && (
            <button
              onClick={handleReloadLatest}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-semibold hover:bg-rose-700 text-[11px] shrink-0"
            >
              Reload Latest
            </button>
          )}
        </div>
      )}

      {/* Entry Metadata Form */}
      <div className="p-4 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Category</label>
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Date</label>
            <input
              type="date"
              value={entryDate}
              onChange={(e) => setEntryDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Breakthrough on Time-Speed-Distance & Mock Strategy"
            className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text font-serif font-bold placeholder:font-normal placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
      </div>

      {/* Editor & Preview Tabs */}
      <div className="rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm overflow-hidden">
        <div className="px-4 py-2 border-b border-sage-100 dark:border-dark-border flex items-center justify-between bg-ivory-100/50 dark:bg-dark-surface">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'write'
                  ? 'bg-white dark:bg-dark-bg text-forest dark:text-sage-100 shadow-soft-sm'
                  : 'text-sage-600 dark:text-dark-muted hover:text-forest'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Write</span>
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-dark-bg text-forest dark:text-sage-100 shadow-soft-sm'
                  : 'text-sage-600 dark:text-dark-muted hover:text-forest'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Preview</span>
            </button>
          </div>

          <div className="text-[11px] font-medium text-sage-500 dark:text-dark-muted">
            {wordCount} words
          </div>
        </div>

        {activeTab === 'write' ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your personal thoughts, formulas, test debrief, or daily reflection in Markdown...
- What went well today?
- What was my biggest obstacle?
- What is one thing I learned about my exam mindset?"
            rows={14}
            className="w-full p-4 text-xs font-sans leading-relaxed text-sage-900 dark:text-dark-text bg-transparent placeholder:text-sage-400 focus:outline-none resize-none"
          />
        ) : (
          <div className="p-4 min-h-[300px] prose prose-xs dark:prose-invert max-w-none text-xs leading-relaxed text-sage-900 dark:text-dark-text whitespace-pre-wrap">
            {content.trim() ? content : <span className="text-sage-400 italic">No content written yet. Switch to Write tab to add your thoughts.</span>}
          </div>
        )}
      </div>
    </div>
  );
};
