import React, { useState } from 'react';
import {
  RotateCcw,
  AlertCircle,
  Calendar,
  CheckCircle2,
  Settings2,
  Loader2,
} from 'lucide-react';
import type { RevisionSchedule } from '@/types/goals';
import {
  useRevisionDashboard,
  useRecordRevisionAttempt,
  useRescheduleRevision,
  useSkipRevision,
  useUpcomingRevisions,
} from '../hooks/useGoals';
import { RevisionCard } from '../components/RevisionCard';
import { RevisionAttemptModal } from '../components/RevisionAttemptModal';
import { RevisionPolicyModal } from '../components/RevisionPolicyModal';

export const RevisionPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'DueToday' | 'Overdue' | 'Upcoming'>('DueToday');

  const { data: dashboard, isLoading: dashLoading } = useRevisionDashboard();
  const { data: upcomingAll } = useUpcomingRevisions(30);

  const recordAttemptMutation = useRecordRevisionAttempt();
  const rescheduleMutation = useRescheduleRevision();
  const skipMutation = useSkipRevision();

  // Modals
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [activeScheduleForReview, setActiveScheduleForReview] = useState<RevisionSchedule | null>(null);

  const [policyModalOpen, setPolicyModalOpen] = useState(false);

  // Reschedule Prompt Modal State
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [scheduleToReschedule, setScheduleToReschedule] = useState<RevisionSchedule | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState('');

  const handleReviewClick = (schedule: RevisionSchedule) => {
    setActiveScheduleForReview(schedule);
    setReviewModalOpen(true);
  };

  const handleRescheduleClick = (schedule: RevisionSchedule) => {
    setScheduleToReschedule(schedule);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRescheduleDate(tomorrow.toISOString().split('T')[0]);
    setRescheduleReason('');
    setRescheduleModalOpen(true);
  };

  const handleConfirmReschedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!scheduleToReschedule || !rescheduleDate) return;
    await rescheduleMutation.mutateAsync({
      id: scheduleToReschedule.id,
      data: {
        newDate: rescheduleDate,
        reason: rescheduleReason.trim() || undefined,
      },
    });
    setRescheduleModalOpen(false);
  };

  const handleSkipClick = async (schedule: RevisionSchedule) => {
    if (confirm(`Skip revision Step ${schedule.stepNumber} for "${schedule.topicName}"?`)) {
      await skipMutation.mutateAsync({ id: schedule.id, reason: 'Skipped by user' });
    }
  };

  const overdueCount = dashboard?.overdueCount ?? 0;
  const dueTodayCount = dashboard?.dueTodayCount ?? 0;
  const upcomingCount = dashboard?.upcomingCount ?? 0;
  const completedTotal = dashboard?.completedTotalCount ?? 0;

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-forest to-forest/90 text-ivory-100 rounded-3xl p-5 shadow-soft-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-white/10 backdrop-blur-md">
              <RotateCcw className="w-5 h-5 text-mint" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight">Spaced Repetition Hub</h2>
              <p className="text-xs text-sage-200">Algorithmic retention for long-term CAT recall</p>
            </div>
          </div>

          <button
            onClick={() => setPolicyModalOpen(true)}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all shadow-soft-sm flex items-center gap-1.5 text-xs font-semibold text-ivory-100"
            aria-label="Revision Policies"
          >
            <Settings2 className="w-4 h-4" />
            <span className="hidden sm:inline">Policies</span>
          </button>
        </div>

        {/* Counter Pills */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-white/15 text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2">
            <span className="block text-[10px] text-sage-200">Due Today</span>
            <span className="font-serif text-lg font-bold text-mint">{dueTodayCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2">
            <span className="block text-[10px] text-rose-200">Overdue</span>
            <span className={`font-serif text-lg font-bold ${overdueCount > 0 ? 'text-rose-300' : 'text-sage-200'}`}>
              {overdueCount}
            </span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2">
            <span className="block text-[10px] text-sage-200">Upcoming</span>
            <span className="font-serif text-lg font-bold">{upcomingCount}</span>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2">
            <span className="block text-[10px] text-sage-200">Completed</span>
            <span className="font-serif text-lg font-bold">{completedTotal}</span>
          </div>
        </div>
      </div>

      {/* Overdue Warning Banner */}
      {overdueCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-rose-800 dark:text-rose-200">
            <h4 className="font-serif font-bold text-sm text-rose-900 dark:text-rose-100">
              {overdueCount} {overdueCount === 1 ? 'Topic Needs' : 'Topics Need'} Immediate Review
            </h4>
            <p className="mt-0.5 text-rose-700 dark:text-rose-300">
              Retention decay accelerates past scheduled review dates. Spend 15 minutes reviewing these topics today.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-dark-surface rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
        <button
          onClick={() => setActiveTab('DueToday')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'DueToday'
              ? 'bg-forest text-ivory-100 font-semibold shadow-soft-sm'
              : 'text-sage-600 dark:text-dark-muted hover:text-forest'
          }`}
        >
          Due Today ({dueTodayCount})
        </button>
        <button
          onClick={() => setActiveTab('Overdue')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'Overdue'
              ? 'bg-forest text-ivory-100 font-semibold shadow-soft-sm'
              : 'text-sage-600 dark:text-dark-muted hover:text-forest'
          }`}
        >
          Overdue ({overdueCount})
        </button>
        <button
          onClick={() => setActiveTab('Upcoming')}
          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'Upcoming'
              ? 'bg-forest text-ivory-100 font-semibold shadow-soft-sm'
              : 'text-sage-600 dark:text-dark-muted hover:text-forest'
          }`}
        >
          Upcoming ({upcomingCount})
        </button>
      </div>

      {/* Active Tab Listing */}
      <div className="space-y-3">
        {dashLoading ? (
          <div className="py-12 text-center text-xs text-sage-500">
            <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sage-400" />
            Updating spaced repetition curve...
          </div>
        ) : activeTab === 'DueToday' ? (
          dashboard && dashboard.dueToday.length > 0 ? (
            dashboard.dueToday.map((s) => (
              <RevisionCard
                key={s.id}
                schedule={s}
                onReview={handleReviewClick}
                onReschedule={handleRescheduleClick}
                onSkip={handleSkipClick}
              />
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/60 dark:border-dark-border">
              <CheckCircle2 className="w-8 h-8 text-forest dark:text-sage-300 mx-auto mb-2" />
              <h4 className="font-serif text-base font-semibold text-forest dark:text-sage-200">
                All Revisions Complete for Today!
              </h4>
              <p className="text-xs text-sage-500 dark:text-dark-muted mt-1 max-w-xs mx-auto">
                No revisions pending for today. Continue learning new topics or check the upcoming schedule.
              </p>
            </div>
          )
        ) : activeTab === 'Overdue' ? (
          dashboard && dashboard.overdue.length > 0 ? (
            dashboard.overdue.map((s) => (
              <RevisionCard
                key={s.id}
                schedule={s}
                onReview={handleReviewClick}
                onReschedule={handleRescheduleClick}
                onSkip={handleSkipClick}
              />
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/60 dark:border-dark-border">
              <CheckCircle2 className="w-8 h-8 text-forest dark:text-sage-300 mx-auto mb-2" />
              <h4 className="font-serif text-base font-semibold text-forest dark:text-sage-200">
                Zero Overdue Revisions
              </h4>
              <p className="text-xs text-sage-500 dark:text-dark-muted mt-1">
                Your spaced repetition schedule is perfectly up to date.
              </p>
            </div>
          )
        ) : (
          upcomingAll && upcomingAll.length > 0 ? (
            upcomingAll.map((s) => (
              <RevisionCard
                key={s.id}
                schedule={s}
                onReview={handleReviewClick}
                onReschedule={handleRescheduleClick}
                onSkip={handleSkipClick}
              />
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/60 dark:border-dark-border">
              <Calendar className="w-8 h-8 text-sage-300 dark:text-sage-600 mx-auto mb-2" />
              <h4 className="font-serif text-base font-semibold text-forest dark:text-sage-200">
                No Upcoming Revisions Scheduled
              </h4>
              <p className="text-xs text-sage-500 dark:text-dark-muted mt-1 max-w-xs mx-auto">
                When you mark topics as Completed or Mastered in the Syllabus Engine, revisions are automatically scheduled here.
              </p>
            </div>
          )
        )}
      </div>

      {/* Review Attempt Modal */}
      <RevisionAttemptModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        onSubmit={async (data) => {
          await recordAttemptMutation.mutateAsync(data);
        }}
        schedule={activeScheduleForReview}
      />

      {/* Policies Configuration Modal */}
      <RevisionPolicyModal
        isOpen={policyModalOpen}
        onClose={() => setPolicyModalOpen(false)}
      />

      {/* Reschedule Date Modal */}
      {rescheduleModalOpen && scheduleToReschedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/80 dark:border-dark-border max-w-sm w-full p-6 shadow-soft-xl">
            <h3 className="font-serif text-base font-bold text-forest dark:text-sage-100 mb-1">
              Reschedule Revision
            </h3>
            <p className="text-xs text-sage-600 dark:text-dark-muted mb-4 truncate">
              {scheduleToReschedule.topicName} (Step {scheduleToReschedule.stepNumber})
            </p>

            <form onSubmit={handleConfirmReschedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                  New Scheduled Date *
                </label>
                <input
                  type="date"
                  required
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100"
                />
              </div>

              <div>
                <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                  Reason (Optional)
                </label>
                <input
                  type="text"
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  placeholder="e.g. Taking mock exam today"
                  className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-card text-sage-900 dark:text-sage-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRescheduleModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-sage-200 dark:border-dark-border text-sage-600 dark:text-sage-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={rescheduleMutation.isPending}
                  className="flex-1 py-2 rounded-xl bg-forest text-ivory-100 font-semibold shadow-soft-sm"
                >
                  {rescheduleMutation.isPending ? 'Updating...' : 'Reschedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

