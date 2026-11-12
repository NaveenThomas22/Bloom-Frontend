import React, { useState, useEffect } from 'react';
import { X, Flag, Loader2 } from 'lucide-react';
import type { CreateMilestoneDto, MilestonePriority, MilestoneStatus, PreparationMilestone, UpdateMilestoneDto } from '@/types/goals';
import { useSyllabusOverview } from '@/features/syllabus/hooks/useSyllabus';

interface MilestoneFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMilestoneDto | UpdateMilestoneDto) => Promise<void>;
  editingMilestone?: PreparationMilestone | null;
}

export const MilestoneFormModal: React.FC<MilestoneFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editingMilestone,
}) => {
  const { data: syllabus } = useSyllabusOverview();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState<MilestonePriority>('Medium');
  const [subjectId, setSubjectId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<MilestoneStatus>('Pending');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingMilestone) {
      setTitle(editingMilestone.title);
      setDescription(editingMilestone.description || '');
      setTargetDate(editingMilestone.targetDate);
      setPriority(editingMilestone.priority);
      setSubjectId(editingMilestone.subjectId);
      setStatus(editingMilestone.status);
    } else {
      const inTwoWeeks = new Date();
      inTwoWeeks.setDate(inTwoWeeks.getDate() + 14);
      setTitle('');
      setDescription('');
      setTargetDate(inTwoWeeks.toISOString().split('T')[0]);
      setPriority('Medium');
      setSubjectId(undefined);
      setStatus('Pending');
    }
    setError(null);
  }, [editingMilestone, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!targetDate) {
      setError('Target date is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingMilestone) {
        await onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          targetDate,
          priority,
          subjectId,
          status,
        } as UpdateMilestoneDto);
      } else {
        await onSubmit({
          title: title.trim(),
          description: description.trim() || undefined,
          targetDate,
          priority,
          subjectId,
        } as CreateMilestoneDto);
      }
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save milestone.';
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
              <Flag className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-forest dark:text-sage-100">
              {editingMilestone ? 'Edit Milestone' : 'New Preparation Milestone'}
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
          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Milestone Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Complete Arithmetic & Modern Math"
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>

          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key checkpoints or targets"
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none"
            />
          </div>

          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Target Completion Date *
            </label>
            <input
              type="date"
              required
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
            />
          </div>

          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['Low', 'Medium', 'High', 'Urgent'] as MilestonePriority[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-1.5 rounded-xl border text-center transition-all ${
                    priority === p
                      ? 'border-forest bg-forest text-ivory-100 font-semibold'
                      : 'border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card text-sage-600 dark:text-sage-300'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Link CAT Subject (Optional)
            </label>
            <select
              value={subjectId || ''}
              onChange={(e) => setSubjectId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
            >
              <option value="">General Milestone</option>
              {syllabus?.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.code})
                </option>
              ))}
            </select>
          </div>

          {editingMilestone && (
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as MilestoneStatus)}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              >
                <option value="Pending">Pending</option>
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
              ) : editingMilestone ? (
                'Save Changes'
              ) : (
                'Create Milestone'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

