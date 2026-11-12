import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { TopicSummary } from '@/types/syllabus';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Clock, Calendar, CheckSquare, Sparkles } from 'lucide-react';

export interface TopicCardProps {
  topic: TopicSummary;
  subjectId?: number;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic }) => {
  const navigate = useNavigate();

  const difficultyColors = {
    Easy: 'text-forest dark:text-mint bg-mint/30 border-mint/50',
    Medium: 'text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/40',
    Hard: 'text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800/40',
  };

  return (
    <div
      onClick={() => navigate(`/study/topic/${topic.id}`)}
      className="p-4 rounded-2xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/70 dark:border-dark-border shadow-soft hover:shadow-soft-lg hover:border-sage-300 dark:hover:border-sage-700/60 cursor-pointer transition-all duration-200 active:scale-[0.99] text-left space-y-3"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-semibold text-base text-sage-950 dark:text-sage-100 leading-snug">
              {topic.name}
            </h4>
            {topic.isCustom && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sage-200 dark:bg-dark-surface text-forest dark:text-sage-300 border border-sage-300/60 dark:border-dark-border">
                Custom
              </span>
            )}
          </div>
          {topic.description && (
            <p className="text-xs text-sage-600 dark:text-sage-400 line-clamp-2">
              {topic.description}
            </p>
          )}
        </div>
        <StatusBadge status={topic.status} />
      </div>

      <div className="flex items-center gap-2 flex-wrap text-xs pt-1 border-t border-sage-100 dark:border-dark-border/60">
        <PriorityBadge priority={topic.priority} />

        <span
          className={`px-2 py-0.5 rounded-md text-[11px] font-medium border ${
            difficultyColors[topic.difficultyLevel] || difficultyColors.Medium
          }`}
        >
          {topic.difficultyLevel}
        </span>

        <span className="inline-flex items-center gap-1 text-[11px] text-sage-600 dark:text-sage-400">
          <Clock className="w-3 h-3 text-sage-500" />
          {topic.estimatedStudyHours} hrs
        </span>

        {topic.subtopicCount > 0 && (
          <span className="inline-flex items-center gap-1 text-[11px] text-sage-600 dark:text-sage-400 ml-auto tabular-nums">
            <CheckSquare className="w-3 h-3 text-forest dark:text-mint" />
            {topic.completedSubtopicCount}/{topic.subtopicCount}
          </span>
        )}

        {topic.targetDate && (
          <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-300 font-medium ml-auto">
            <Calendar className="w-3 h-3" />
            {new Date(topic.targetDate).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        )}

        {topic.confidenceRating > 0 && (
          <span className="inline-flex items-center gap-0.5 text-[11px] text-amber-600 dark:text-amber-400">
            <Sparkles className="w-3 h-3 fill-amber-400 text-amber-500" />
            {topic.confidenceRating}/5
          </span>
        )}
      </div>
    </div>
  );
};

