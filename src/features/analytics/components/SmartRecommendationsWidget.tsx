import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { SmartRecommendationDto } from '@/types/analytics';

interface RecommendationsProps {
  recommendations: SmartRecommendationDto[];
  isLoading: boolean;
}

export const SmartRecommendationsWidget: React.FC<RecommendationsProps> = ({ recommendations, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border text-xs text-sage-500 animate-pulse">
        Analyzing preparation patterns and generating smart recommendations...
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  const getPriorityStyle = (priority: SmartRecommendationDto['priority']) => {
    switch (priority) {
      case 'Critical':
        return {
          border: 'border-rose-300 dark:border-rose-900/60',
          bg: 'bg-rose-50/70 dark:bg-rose-950/20',
          badge: 'bg-rose-100 dark:bg-rose-900/60 text-rose-dark',
          icon: <AlertTriangle className="w-4 h-4 text-rose-dark shrink-0" />,
        };
      case 'Important':
        return {
          border: 'border-amber-300 dark:border-amber-900/60',
          bg: 'bg-amber-50/60 dark:bg-amber-950/20',
          badge: 'bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200',
          icon: <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
        };
      default:
        return {
          border: 'border-sage-200 dark:border-dark-border',
          bg: 'bg-sage-50/70 dark:bg-dark-surface/60',
          badge: 'bg-sage-200/70 dark:bg-dark-border text-forest dark:text-sage-300',
          icon: <CheckCircle2 className="w-4 h-4 text-forest dark:text-sage-300 shrink-0" />,
        };
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-forest dark:text-sage-300" />
        <h3 className="font-serif font-bold text-sm text-sage-950 dark:text-sage-100">
          Smart Preparation Recommendations & Next Actions
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommendations.map((rec) => {
          const style = getPriorityStyle(rec.priority);
          return (
            <div
              key={rec.id}
              className={`p-3.5 rounded-2xl border ${style.border} ${style.bg} backdrop-blur-sm shadow-soft-sm flex flex-col justify-between space-y-3`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {style.icon}
                    <span className="font-serif font-bold text-xs text-sage-950 dark:text-sage-100">
                      {rec.title}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${style.badge}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-sage-700 dark:text-dark-muted leading-relaxed">
                  {rec.message}
                </p>
              </div>

              {rec.actionUrl && (
                <div className="pt-2 border-t border-sage-200/40 dark:border-dark-border flex justify-end">
                  <Link
                    to={rec.actionUrl}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-forest hover:bg-forest-light text-white text-xs font-semibold shadow-soft-sm transition-all"
                  >
                    <span>{rec.actionLabel || 'Take Action'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
