import React, { useState, useEffect } from 'react';
import { useActivityCategories, useLogActivity, useUpdateActivity } from '../hooks/useActivities';
import { useSyllabusOverview, useSubjectDetail } from '@/features/syllabus/hooks/useSyllabus';
import type { TimelineItemDto, CreateActivityRecordDto, UpdateActivityRecordDto } from '@/types/activity';
import { Clock, X, AlertCircle } from 'lucide-react';

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDate: string; // YYYY-MM-DD
  editingItem?: TimelineItemDto | null;
  initialStartTimeLocal?: string;
  initialEndTimeLocal?: string;
}

export const ActivityFormModal: React.FC<ActivityFormModalProps> = ({
  isOpen,
  onClose,
  targetDate,
  editingItem,
  initialStartTimeLocal,
  initialEndTimeLocal,
}) => {
  const { data: categories = [] } = useActivityCategories(false);
  const { data: syllabusOverview } = useSyllabusOverview();
  const logActivity = useLogActivity();
  const updateActivity = useUpdateActivity();

  const toTimeString = (dateStr?: string) => {
    if (!dateStr) return '09:00';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '09:00';
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const defaultCatId = categories[0]?.id || 0;
  const [categoryId, setCategoryId] = useState<number>(defaultCatId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
  const [selectedTopicId, setSelectedTopicId] = useState<number | ''>('');
  const [studyMode, setStudyMode] = useState('Practice');
  const [questionsAttempted, setQuestionsAttempted] = useState<number | ''>('');
  const [questionsCorrect, setQuestionsCorrect] = useState<number | ''>('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: subjectDetail } = useSubjectDetail(selectedSubjectId);

  // Set default subject when overview loads
  useEffect(() => {
    if (selectedSubjectId === 0 && syllabusOverview?.subjects && syllabusOverview.subjects.length > 0) {
      setSelectedSubjectId(syllabusOverview.subjects[0].id);
    }
  }, [syllabusOverview, selectedSubjectId]);

  // Initialize form state
  useEffect(() => {
    if (editingItem && editingItem.itemType === 'Activity') {
      setCategoryId(editingItem.categoryId || categories[0]?.id || 0);
      setTitle(editingItem.title || '');
      setDescription(editingItem.description || '');
      setStartTime(toTimeString(editingItem.startTimeLocal));
      setEndTime(toTimeString(editingItem.endTimeLocal));
      if (editingItem.studyDetails) {
        setSelectedTopicId(editingItem.studyDetails.topicId || '');
        setStudyMode(editingItem.studyDetails.studyMode || 'Practice');
        setQuestionsAttempted(editingItem.studyDetails.questionsAttempted ?? '');
        setQuestionsCorrect(editingItem.studyDetails.questionsCorrect ?? '');
        setSessionNotes(editingItem.studyDetails.sessionNotes || '');
      } else {
        setSelectedTopicId('');
        setQuestionsAttempted('');
        setQuestionsCorrect('');
        setSessionNotes('');
      }
    } else {
      // New activity or gap prefill
      setTitle('');
      setDescription('');
      setSelectedTopicId('');
      setQuestionsAttempted('');
      setQuestionsCorrect('');
      setSessionNotes('');
      if (initialStartTimeLocal && initialEndTimeLocal) {
        setStartTime(toTimeString(initialStartTimeLocal));
        setEndTime(toTimeString(initialEndTimeLocal));
      } else {
        setStartTime('09:00');
        setEndTime('10:00');
      }
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
    }
    setError(null);
  }, [editingItem, initialStartTimeLocal, initialEndTimeLocal, categories]);

  if (!isOpen) return null;

  const isEditing = Boolean(editingItem && editingItem.activityId);
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const isStudy = selectedCategory?.categoryGroup === 'Study' || Boolean(selectedTopicId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Please select an activity category.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for this activity.');
      return;
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);

    const [year, month, day] = targetDate.split('-').map(Number);
    const startLocal = new Date(year, month - 1, day, startH, startM, 0);
    let endLocal = new Date(year, month - 1, day, endH, endM, 0);

    if (endLocal <= startLocal) {
      endLocal = new Date(year, month - 1, day + 1, endH, endM, 0);
    }

    const startAtUtc = startLocal.toISOString();
    const endAtUtc = endLocal.toISOString();
    const timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

    try {
      if (isEditing && editingItem?.activityId) {
        const updateDto: UpdateActivityRecordDto = {
          activityCategoryId: categoryId,
          activityTitle: title.trim(),
          description: description.trim() || undefined,
          startAtUtc,
          endAtUtc,
          timezoneId,
          topicId: selectedTopicId === '' ? null : Number(selectedTopicId),
          studyMode: isStudy ? studyMode : undefined,
          questionsAttempted: typeof questionsAttempted === 'number' ? questionsAttempted : undefined,
          questionsCorrect: typeof questionsCorrect === 'number' ? questionsCorrect : undefined,
          sessionNotes: sessionNotes.trim() || undefined,
        };
        await updateActivity.mutateAsync({ id: editingItem.activityId, dto: updateDto });
      } else {
        const createDto: CreateActivityRecordDto = {
          activityCategoryId: categoryId,
          activityTitle: title.trim(),
          description: description.trim() || undefined,
          startAtUtc,
          endAtUtc,
          timezoneId,
          topicId: selectedTopicId === '' ? null : Number(selectedTopicId),
          studyMode: isStudy ? studyMode : undefined,
          questionsAttempted: typeof questionsAttempted === 'number' ? questionsAttempted : undefined,
          questionsCorrect: typeof questionsCorrect === 'number' ? questionsCorrect : undefined,
          sessionNotes: sessionNotes.trim() || undefined,
        };
        await logActivity.mutateAsync(createDto);
      }
      onClose();
    } catch (err: any) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to save activity. Please check that times do not overlap with existing activities.';
      setError(msg);
    }
  };

  const isSaving = logActivity.isPending || updateActivity.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-card rounded-3xl p-6 shadow-soft-xl border border-sage-200/80 dark:border-dark-border text-left space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-forest/10 dark:bg-forest/20 text-forest dark:text-sage-300">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
                {isEditing ? 'Edit Activity' : 'Log Daily Activity'}
              </h3>
              <p className="text-xs text-sage-500 dark:text-dark-muted font-mono">{targetDate}</p>
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
          <div className="p-3.5 rounded-2xl bg-rose/15 border border-rose/30 text-xs text-rose-dark flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-sage-700 dark:text-sage-300">Category</label>
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
            <label className="font-semibold text-sage-700 dark:text-sage-300">Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Lunch with colleagues, Morning Run, RC Practice..."
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          {/* Time pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-sage-700 dark:text-sage-300">Start Time</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 font-mono focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-sage-700 dark:text-sage-300">End Time</label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 font-mono focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sage-700 dark:text-sage-300">Description (Optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context or notes..."
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          {/* Optional CAT Study Integration Fields */}
          <div className="pt-2 border-t border-sage-200/60 dark:border-dark-border space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-semibold text-sage-700 dark:text-sage-300">CAT Subject</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(Number(e.target.value))}
                  className="w-full px-2.5 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  <option value={0}>-- Select Subject --</option>
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
                  <option value="">-- No specific topic --</option>
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

            {isStudy && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-semibold text-sage-700 dark:text-sage-300">Study Mode</label>
                    <select
                      value={studyMode}
                      onChange={(e) => setStudyMode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
                    >
                      <option value="Practice">Practice</option>
                      <option value="Theory">Theory</option>
                      <option value="Revision">Revision</option>
                      <option value="SectionalQuiz">Quiz</option>
                      <option value="General">General</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="space-y-1">
                      <label className="font-semibold text-sage-700 dark:text-sage-300">Attempted</label>
                      <input
                        type="number"
                        min="0"
                        value={questionsAttempted}
                        onChange={(e) =>
                          setQuestionsAttempted(
                            e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10))
                          )
                        }
                        placeholder="0"
                        className="w-full px-2.5 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-semibold text-sage-700 dark:text-sage-300">Correct</label>
                      <input
                        type="number"
                        min="0"
                        value={questionsCorrect}
                        onChange={(e) =>
                          setQuestionsCorrect(
                            e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10))
                          )
                        }
                        placeholder="0"
                        className="w-full px-2.5 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-sage-700 dark:text-sage-300">Session Notes</label>
                  <textarea
                    rows={2}
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                    placeholder="Key concepts or error notes..."
                    className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="px-4 py-2 rounded-xl border border-sage-200 dark:border-dark-border text-sage-700 dark:text-sage-300 hover:bg-sage-50 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl bg-forest hover:bg-forest-dark text-ivory text-xs font-semibold shadow-soft-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Log Activity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
