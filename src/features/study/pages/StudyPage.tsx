import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSyllabusOverview } from '@/features/syllabus/hooks/useSyllabus';
import { SubjectCard } from '@/features/syllabus/components/SubjectCard';
import { ProgressBar } from '@/features/syllabus/components/ProgressBar';
import { CustomItemModal } from '@/features/syllabus/components/CustomItemModal';
import { StartTimerModal } from '@/features/activities/components/StartTimerModal';
import { Button } from '@/components/ui/Button';
import { BookOpen, Sparkles, Clock, AlertCircle, Plus, SlidersHorizontal, CheckCircle2, Play } from 'lucide-react';

export const StudyPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: overview, isLoading, error, refetch } = useSyllabusOverview();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTimerModalOpen, setIsTimerModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 text-left animate-in fade-in duration-300">
        <div className="h-8 bg-sage-200/50 dark:bg-dark-surface rounded-xl w-48 animate-pulse" />
        <div className="h-36 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-44 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
          <div className="h-44 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
          <div className="h-44 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !overview) {
    return (
      <div className="p-8 rounded-3xl bg-rose/20 border border-rose/40 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-dark mx-auto" />
        <h3 className="font-serif text-lg font-bold text-rose-dark">
          Unable to Load Syllabus
        </h3>
        <p className="text-xs text-sage-600 dark:text-sage-400">
          We could not connect to your syllabus data. Please try again.
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Header */}
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-300">
              <BookOpen className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
              CAT Syllabus & Progress
            </h1>
          </div>
          <p className="text-xs text-sage-600 dark:text-sage-400">
            Authoritative syllabus tree and mastery tracking across QA, DILR & VARC
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 sm:flex-wrap">
          <Button
            size="sm"
            onClick={() => setIsTimerModalOpen(true)}
            className="text-xs h-9 bg-forest hover:bg-forest-dark text-ivory shrink-0 shadow-soft"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            Timer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/practice')}
            className="text-xs h-9 shrink-0 bg-white/80 dark:bg-dark-card/60"
          >
            Practice
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/exams')}
            className="text-xs h-9 shrink-0 bg-white/80 dark:bg-dark-card/60"
          >
            Mock Tests
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/study/manage')}
            className="text-xs h-9 shrink-0 bg-white/80 dark:bg-dark-card/60"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5" />
            Manage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs h-9 shrink-0 bg-white/80 dark:bg-dark-card/60"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Custom
          </Button>
        </div>
      </div>

      {/* Progress Sanctuary Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-white/95 to-sage-50/70 dark:from-dark-card dark:to-dark-surface/90 border border-sage-200/80 dark:border-dark-border shadow-soft space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest dark:text-sage-300">
              Overall Preparation Sanctuary
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl sm:text-4xl font-bold text-sage-950 dark:text-sage-100 tabular-nums">
                {Math.round(overview.overallProgressPercentage)}%
              </span>
              <span className="text-xs text-sage-600 dark:text-sage-400">
                Syllabus Completed
              </span>
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <span className="text-[11px] text-sage-500 dark:text-sage-400">
              Estimated Remaining
            </span>
            <div className="flex items-center justify-end gap-1 text-sm font-semibold text-sage-800 dark:text-sage-200">
              <Clock className="w-3.5 h-3.5 text-sage-500" />
              <span>{overview.estimatedRemainingHours} hrs</span>
            </div>
          </div>
        </div>

        <ProgressBar
          progress={overview.overallProgressPercentage}
          showPercentage={false}
          size="lg"
        />

        {/* Quick Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-sage-100 dark:border-dark-border/60 text-xs">
          <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-dark-card/60 border border-sage-200/40 dark:border-dark-border">
            <div className="flex items-center gap-1.5 text-forest dark:text-sage-300">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="font-semibold">{overview.completedTopics + overview.masteredTopics}</span>
            </div>
            <span className="text-[11px] text-sage-600 dark:text-sage-400">Completed / Mastered</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-dark-card/60 border border-sage-200/40 dark:border-dark-border">
            <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold">{overview.inProgressTopics}</span>
            </div>
            <span className="text-[11px] text-sage-600 dark:text-sage-400">In Progress</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-dark-card/60 border border-sage-200/40 dark:border-dark-border">
            <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-3.5 h-3.5" />
              <span className="font-semibold">{overview.revisionDueTopics}</span>
            </div>
            <span className="text-[11px] text-sage-600 dark:text-sage-400">Revision Due</span>
          </div>

          <div className="p-2.5 rounded-2xl bg-white/70 dark:bg-dark-card/60 border border-sage-200/40 dark:border-dark-border">
            <div className="flex items-center gap-1.5 text-sage-700 dark:text-sage-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span className="font-semibold">{overview.totalTopics}</span>
            </div>
            <span className="text-[11px] text-sage-600 dark:text-sage-400">Total CAT Topics</span>
          </div>
        </div>
      </div>

      {/* Subjects Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
            Syllabus Subjects
          </h2>
          <span className="text-xs text-sage-500">
            {overview.subjects.length} Subjects
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {overview.subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </div>

      {/* Custom Item Modal */}
      <CustomItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjects={overview.subjects}
      />

      {/* Study Timer Modal */}
      <StartTimerModal
        isOpen={isTimerModalOpen}
        onClose={() => setIsTimerModalOpen(false)}
      />
    </div>
  );
};
