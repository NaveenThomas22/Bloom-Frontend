import React, { useState, useEffect } from 'react';
import { useActivityCategories, useCreatePlan, useUpdatePlan } from '../hooks/useActivities';
import { useSyllabusOverview, useSubjectDetail } from '@/features/syllabus/hooks/useSyllabus';
import type { PlannedActivityDto, CreatePlannedActivityDto, UpdatePlannedActivityDto } from '@/types/activity';
import { Calendar, X, AlertCircle } from 'lucide-react';

interface PlannedActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDate: string; // YYYY-MM-DD
  editingPlan?: PlannedActivityDto | null;
}

export const PlannedActivityModal: React.FC<PlannedActivityModalProps> = ({
  isOpen,
  onClose,
  targetDate,
  editingPlan,
}) => {
  const { data: categories = [] } = useActivityCategories(false);
  const { data: syllabusOverview } = useSyllabusOverview();
  const createPlan = useCreatePlan();
  const updatePlan = useUpdatePlan();

  const toTimeString = (dateStr?: string) => {
    if (!dateStr) return '14:00';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '14:00';
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const [categoryId, setCategoryId] = useState<number>(categories[0]?.id || 0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('15:30');
  const [selectedSubjectId, setSelectedSubjectId] = useState<number>(0);
  const [selectedTopicId, setSelectedTopicId] = useState<number | ''>('');
  const [error, setError] = useState<string | null>(null);

  const { data: subjectDetail } = useSubjectDetail(selectedSubjectId);

  // Set default subject when overview loads
  useEffect(() => {
    if (selectedSubjectId === 0 && syllabusOverview?.subjects && syllabusOverview.subjects.length > 0) {
      setSelectedSubjectId(syllabusOverview.subjects[0].id);
    }
  }, [syllabusOverview, selectedSubjectId]);

  useEffect(() => {
    if (editingPlan) {
      setCategoryId(editingPlan.activityCategoryId || categories[0]?.id || 0);
      setTitle(editingPlan.title || '');
      setDescription(editingPlan.description || '');
      setStartTime(toTimeString(editingPlan.plannedStartAtUtc));
      setEndTime(toTimeString(editingPlan.plannedEndAtUtc));
      setSelectedTopicId(editingPlan.linkedTopicId || '');
    } else {
      setTitle('');
      setDescription('');
      setStartTime('14:00');
      setEndTime('15:30');
      setSelectedTopicId('');
      if (categories.length > 0) {
        setCategoryId(categories[0].id);
      }
    }
    setError(null);
  }, [editingPlan, categories]);

  if (!isOpen) return null;

  const isEditing = Boolean(editingPlan && editingPlan.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!categoryId) {
      setError('Please select an activity category.');
      return;
    }

    if (!title.trim()) {
      setError('Please provide a title for this planned block.');
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

    const plannedStartAtUtc = startLocal.toISOString();
    const plannedEndAtUtc = endLocal.toISOString();
    const timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

    try {
      if (isEditing && editingPlan?.id) {
        const updateDto: UpdatePlannedActivityDto = {
          activityCategoryId: categoryId,
          title: title.trim(),
          description: description.trim() || undefined,
          plannedStartAtUtc,
          plannedEndAtUtc,
          timezoneId,
          linkedTopicId: selectedTopicId === '' ? null : Number(selectedTopicId),
          planStatus: editingPlan.planStatus || 'Scheduled',
        };
        await updatePlan.mutateAsync({ id: editingPlan.id, dto: updateDto });
      } else {
        const createDto: CreatePlannedActivityDto = {
          activityCategoryId: categoryId,
          title: title.trim(),
          description: description.trim() || undefined,
          plannedStartAtUtc,
          plannedEndAtUtc,
          timezoneId,
          linkedTopicId: selectedTopicId === '' ? null : Number(selectedTopicId),
        };
        await createPlan.mutateAsync(createDto);
      }
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to save planned activity.');
    }
  };

  const isSaving = createPlan.isPending || updatePlan.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl p-6 shadow-soft-xl border border-sage-200/80 dark:border-dark-border text-left space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-forest/10 dark:bg-forest/20 text-forest dark:text-sage-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
                {isEditing ? 'Edit Planned Activity' : 'Schedule Planned Activity'}
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
          <div className="p-3.5 rounded-2xl bg-rose/15 border border-rose/30 text-xs text-rose-dark flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
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
              placeholder="e.g. Solve 3 DILR sets, Afternoon Walk..."
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-sage-700 dark:text-sage-300">Planned Start</label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 font-mono focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-sage-700 dark:text-sage-300">Planned End</label>
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
            <label className="font-semibold text-sage-700 dark:text-sage-300">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Goals or objectives for this block..."
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
              {isSaving ? 'Scheduling...' : isEditing ? 'Update Plan' : 'Schedule Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
