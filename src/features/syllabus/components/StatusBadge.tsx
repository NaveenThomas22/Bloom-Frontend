import React from 'react';
import type { LearningStatus } from '@/types/syllabus';
import { Circle, Clock, CheckCircle2, AlertCircle, Award, Sparkles } from 'lucide-react';

export interface StatusBadgeProps {
  status: LearningStatus;
  className?: string;
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
  showIcon = true,
}) => {
  const configs: Record<
    LearningStatus,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    NotStarted: {
      label: 'Not Started',
      bg: 'bg-sage-100/80 dark:bg-dark-surface',
      text: 'text-sage-600 dark:text-sage-400',
      border: 'border-sage-200 dark:border-dark-border',
      icon: <Circle className="w-3 h-3 stroke-[2.2]" />,
    },
    Learning: {
      label: 'Learning',
      bg: 'bg-mint/40 dark:bg-mint/20',
      text: 'text-forest dark:text-sage-200',
      border: 'border-mint/60 dark:border-mint/40',
      icon: <Clock className="w-3 h-3 stroke-[2.2] animate-spin-slow" />,
    },
    Practicing: {
      label: 'Practicing',
      bg: 'bg-beige/60 dark:bg-beige/20',
      text: 'text-sage-900 dark:text-beige',
      border: 'border-beige-dark/40 dark:border-beige/30',
      icon: <Sparkles className="w-3 h-3 stroke-[2.2]" />,
    },
    Completed: {
      label: 'Completed',
      bg: 'bg-sage-200/80 dark:bg-forest/30',
      text: 'text-forest dark:text-sage-200',
      border: 'border-forest/40 dark:border-forest/60',
      icon: <CheckCircle2 className="w-3 h-3 stroke-[2.2]" />,
    },
    RevisionDue: {
      label: 'Revision Due',
      bg: 'bg-rose/40 dark:bg-rose-dark/20',
      text: 'text-rose-dark dark:text-rose',
      border: 'border-rose/60 dark:border-rose-dark/40',
      icon: <AlertCircle className="w-3 h-3 stroke-[2.2]" />,
    },
    Mastered: {
      label: 'Mastered',
      bg: 'bg-forest text-white dark:bg-forest dark:text-sage-100',
      text: 'text-white dark:text-sage-100',
      border: 'border-forest',
      icon: <Award className="w-3 h-3 stroke-[2.2]" />,
    },
  };

  const config = configs[status] || configs.NotStarted;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};

