import React from 'react';
import type { TimelineItemDto } from '@/types/activity';
import { formatDurationMinutes, formatTimeShort } from '@/lib/utils/dateUtils';
import { Clock, Plus, Trash2, Edit2, BookOpen, Sparkles } from 'lucide-react';

interface DailyTimelineProps {
  timelineItems: TimelineItemDto[];
  totalTrackedMinutes: number;
  untrackedMinutes: number;
  totalDayMinutes: number;
  onLogGap?: (startTimeLocal: string, endTimeLocal: string) => void;
  onEditItem?: (item: TimelineItemDto) => void;
  onDeleteItem?: (activityId: number) => void;
}

export const DailyTimeline: React.FC<DailyTimelineProps> = ({
  timelineItems,
  totalTrackedMinutes,
  untrackedMinutes,
  totalDayMinutes,
  onLogGap,
  onEditItem,
  onDeleteItem,
}) => {
  return (
    <div className="space-y-4">
      {/* Visual 24-Hour Bar (00:00 to 24:00) */}
      <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm rounded-3xl p-4 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-sage-700 dark:text-dark-muted">
          <span className="flex items-center gap-1.5 font-serif">
            <Clock className="w-3.5 h-3.5 text-sage-500" />
            24-Hour Horizon
          </span>
          <span>
            <strong className="text-forest dark:text-sage-100">{formatDurationMinutes(totalTrackedMinutes)}</strong>{' '}
            tracked · {formatDurationMinutes(untrackedMinutes)} untracked
          </span>
        </div>

        {/* 24-Hour Continuous Segmented Bar */}
        <div className="w-full h-7 bg-ivory-300 dark:bg-dark-surface rounded-xl overflow-hidden flex shadow-inner border border-sage-200/40 dark:border-dark-border/50">
          {timelineItems.map((item, idx) => {
            const duration = item.durationMinutes ?? (item as any).DurationMinutes ?? 0;
            const itemType = item.itemType ?? (item as any).ItemType;
            const startTime = item.startTimeLocal ?? (item as any).StartTimeLocal;
            const endTime = item.endTimeLocal ?? (item as any).EndTimeLocal;
            const color = item.color ?? (item as any).Color;
            const title = item.title ?? (item as any).Title;
            const isRunning = item.isRunning ?? (item as any).IsRunning;

            const widthPct = totalDayMinutes > 0 ? (duration / totalDayMinutes) * 100 : 0;
            if (widthPct <= 0.05) return null;

            const isUntracked = itemType === 'Untracked';
            const isFuture = itemType === 'Future';

            return (
              <div
                key={`${itemType}-${idx}-${startTime}`}
                style={{
                  width: `${widthPct}%`,
                  backgroundColor: isUntracked ? '#E9E0D1' : isFuture ? '#F4EDE1' : color || '#A8BDA5',
                }}
                className={`h-full relative group transition-opacity hover:opacity-90 ${
                  isRunning ? 'animate-pulse ring-2 ring-forest/30' : ''
                }`}
                title={`${title}: ${formatTimeShort(startTime)} - ${formatTimeShort(
                  endTime
                )} (${formatDurationMinutes(duration)})`}
              />
            );
          })}
        </div>

        {/* Hour markers */}
        <div className="flex justify-between text-[10px] text-sage-400 dark:text-dark-muted px-0.5 font-mono select-none">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>

      {/* Chronological Time Blocks List */}
      <div className="space-y-2.5">
        <h3 className="font-serif text-sm font-semibold text-sage-900 dark:text-sage-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-forest dark:text-sage-300" />
          Chronological Activity Log
        </h3>

        {timelineItems.length === 0 ? (
          <div className="p-8 text-center bg-white/60 dark:bg-dark-card/60 rounded-3xl border border-dashed border-sage-300/60 dark:border-dark-border">
            <p className="text-xs text-sage-500 dark:text-dark-muted">No timeline items recorded for this day yet.</p>
          </div>
        ) : (
          timelineItems.map((item, idx) => {
            const itemType = item.itemType ?? (item as any).ItemType;
            const startTime = item.startTimeLocal ?? (item as any).StartTimeLocal;
            const endTime = item.endTimeLocal ?? (item as any).EndTimeLocal;
            const duration = item.durationMinutes ?? (item as any).DurationMinutes ?? 0;
            const color = item.color ?? (item as any).Color;
            const title = item.title ?? (item as any).Title;
            const description = item.description ?? (item as any).Description;
            const categoryName = item.categoryName ?? (item as any).CategoryName;
            const isRunning = item.isRunning ?? (item as any).IsRunning;
            const activityId = item.activityId ?? (item as any).ActivityId;
            const studyDetails = item.studyDetails ?? (item as any).StudyDetails;

            const isUntracked = itemType === 'Untracked';
            const isFuture = itemType === 'Future';

            if (isFuture) {
              return (
                <div
                  key={`future-${idx}`}
                  className="p-3 rounded-2xl bg-ivory-100/50 dark:bg-dark-surface/40 border border-dashed border-sage-200/50 dark:border-dark-border/40 text-xs flex items-center justify-between text-sage-400 dark:text-dark-muted"
                >
                  <span className="font-mono text-[11px]">
                    {formatTimeShort(startTime)} – {formatTimeShort(endTime)}
                  </span>
                  <span className="italic">Remaining Day Horizon ({formatDurationMinutes(duration)})</span>
                </div>
              );
            }

            if (isUntracked) {
              return (
                <div
                  key={`untracked-${idx}`}
                  className="p-3.5 rounded-2xl bg-ivory-200/60 dark:bg-dark-surface/60 border border-sage-200/70 dark:border-dark-border text-xs flex items-center justify-between gap-3 transition-colors hover:bg-ivory-300/60"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-sand-dark dark:bg-stone-500 shrink-0" />
                    <div>
                      <div className="font-mono text-[11px] text-sage-600 dark:text-dark-muted">
                        {formatTimeShort(startTime)} – {formatTimeShort(endTime)}
                      </div>
                      <div className="font-medium text-sage-700 dark:text-sage-300">
                        Untracked Interval · {formatDurationMinutes(duration)}
                      </div>
                    </div>
                  </div>

                  {onLogGap && (
                    <button
                      type="button"
                      onClick={() => onLogGap(startTime, endTime)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white dark:bg-dark-card border border-sage-200 dark:border-dark-border text-forest dark:text-sage-200 hover:bg-sage-50 text-[11px] font-medium shadow-soft-sm transition-all shrink-0 active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Log Time
                    </button>
                  )}
                </div>
              );
            }

            // Normal Tracked Activity
            return (
              <div
                key={`act-${activityId || idx}`}
                className={`p-4 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/70 dark:border-dark-border shadow-soft-sm text-xs space-y-2 transition-all hover:border-forest/40 ${
                  isRunning ? 'ring-2 ring-forest/40 bg-mint/10 dark:bg-forest/10' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-3 h-3 rounded-full shrink-0 shadow-soft-sm"
                      style={{ backgroundColor: color || '#2D6A4F' }}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sage-950 dark:text-sage-100 text-sm truncate">
                          {title}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-medium shrink-0"
                          style={{
                            backgroundColor: `${color || '#2D6A4F'}1A`,
                            color: color || '#2D6A4F',
                          }}
                        >
                          {categoryName}
                        </span>
                        {isRunning && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 animate-pulse">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="font-mono text-[11px] text-sage-500 dark:text-dark-muted mt-0.5">
                        {formatTimeShort(startTime)} – {formatTimeShort(endTime)} ·{' '}
                        <strong>{formatDurationMinutes(duration)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {onEditItem && activityId && (
                      <button
                        type="button"
                        onClick={() => onEditItem(item)}
                        className="p-1.5 rounded-lg text-sage-400 hover:text-forest hover:bg-sage-100 dark:hover:bg-dark-surface transition-colors"
                        title="Edit Activity"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    {onDeleteItem && activityId && (
                      <button
                        type="button"
                        onClick={() => onDeleteItem(activityId)}
                        className="p-1.5 rounded-lg text-sage-400 hover:text-rose-dark hover:bg-rose/10 transition-colors"
                        title="Delete Activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {description && (
                  <p className="text-sage-600 dark:text-dark-muted pl-5 text-[11px] leading-relaxed">
                    {description}
                  </p>
                )}

                {/* Linked CAT Study Session Details */}
                {studyDetails && (
                  <div className="mt-2 pl-5 pt-2 border-t border-sage-100 dark:border-dark-border/60 flex items-center gap-2 flex-wrap text-[11px] text-sage-600 dark:text-dark-muted">
                    <span className="inline-flex items-center gap-1 font-medium text-forest dark:text-sage-300">
                      <BookOpen className="w-3.5 h-3.5 text-forest" />
                      {studyDetails.topicName ?? (studyDetails as any).TopicName ?? studyDetails.subjectCode ?? (studyDetails as any).SubjectCode ?? 'CAT Study'}
                    </span>
                    {(studyDetails.studyMode ?? (studyDetails as any).StudyMode) && (
                      <span className="px-1.5 py-0.5 rounded bg-sage-100 dark:bg-dark-surface text-[10px]">
                        {studyDetails.studyMode ?? (studyDetails as any).StudyMode}
                      </span>
                    )}
                    {(studyDetails.questionsAttempted ?? (studyDetails as any).QuestionsAttempted) ? (
                      <span className="text-[11px] font-mono text-sage-700 dark:text-sage-300">
                        {studyDetails.questionsCorrect ?? (studyDetails as any).QuestionsCorrect ?? 0}/
                        {studyDetails.questionsAttempted ?? (studyDetails as any).QuestionsAttempted} correct
                      </span>
                    ) : null}
                    {(studyDetails.sessionNotes ?? (studyDetails as any).SessionNotes) && (
                      <span className="italic text-sage-500 dark:text-dark-muted truncate max-w-xs">
                        "{studyDetails.sessionNotes ?? (studyDetails as any).SessionNotes}"
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
