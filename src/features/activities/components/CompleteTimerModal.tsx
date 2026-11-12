import React, { useState } from 'react';
import type { CompleteTimerDto, ActiveTimerDto } from '@/types/activity';
import { formatSecondsToTimer } from '@/lib/utils/dateUtils';
import { CheckCircle2, X, BookOpen, AlertCircle } from 'lucide-react';

interface CompleteTimerModalProps {
  isOpen: boolean;
  activeTimer: ActiveTimerDto;
  onClose: () => void;
  onComplete: (dto: CompleteTimerDto) => Promise<void>;
  isSubmitting: boolean;
}

export const CompleteTimerModal: React.FC<CompleteTimerModalProps> = ({
  isOpen,
  activeTimer,
  onClose,
  onComplete,
  isSubmitting,
}) => {
  const [questionsAttempted, setQuestionsAttempted] = useState<number | ''>('');
  const [questionsCorrect, setQuestionsCorrect] = useState<number | ''>('');
  const [difficultyLevel, setDifficultyLevel] = useState('Moderate');
  const [sessionNotes, setSessionNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const attempted = typeof questionsAttempted === 'number' ? questionsAttempted : 0;
    const correct = typeof questionsCorrect === 'number' ? questionsCorrect : 0;

    if (correct > attempted) {
      setError('Questions correct cannot exceed total questions attempted.');
      return;
    }

    try {
      await onComplete({
        questionsAttempted: attempted,
        questionsCorrect: correct,
        difficultyLevel,
        sessionNotes: sessionNotes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to complete study session.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white dark:bg-dark-card rounded-3xl p-6 shadow-soft-xl border border-sage-200/80 dark:border-dark-border text-left space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-forest/10 dark:bg-forest/20 text-forest dark:text-sage-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
                Complete Study Session
              </h3>
              <p className="text-xs text-sage-500 dark:text-dark-muted font-mono">
                Duration: {formatSecondsToTimer(activeTimer.elapsedSeconds)}
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

        {/* Topic Info */}
        <div className="p-3.5 rounded-2xl bg-ivory-200/70 dark:bg-dark-surface border border-sage-200/50 dark:border-dark-border text-xs flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-forest shrink-0" />
          <div className="min-w-0">
            <span className="font-semibold text-sage-900 dark:text-sage-100 truncate block">
              {activeTimer.title || 'Study Session'}
            </span>
            {activeTimer.topicName && (
              <span className="text-[11px] text-sage-600 dark:text-dark-muted truncate block">
                {activeTimer.subjectCode} · {activeTimer.moduleName} · {activeTimer.topicName}
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-2xl bg-rose/15 border border-rose/30 text-xs text-rose-dark flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-sage-700 dark:text-sage-300">
                Questions Attempted
              </label>
              <input
                type="number"
                min="0"
                value={questionsAttempted}
                onChange={(e) =>
                  setQuestionsAttempted(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))
                }
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-sage-700 dark:text-sage-300">
                Questions Correct
              </label>
              <input
                type="number"
                min="0"
                value={questionsCorrect}
                onChange={(e) =>
                  setQuestionsCorrect(e.target.value === '' ? '' : Math.max(0, parseInt(e.target.value, 10)))
                }
                placeholder="0"
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sage-700 dark:text-sage-300">
              Perceived Difficulty
            </label>
            <select
              value={difficultyLevel}
              onChange={(e) => setDifficultyLevel(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
            >
              <option value="Easy">Easy</option>
              <option value="Moderate">Moderate</option>
              <option value="Challenging">Challenging</option>
              <option value="Difficult">Difficult</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-sage-700 dark:text-sage-300">
              Session Reflections & Notes
            </label>
            <textarea
              rows={3}
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Formulas reviewed, tricky questions encountered, focus quality..."
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-forest/30"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl border border-sage-200 dark:border-dark-border text-sage-700 dark:text-sage-300 hover:bg-sage-50 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-forest hover:bg-forest-dark text-ivory text-xs font-semibold shadow-soft-sm transition-all active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving Session...' : 'Log & Seal Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
