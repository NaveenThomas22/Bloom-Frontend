import React, { useState } from 'react';
import { X, RotateCcw, Star, Clock, Loader2 } from 'lucide-react';
import type { RecordRevisionAttemptRequest, RevisionSchedule, UnderstandingLevel } from '@/types/goals';

interface RevisionAttemptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecordRevisionAttemptRequest) => Promise<void>;
  schedule: RevisionSchedule | null;
}

export const RevisionAttemptModal: React.FC<RevisionAttemptModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  schedule,
}) => {
  const [level, setLevel] = useState<UnderstandingLevel>('Good');
  const [confidence, setConfidence] = useState<number>(4);
  const [minutesSpent, setMinutesSpent] = useState<number>(20);
  const [createActivity, setCreateActivity] = useState<boolean>(true);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !schedule) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      setIsSubmitting(true);
      await onSubmit({
        revisionScheduleId: schedule.id,
        topicId: schedule.topicId,
        understandingLevel: level,
        confidenceRating: confidence,
        notes: notes.trim() || undefined,
        minutesSpent: minutesSpent > 0 ? minutesSpent : undefined,
        createActivityRecord: createActivity,
      });
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to record revision.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const levels: {
    key: UnderstandingLevel;
    label: string;
    description: string;
    badge: string;
    color: string;
  }[] = [
    {
      key: 'Difficult',
      label: 'Difficult',
      description: 'Concepts felt hazy. Resets to 1-day interval for quick recovery.',
      badge: '1 Day Retry',
      color: 'border-rose-300 bg-rose-50/60 dark:bg-rose-950/20 text-rose-800 dark:text-rose-200',
    },
    {
      key: 'Partial',
      label: 'Partial',
      description: 'Remembered key ideas with hesitation. Repeats step soon.',
      badge: 'Half Interval',
      color: 'border-amber-300 bg-amber-50/60 dark:bg-amber-950/20 text-amber-800 dark:text-amber-200',
    },
    {
      key: 'Good',
      label: 'Good',
      description: 'Solid conceptual retention. Advances to next spaced step.',
      badge: 'Next Step',
      color: 'border-sage-400 bg-sage-50/80 dark:bg-dark-card text-forest dark:text-sage-100',
    },
    {
      key: 'Mastered',
      label: 'Mastered',
      description: 'Effortless recall & problem solving. Accelerates interval.',
      badge: 'Fast Track',
      color: 'border-forest bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/80 dark:border-dark-border max-w-md w-full p-6 shadow-soft-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-sage-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-forest text-ivory-100">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-forest dark:text-sage-100">
                Log Spaced Revision
              </h3>
              <p className="text-xs text-sage-600 dark:text-dark-muted truncate max-w-[240px]">
                {schedule.topicName} (Step {schedule.stepNumber})
              </p>
            </div>
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
          {/* Outcome Selector */}
          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-2">
              How was your retention & understanding? *
            </label>
            <div className="grid grid-cols-2 gap-2">
              {levels.map((lvl) => {
                const isSelected = level === lvl.key;
                return (
                  <button
                    key={lvl.key}
                    type="button"
                    onClick={() => {
                      setLevel(lvl.key);
                      if (lvl.key === 'Difficult') setConfidence(1);
                      else if (lvl.key === 'Partial') setConfidence(2);
                      else if (lvl.key === 'Good') setConfidence(4);
                      else if (lvl.key === 'Mastered') setConfidence(5);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all relative ${
                      isSelected
                        ? `${lvl.color} ring-2 ring-forest dark:ring-sage-400 shadow-soft-sm font-semibold`
                        : 'border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card text-sage-700 dark:text-sage-300 hover:bg-sage-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-serif font-bold">{lvl.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-mono">
                        {lvl.badge}
                      </span>
                    </div>
                    <p className="text-[10px] text-sage-600 dark:text-dark-muted leading-tight">
                      {lvl.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Confidence Rating 1 to 5 */}
          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Confidence Rating: {confidence} / 5
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setConfidence(star)}
                  className="p-1 text-sage-300 hover:text-amber-400 transition-colors"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= confidence ? 'text-amber-400 fill-amber-400' : 'text-sage-200 dark:text-dark-border'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Revision Time & Activity Recording */}
          <div className="p-3 rounded-2xl bg-sage-50/80 dark:bg-dark-card border border-sage-200/50 dark:border-dark-border space-y-3">
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-sage-500" />
                Minutes Spent Reviewing
              </label>
              <input
                type="number"
                min="1"
                max="300"
                value={minutesSpent}
                onChange={(e) => setMinutesSpent(Number(e.target.value))}
                className="w-full px-3 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none text-sage-700 dark:text-sage-300">
              <input
                type="checkbox"
                checked={createActivity}
                onChange={(e) => setCreateActivity(e.target.checked)}
                className="rounded text-forest focus:ring-sage-400 w-4 h-4"
              />
              <span>Automatically log this into today's 24-hour study timeline</span>
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
              Personal Notes / Retention Reflections
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Formulas re-derived, tricky questions noted, etc."
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400 resize-none"
            />
          </div>

          <div className="pt-2 flex gap-2">
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
              ) : (
                'Save Revision'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

