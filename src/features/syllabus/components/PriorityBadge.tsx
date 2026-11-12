import React from 'react';
import type { TopicPriority } from '@/types/syllabus';
import { ArrowUp, ArrowRight, ArrowDown, Flame } from 'lucide-react';

export interface PriorityBadgeProps {
  priority: TopicPriority;
  className?: string;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, className = '' }) => {
  const configs: Record<
    TopicPriority,
    { label: string; bg: string; text: string; border: string; icon: React.ReactNode }
  > = {
    Low: {
      label: 'Low',
      bg: 'bg-sage-100/70 dark:bg-dark-surface',
      text: 'text-sage-700 dark:text-sage-400',
      border: 'border-sage-200 dark:border-dark-border',
      icon: <ArrowDown className="w-3 h-3 stroke-[2.2]" />,
    },
    Medium: {
      label: 'Medium',
      bg: 'bg-mint/30 dark:bg-mint/15',
      text: 'text-forest dark:text-sage-300',
      border: 'border-mint/50 dark:border-mint/30',
      icon: <ArrowRight className="w-3 h-3 stroke-[2.2]" />,
    },
    High: {
      label: 'High',
      bg: 'bg-beige/70 dark:bg-beige/25',
      text: 'text-sage-900 dark:text-beige',
      border: 'border-beige-dark/50 dark:border-beige/40',
      icon: <ArrowUp className="w-3 h-3 stroke-[2.2]" />,
    },
    Urgent: {
      label: 'Urgent',
      bg: 'bg-rose/50 dark:bg-rose-dark/25',
      text: 'text-rose-dark dark:text-rose',
      border: 'border-rose/70 dark:border-rose-dark/50',
      icon: <Flame className="w-3 h-3 stroke-[2.2]" />,
    },
  };

  const config = configs[priority] || configs.Medium;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border ${config.bg} ${config.text} ${config.border} ${className}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

