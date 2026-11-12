import React, { useState } from 'react';
import {
  useDailyTimeline,
  useDailySummary,
  usePlannedActivities,
  useDeleteActivity,
  useStartPlan,
  useSkipPlan,
  useDeletePlan,
} from '@/features/activities/hooks/useActivities';
import { DailyTimeline } from '@/features/activities/components/DailyTimeline';
import { TimeSummaryCard } from '@/features/activities/components/TimeSummaryCard';
import { ActivityFormModal } from '@/features/activities/components/ActivityFormModal';
import { PlannedActivityModal } from '@/features/activities/components/PlannedActivityModal';
import { StartTimerModal } from '@/features/activities/components/StartTimerModal';
import { CategoryManagerModal } from '@/features/activities/components/CategoryManagerModal';
import type { TimelineItemDto, PlannedActivityDto } from '@/types/activity';
import { formatDateIso, formatDurationMinutes, formatTimeShort } from '@/lib/utils/dateUtils';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Play,
  Sparkles,
  Tag,
  XCircle,
  Trash2,
  Edit2,
  CalendarDays,
} from 'lucide-react';

export const PlannerPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateStr = formatDateIso(selectedDate);
  const timezoneId = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata';

  // Queries
  const { data: timelineData, isLoading: isTimelineLoading } = useDailyTimeline(dateStr, timezoneId);
  const { data: summaryData } = useDailySummary(dateStr, timezoneId);
  const { data: plannedItems = [] } = usePlannedActivities(dateStr, timezoneId);

  // Mutations
  const deleteActivity = useDeleteActivity();
  const startPlan = useStartPlan();
  const skipPlan = useSkipPlan();
  const deletePlan = useDeletePlan();

  // Modal States
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  const [editingItem, setEditingItem] = useState<TimelineItemDto | null>(null);
  const [editingPlan, setEditingPlan] = useState<PlannedActivityDto | null>(null);
  const [gapStart, setGapStart] = useState<string | undefined>();
  const [gapEnd, setGapEnd] = useState<string | undefined>();

  // Date navigation handlers
  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleLogGap = (startLocal: string, endLocal: string) => {
    setEditingItem(null);
    setGapStart(startLocal);
    setGapEnd(endLocal);
    setIsLogModalOpen(true);
  };

  const handleEditActivity = (item: TimelineItemDto) => {
    setGapStart(undefined);
    setGapEnd(undefined);
    setEditingItem(item);
    setIsLogModalOpen(true);
  };

  const handleDeleteActivity = async (id: number) => {
    if (window.confirm('Delete this logged activity? Time will return to untracked.')) {
      await deleteActivity.mutateAsync(id);
    }
  };

  const isToday = formatDateIso(new Date()) === dateStr;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header & Date Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div>
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100 flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-forest dark:text-sage-300" />
              24-Hour Life & Activity Logger
            </h1>
            <p className="text-xs text-sage-600 dark:text-dark-muted">
              Complete holistic tracking of study, sleep, nutrition and daily life
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card text-sage-700 dark:text-sage-300 text-xs font-medium hover:bg-sage-50 shadow-soft-sm active:scale-95 transition-all"
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Categories</span>
          </button>
        </div>

        {/* Date Navigation Bar */}
        <div className="flex items-center justify-between p-2 rounded-2xl bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-2 rounded-xl text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-dark-surface active:scale-95 transition-all"
            title="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-serif font-bold text-sage-950 dark:text-sage-100">
              {selectedDate.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>

            {!isToday && (
              <button
                type="button"
                onClick={handleToday}
                className="px-2 py-0.5 rounded-lg bg-mint/50 dark:bg-forest/20 text-forest dark:text-sage-300 text-[11px] font-semibold hover:bg-mint"
              >
                Go to Today
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleNextDay}
            className="p-2 rounded-xl text-sage-600 dark:text-sage-300 hover:bg-sage-100 dark:hover:bg-dark-surface active:scale-95 transition-all"
            title="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Action Floating / Top Bar */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          type="button"
          onClick={() => setIsTimerModalOpen(true)}
          className="p-3 rounded-2xl bg-forest hover:bg-forest-dark text-ivory text-xs font-semibold shadow-soft-sm flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Timer</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setGapStart(undefined);
            setGapEnd(undefined);
            setIsLogModalOpen(true);
          }}
          className="p-3 rounded-2xl bg-white dark:bg-dark-card border border-sage-200 dark:border-dark-border text-sage-900 dark:text-sage-100 hover:border-forest text-xs font-semibold shadow-soft-sm flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4 text-forest dark:text-sage-300" />
          <span>Log Activity</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setEditingPlan(null);
            setIsPlanModalOpen(true);
          }}
          className="p-3 rounded-2xl bg-white dark:bg-dark-card border border-sage-200 dark:border-dark-border text-sage-900 dark:text-sage-100 hover:border-forest text-xs font-semibold shadow-soft-sm flex flex-col items-center justify-center gap-1.5 transition-all active:scale-95"
        >
          <CalendarDays className="w-4 h-4 text-forest dark:text-sage-300" />
          <span>Plan Block</span>
        </button>
      </div>

      {/* Time Accounting Summary Card */}
      {summaryData && <TimeSummaryCard summary={summaryData} />}

      {/* Visual 24-Hour Horizon & Timeline */}
      {isTimelineLoading ? (
        <div className="space-y-3">
          <div className="h-28 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
          <div className="h-24 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
        </div>
      ) : timelineData ? (
        <DailyTimeline
          timelineItems={timelineData.timelineItems || []}
          totalTrackedMinutes={timelineData.trackedMinutes || 0}
          untrackedMinutes={timelineData.untrackedMinutes || 0}
          totalDayMinutes={timelineData.totalDayMinutes || 1440}
          onLogGap={handleLogGap}
          onEditItem={handleEditActivity}
          onDeleteItem={handleDeleteActivity}
        />
      ) : null}

      {/* Planned Activities Section */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-semibold text-sage-900 dark:text-sage-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-forest dark:text-sage-300" />
            Scheduled Plans ({plannedItems.length})
          </h3>

          <button
            type="button"
            onClick={() => {
              setEditingPlan(null);
              setIsPlanModalOpen(true);
            }}
            className="text-xs text-forest dark:text-sage-300 font-semibold hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Plan</span>
          </button>
        </div>

        {plannedItems.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white/50 dark:bg-dark-card/50 border border-dashed border-sage-200/80 dark:border-dark-border text-center space-y-1 text-xs">
            <p className="text-sage-500 dark:text-dark-muted font-medium">No plans scheduled for this day.</p>
            <p className="text-[11px] text-sage-400 dark:text-dark-muted">
              Pre-plan your study blocks to build consistent preparation momentum.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {plannedItems.map((plan) => {
              const isScheduled = plan.planStatus === 'Scheduled';
              const isSkipped = plan.planStatus === 'Skipped';
              const isDone = plan.planStatus === 'Completed' || Boolean(plan.actualActivityId);

              return (
                <div
                  key={plan.id}
                  className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 transition-all ${
                    isDone
                      ? 'bg-emerald-50/40 border-emerald-200/60 dark:bg-emerald-950/20 dark:border-emerald-900/40'
                      : isSkipped
                      ? 'bg-stone-100/50 border-stone-200/50 dark:bg-dark-surface dark:border-dark-border opacity-60'
                      : 'bg-white dark:bg-dark-card border-sage-200/70 dark:border-dark-border shadow-soft-sm'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: plan.color || '#A8BDA5' }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sage-950 dark:text-sage-100 truncate">
                          {plan.title}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-sage-100 dark:bg-dark-surface text-sage-600 dark:text-dark-muted shrink-0">
                          {plan.categoryName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-semibold uppercase ${
                            isDone
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : isSkipped
                              ? 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {plan.planStatus}
                        </span>
                      </div>
                      <div className="font-mono text-[11px] text-sage-500 dark:text-dark-muted mt-0.5">
                        {formatTimeShort(plan.plannedStartAtUtc)} – {formatTimeShort(plan.plannedEndAtUtc)} ·{' '}
                        {formatDurationMinutes(plan.plannedDurationMinutes)}
                      </div>
                    </div>
                  </div>

                  {/* Plan actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {isScheduled && (
                      <>
                        <button
                          type="button"
                          onClick={() => startPlan.mutate(plan.id)}
                          className="px-2.5 py-1.5 rounded-xl bg-forest hover:bg-forest-dark text-ivory text-[11px] font-medium shadow-soft-sm active:scale-95 transition-all flex items-center gap-1"
                          title="Start this activity now"
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>Start</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => skipPlan.mutate(plan.id)}
                          className="p-1.5 rounded-xl text-sage-400 hover:text-amber-700 hover:bg-amber-50"
                          title="Skip plan"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setEditingPlan(plan);
                        setIsPlanModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl text-sage-400 hover:text-forest hover:bg-sage-100"
                      title="Edit Plan"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete this plan?')) {
                          deletePlan.mutate(plan.id);
                        }
                      }}
                      className="p-1.5 rounded-xl text-sage-400 hover:text-rose-dark hover:bg-rose/10"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      <ActivityFormModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingItem(null);
          setGapStart(undefined);
          setGapEnd(undefined);
        }}
        targetDate={dateStr}
        editingItem={editingItem}
        initialStartTimeLocal={gapStart}
        initialEndTimeLocal={gapEnd}
      />

      <PlannedActivityModal
        isOpen={isPlanModalOpen}
        onClose={() => {
          setIsPlanModalOpen(false);
          setEditingPlan(null);
        }}
        targetDate={dateStr}
        editingPlan={editingPlan}
      />

      <StartTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />

      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};
