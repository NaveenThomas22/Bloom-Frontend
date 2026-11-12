import React, { useState, useEffect } from 'react';
import {
  useActiveTimer,
  usePauseTimer,
  useResumeTimer,
  useCompleteTimer,
  useCancelTimer,
} from '../hooks/useActivities';
import { CompleteTimerModal } from './CompleteTimerModal';
import { formatSecondsToTimer } from '@/lib/utils/dateUtils';
import { Play, Pause, CheckCircle2, X, Clock } from 'lucide-react';

export const ActiveTimerWidget: React.FC = () => {
  const { data: activeTimer } = useActiveTimer();
  const pauseTimer = usePauseTimer();
  const resumeTimer = useResumeTimer();
  const completeTimer = useCompleteTimer();
  const cancelTimer = useCancelTimer();

  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Sync with server-authoritative elapsed seconds
  useEffect(() => {
    if (activeTimer?.hasActiveTimer) {
      setSeconds(activeTimer.elapsedSeconds || 0);
    }
  }, [activeTimer?.elapsedSeconds, activeTimer?.hasActiveTimer]);

  // Tick every second if Running
  useEffect(() => {
    if (!activeTimer?.hasActiveTimer || activeTimer.timerState !== 'Running') {
      return;
    }

    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer?.hasActiveTimer, activeTimer?.timerState]);

  if (!activeTimer?.hasActiveTimer) {
    return null;
  }

  const isRunning = activeTimer.timerState === 'Running';

  return (
    <>
      <div className="fixed bottom-20 inset-x-4 max-w-lg mx-auto z-40 animate-in slide-in-from-bottom duration-300">
        <div className="bg-white/95 dark:bg-dark-card/95 backdrop-blur-md rounded-3xl p-3.5 shadow-soft-xl border border-forest/30 dark:border-forest/50 flex items-center justify-between gap-3">
          {/* Status & Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`p-2.5 rounded-2xl shrink-0 ${
                isRunning
                  ? 'bg-forest text-ivory animate-pulse shadow-soft-sm'
                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-xs text-sage-950 dark:text-sage-100 truncate">
                  {activeTimer.title || 'Active Session'}
                </span>
                <span
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0"
                  style={{
                    backgroundColor: `${activeTimer.color || '#2D6A4F'}1A`,
                    color: activeTimer.color || '#2D6A4F',
                  }}
                >
                  {activeTimer.categoryName || 'Study'}
                </span>
              </div>
              <div className="font-mono text-sm font-bold text-forest dark:text-sage-100 tracking-wider">
                {formatSecondsToTimer(seconds)}
                {!isRunning && (
                  <span className="ml-2 text-[10px] font-sans font-medium text-amber-700 dark:text-amber-400">
                    Paused
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            {isRunning ? (
              <button
                type="button"
                onClick={() => pauseTimer.mutate()}
                disabled={pauseTimer.isPending}
                className="p-2 rounded-xl bg-ivory-200 dark:bg-dark-surface hover:bg-ivory-300 text-sage-800 dark:text-sage-200 shadow-soft-sm active:scale-95 transition-all"
                title="Pause Timer"
              >
                <Pause className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => resumeTimer.mutate()}
                disabled={resumeTimer.isPending}
                className="p-2 rounded-xl bg-forest hover:bg-forest-dark text-ivory shadow-soft-sm active:scale-95 transition-all"
                title="Resume Timer"
              >
                <Play className="w-4 h-4 fill-current" />
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCompleteModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-forest hover:bg-forest-dark text-ivory text-xs font-semibold shadow-soft-sm active:scale-95 transition-all flex items-center gap-1"
              title="Complete Session"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Done</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Cancel this active timer without recording?')) {
                  cancelTimer.mutate();
                }
              }}
              disabled={cancelTimer.isPending}
              className="p-2 rounded-xl text-sage-400 hover:text-rose-dark hover:bg-rose/10 transition-colors"
              title="Cancel Timer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <CompleteTimerModal
        isOpen={isCompleteModalOpen}
        activeTimer={activeTimer}
        onClose={() => setIsCompleteModalOpen(false)}
        onComplete={async (dto) => {
          await completeTimer.mutateAsync(dto);
        }}
        isSubmitting={completeTimer.isPending}
      />
    </>
  );
};
