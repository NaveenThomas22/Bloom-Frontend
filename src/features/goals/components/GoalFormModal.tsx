import React, { useState, useEffect } from 'react';
import { X, Target, Loader2 } from 'lucide-react';
import type { CreateGoalDto, GoalPeriod, GoalStatus, TargetMetric, UpdateGoalDto, UserGoal } from '@/types/goals';
import { useSyllabusOverview } from '@/features/syllabus/hooks/useSyllabus';

interface GoalFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGoalDto | UpdateGoalDto) => Promise<void>;
  editingGoal?: UserGoal | null;
  defaultPeriod?: GoalPeriod;
}

export const GoalFormModal: React.FC<GoalFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingGoal,
  defaultPeriod = 'Daily',
}) => {
  const { data: syllabus } = useSyllabusOverview();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [period, setPeriod] = useState<GoalPeriod>(defaultPeriod);
  const [metric, setMetric] = useState<TargetMetric>('StudyMinutes');
  const [targetValue, setTargetValue] = useState<number>(60);
  const [unit, setUnit] = useState('Minutes');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [subjectId, setSubjectId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<GoalStatus>('Active');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingGoal) {
      setTitle(editingGoal.title);
      setDescription(editingGoal.description || '');
      setPeriod(editingGoal.goalPeriod);
      setMetric(editingGoal.targetMetric);
      setTargetValue(editingGoal.targetValue);
      setUnit(editingGoal.unit);
      setStartDate(editingGoal.startDate);
      setEndDate(editingGoal.endDate);
      setSubjectId(editingGoal.subjectId);
      setStatus(editingGoal.status);
    } else {
      const today = new Date().toISOString().split('T')[0];
      setTitle('');
      setDescription('');
      setPeriod(defaultPeriod);
      setMetric('StudyMinutes');
      setTargetValue(60);
      setUnit('Minutes');
      setStartDate(today);
      setEndDate(today);
      setSubjectId(undefined);
      setStatus('Active');
    }
    setError(null);
  }, [editingGoal, defaultPeriod, isOpen]);

  // Adjust unit default based on metric
  const handleMetricChange = (newMetric: TargetMetric) => {
    setMetric(newMetric);
    if (newMetric === 'StudyMinutes') {
      setUnit('Minutes');
      setTargetValue(120);
    } else if (newMetric === 'TopicsCompleted') {
      setUnit('Topics');
      setTargetValue(2);
    } else if (newMetric === 'SubtopicsCompleted') {
      setUnit('Subtopics');
      setTargetValue(5);
    } else if (newMetric === 'RevisionsCompleted') {
      setUnit('Revisions');
      setTargetValue(3);
    } else if (newMetric === 'ActivitiesCount') {
      setUnit('Sessions');
      setTargetValue(4);
    }
  };

  // Adjust date range when period changes
  const handlePeriodChange = (newPeriod: GoalPeriod) => {
    setPeriod(newPeriod);
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    if (newPeriod === 'Daily') {
      setStartDate(today);
      setEndDate(today);
    } else if (newPeriod === 'Weekly') {
      const day = now.getDay();
      const diffToMonday = (day + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      setStartDate(monday.toISOString().split('T')[0]);
      setEndDate(sunday.toISOString().split('T')[0]);
    } else if (newPeriod === 'Monthly') {
      const first = new Date(now.getFullYear(), now.getMonth(), 1);
      const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      setStartDate(first.toISOString().split('T')[0]);
      setEndDate(last.toISOString().split('T')[0]);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (targetValue <= 0) {
      setError('Target value must be greater than zero.');
      return;
    }
    if (startDate > endDate) {
      setError('Start date must be before or equal to end date.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingGoal) {
        await onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          targetValue,
          unit,
          startDate,
          endDate,
          subjectId,
          status,
        } as UpdateGoalDto);
      } else {
        await onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          goalPeriod: period,
          targetMetric: metric,
          targetValue,
          unit,
          startDate,
          endDate,
          subjectId,
        } as CreateGoalDto);
      }
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save goal.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/80 dark:border-dark-border max-w-md w-full p-6 shadow-soft-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-sage-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-mint/50 dark:bg-dark-card text-forest dark:text-sage-300">
              <Target className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-forest dark:text-sage-100">
              {editingGoal ? 'Edit Goal' : 'Define Target Goal'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-sage-400 hover:text-forest dark:hover:text-sage-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs font-sans">
          {/* Title */}
          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Goal Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Daily Arithmetic Practice"
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Context or notes on this target"
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none"
            />
          </div>

          {/* Goal Period */}
          {!editingGoal && (
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Goal Period
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(['Daily', 'Weekly', 'Monthly', 'Custom'] as GoalPeriod[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePeriodChange(p)}
                    className={`py-1.5 rounded-xl border text-center transition-all ${
                      period === p
                        ? 'border-forest bg-forest text-ivory-100 font-semibold'
                        : 'border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card text-sage-600 dark:text-sage-300'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Metric */}
          {!editingGoal && (
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Measurable Target Metric
              </label>
              <select
                value={metric}
                onChange={(e) => handleMetricChange(e.target.value as TargetMetric)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="StudyMinutes">Study Minutes (from Activity Logger)</option>
                <option value="TopicsCompleted">Topics Completed (Syllabus Progress)</option>
                <option value="SubtopicsCompleted">Subtopics Completed</option>
                <option value="RevisionsCompleted">Revisions Completed</option>
                <option value="ActivitiesCount">Logged Study Sessions</option>
              </select>
            </div>
          )}

          {/* Target Value & Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Target Value *
              </label>
              <input
                type="number"
                min="1"
                step="any"
                required
                value={targetValue}
                onChange={(e) => setTargetValue(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Unit
              </label>
              <input
                type="text"
                required
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>

          {/* Subject Filter (Optional) */}
          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Link Subject (Optional)
            </label>
            <select
              value={subjectId || ''}
              onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              <option value="">All CAT Subjects</option>
              {syllabus?.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {/* Start and End Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Start Date
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                End Date
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
          </div>

          {/* Status (If editing) */}
          {editingGoal && (
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as GoalStatus)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          )}

          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-2xl border border-sage-200 dark:border-dark-border text-sage-600 dark:text-sage-300 font-medium hover:bg-sage-50 dark:hover:bg-dark-card transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2 rounded-2xl bg-forest hover:bg-forest/90 text-ivory-100 font-semibold shadow-soft-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                </>
              ) : editingGoal ? (
                'Save Changes'
              ) : (
                'Create Goal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

