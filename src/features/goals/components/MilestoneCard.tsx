import React, { useState } from 'react';
import { Calendar, CheckCircle2, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import type { PreparationMilestone } from '@/types/goals';

interface MilestoneCardProps {
  milestone: PreparationMilestone;
  onToggleComplete: (milestone: PreparationMilestone) => void;
  onEdit: (milestone: PreparationMilestone) => void;
  onDelete: (id: number) => void;
}

export const MilestoneCard: React.FC<MilestoneCardProps> = ({
  milestone,
  onToggleComplete,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isCompleted = milestone.status === 'Completed';
  const isOverdue = milestone.status === 'Overdue';

  const priorityColor = {
    Urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
    High: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    Medium: 'bg-sage-100 text-forest dark:bg-dark-card dark:text-sage-200',
    Low: 'bg-ivory-300 text-sage-600 dark:bg-dark-surface dark:text-dark-muted',
  }[milestone.priority];

  return (
    <div
      className={`relative rounded-2xl border p-4 transition-all ${
        isCompleted
          ? 'bg-sage-50/60 dark:bg-dark-surface/40 border-sage-200/40 dark:border-dark-border opacity-85'
          : isOverdue
          ? 'bg-rose-50/40 dark:bg-dark-surface border-rose-200 dark:border-rose-900/40 shadow-soft-sm'
          : 'bg-white dark:bg-dark-surface border-sage-200/60 dark:border-dark-border shadow-soft-sm hover:shadow-soft-md'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle Checkbox */}
        <button
          onClick={() => onToggleComplete(milestone)}
          className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${
            isCompleted
              ? 'bg-forest border-forest text-ivory-100 dark:bg-sage-600 dark:border-sage-600'
              : 'border-sage-300 dark:border-dark-border hover:border-forest text-transparent'
          }`}
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${priorityColor}`}>
              {milestone.priority}
            </span>
            {milestone.subjectName && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-mint/50 dark:bg-dark-card text-forest dark:text-sage-200">
                {milestone.subjectName}
              </span>
            )}
            {isOverdue && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500 text-white">
                Overdue
              </span>
            )}
            {isCompleted && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-forest text-ivory-100 dark:bg-sage-600">
                Completed
              </span>
            )}
          </div>

          <h4
            className={`font-serif text-base font-semibold text-forest dark:text-sage-100 truncate ${
              isCompleted ? 'line-through text-sage-500 dark:text-dark-muted' : ''
            }`}
          >
            {milestone.title}
          </h4>

          {milestone.description && (
            <p className="text-xs text-sage-600 dark:text-dark-muted line-clamp-1 mt-0.5">
              {milestone.description}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-xs text-sage-500 dark:text-dark-muted mt-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Target: {milestone.targetDate}</span>
          </div>
        </div>

        {/* Action Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 rounded-lg text-sage-400 hover:text-forest dark:hover:text-sage-200 transition-colors"
            aria-label="Milestone options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-7 z-20 w-32 bg-white dark:bg-dark-card rounded-xl border border-sage-200/80 dark:border-dark-border shadow-soft-lg py-1">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(milestone);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-sage-700 dark:text-sage-300 hover:bg-sage-50 dark:hover:bg-dark-surface flex items-center gap-2"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (confirm('Are you sure you want to delete this milestone?')) {
                      onDelete(milestone.id);
                    }
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

