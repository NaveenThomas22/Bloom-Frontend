import React, { useState, useEffect } from 'react';
import { useActivityCategories, useStartTimer } from '../hooks/useActivities';
import { useSyllabusOverview, useSubjectDetail } from '@/features/syllabus/hooks/useSyllabus';
import type { StartTimerDto } from '@/types/activity';
import { Play, X, AlertCircle } from 'lucide-react';

interface StartTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTopicId?: number;
  defaultTitle?: string;
}

export const StartTimerModal: React.FC<StartTimerModalProps> = ({
  isOpen,
  onClose,
  defaultTopicId,
  defaultTitle,
}) => {
  const { data: categories = [] } = useActivityCategories(false);
  const { data: syllabusOverview } = useSyllabusOverview();
  const startTimer = useStartTimer();

  const studyCats = categories.filter((c) => c.categoryGroup === 'Study');
  const defaultCatId = studyCats[0]?.id || categories[0]?.id || 0;

  const [categoryId, setCategoryId] = useState<number>(defaultCatId);
  const [title, setTitle] = useState(defaultTitle || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
  const [selectedTopicId, setSelectedTopicId] = useState<number | ''>(defaultTopicId || '');
  const [studyMode, setStudyMode] = useState<string>('Practice');
  const [error, setError] = useState<string | null>(null);

  const { data: subjectDetail } = useSubjectDetail(selectedSubjectId);

  // Set default subject when overview loads
  useEffect(() => {
    if (selectedSubjectId === 0 && syllabusOverview?.subjects && syllabusOverview.subjects.length > 0) {
      setSelectedSubjectId(syllabusOverview.subjects[0].id);
    }
  }, [syllabusOverview, selectedSubjectId]);

  // Sync category default if was 0
  useEffect(() => {
    if (categoryId === 0 && categories.length > 0) {
      const preferred = studyCats[0]?.id || categories[0]?.id;
      setCategoryId(preferred);
    }
  }, [categories, studyCats, categoryId]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Please select an activity category.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for this session.');
      return;
    }

    try {
      const dto: StartTimerDto = {
        activityCategoryId: categoryId,
        title: title.trim(),
        topicId: selectedTopicId === '' ? undefined : Number(selectedTopicId),
        studyMode,
        timezoneId: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata',
      };

      await startTimer.mutateAsync(dto);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to start study timer.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl p-6 shadow-soft-xl border border-sage-200/80 dark:border-dark-border text-left space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-forest/10 dark:bg-forest/20 text-forest dark:text-sage-300">
              <Play className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
                Start Focused Study Timer
              </h3>
              <p className="text-xs text-sage-500 dark:text-dark-muted">
                Precision tracking with pause-gap exclusion
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-sage-400 hover:text-sage-700 hover:bg-sage-100 dark:hover:bg-dark-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose/15 border border-rose/30 text-xs text-rose-dark flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-sage-700 dark:text-sage-300">
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.categoryName} ({cat.categoryGroup})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sage-700 dark:text-sage-300">
              Session Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Geometry Triangles, DILR Matrix Arrangement..."
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="font-semibold text-sage-700 dark:text-sage-300">CAT Subject</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                <option value={0}>-- Subject --</option>
                {syllabusOverview?.subjects?.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-sage-700 dark:text-sage-300">Topic</label>
              <select
                value={selectedTopicId}
                onChange={(e) => setSelectedTopicId(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-2.5 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                <option value="">-- No topic --</option>
                {subjectDetail?.modules?.map((mod) => (
                  <optgroup key={mod.id} label={mod.name}>
                    {mod.topics?.map((top) => (
                      <option key={top.id} value={top.id}>
                        {top.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sage-700 dark:text-sage-300">
              Study Mode
            </label>
            <select
              value={studyMode}
              onChange={(e) => setStudyMode(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
            >
              <option value="Practice">Practice Problem Drills</option>
              <option value="Theory">Concept & Theory Learning</option>
              <option value="Revision">Revision & Formula Review</option>
              <option value="SectionalQuiz">Timed Sectional Quiz</option>
              <option value="General">General Reading / Mindset</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={startTimer.isPending}
              className="px-4 py-2 rounded-xl border border-sage-200 dark:border-dark-border text-sage-700 dark:text-sage-300 hover:bg-sage-50 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={startTimer.isPending}
              className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-dark text-ivory text-xs font-semibold shadow-soft-sm transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{startTimer.isPending ? 'Starting...' : 'Start Timer'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
