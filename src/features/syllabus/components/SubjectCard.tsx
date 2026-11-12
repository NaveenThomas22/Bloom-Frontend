import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SubjectSummary } from '@/types/syllabus';
import { ProgressBar } from './ProgressBar';
import { ChevronRight, Layers, FileText } from 'lucide-react';

export interface SubjectCardProps {
  subject: SubjectSummary;
}

export const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const navigate = useNavigate();

  const codeColors: Record<string, { bg: string; text: string; border: string }> = {
    QA: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
      text: 'text-emerald-800 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-800/40',
    },
    DILR: {
      bg: 'bg-amber-50 dark:bg-amber-950/30',
      text: 'text-amber-800 dark:text-amber-300',
      border: 'border-amber-200 dark:border-amber-800/40',
    },
    VARC: {
      bg: 'bg-indigo-50 dark:bg-indigo-950/30',
      text: 'text-indigo-800 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-800/40',
    },
  };

  const badgeColor = codeColors[subject.code] || {
    bg: 'bg-sage-100 dark:bg-dark-surface',
    text: 'text-forest dark:text-sage-200',
    border: 'border-sage-300/60 dark:border-dark-border',
  };

  return (
    <div
      onClick={() => navigate(`/study/subject/${subject.id}`)}
      className="p-5 rounded-3xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/70 dark:border-dark-border shadow-soft hover:shadow-soft-lg hover:border-sage-300 dark:hover:border-sage-700/60 cursor-pointer transition-all duration-200 active:scale-[0.99] text-left space-y-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-2.5 py-0.5 rounded-md font-mono text-xs font-bold border ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}
            >
              {subject.code}
            </span>
            <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
              {subject.name}
            </h3>
            {subject.isCustom && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sage-200 dark:bg-dark-surface text-forest dark:text-sage-300 border border-sage-300/60 dark:border-dark-border">
                Custom
              </span>
            )}
          </div>
          {subject.description && (
            <p className="text-xs text-sage-600 dark:text-sage-400 line-clamp-2">
              {subject.description}
            </p>
          )}
        </div>
        <div className="p-2 rounded-full bg-sage-50 dark:bg-dark-surface text-sage-400 group-hover:text-forest transition-colors flex-shrink-0">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>

      <div className="space-y-2 pt-2 border-t border-sage-100 dark:border-dark-border/60">
        <div className="flex items-center justify-between text-xs text-sage-600 dark:text-sage-400">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-sage-500" />
              {subject.moduleCount} modules
            </span>
            <span className="inline-flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-sage-500" />
              {subject.completedTopicCount}/{subject.topicCount} topics
            </span>
          </div>
          <span className="font-semibold text-forest dark:text-sage-300 tabular-nums">
            {Math.round(subject.progressPercentage)}%
          </span>
        </div>

        <ProgressBar
          progress={subject.progressPercentage}
          showPercentage={false}
          size="md"
        />
      </div>
    </div>
  );
};

