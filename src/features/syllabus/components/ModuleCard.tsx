import React, { useState } from 'react';
import type { ModuleDetail } from '@/types/syllabus';
import { TopicCard } from './TopicCard';
import { ProgressBar } from './ProgressBar';
import { ChevronDown, ChevronUp, Folder } from 'lucide-react';

export interface ModuleCardProps {
  module: ModuleDetail;
  defaultExpanded?: boolean;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  defaultExpanded = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="rounded-3xl bg-white/80 dark:bg-dark-card/90 border border-sage-200/80 dark:border-dark-border shadow-soft overflow-hidden transition-all text-left">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-5 cursor-pointer hover:bg-sage-50/50 dark:hover:bg-dark-surface/40 transition-colors flex flex-col gap-3"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="p-1.5 rounded-lg bg-mint/40 dark:bg-dark-surface text-forest dark:text-sage-300">
                <Folder className="w-4 h-4" />
              </span>
              <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
                {module.name}
              </h3>
              {module.isCustom && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sage-200 dark:bg-dark-surface text-forest dark:text-sage-300 border border-sage-300/60 dark:border-dark-border">
                  Custom
                </span>
              )}
            </div>
            {module.description && (
              <p className="text-xs text-sage-600 dark:text-sage-400 pl-8">
                {module.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 text-sage-500">
            <span className="text-xs font-medium text-sage-700 dark:text-sage-300 tabular-nums">
              {module.completedTopicCount} / {module.topicCount} topics
            </span>
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>

        <ProgressBar
          progress={module.progressPercentage}
          showPercentage={false}
          size="sm"
        />
      </div>

      {isExpanded && (
        <div className="px-5 pb-5 pt-2 space-y-3 border-t border-sage-100/80 dark:border-dark-border/60">
          {module.topics.length === 0 ? (
            <p className="text-xs text-sage-500 py-3 text-center italic">
              No topics in this module yet.
            </p>
          ) : (
            module.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} subjectId={module.subjectId} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

