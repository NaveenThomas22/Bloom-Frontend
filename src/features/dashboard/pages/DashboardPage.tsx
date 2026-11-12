import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar as CalendarIcon,
  Clock,
  Hourglass,
  Layers,
  Target,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  FileCheck,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useGoalDashboard, useRevisionDashboard } from '@/features/goals/hooks/useGoals';
import { GoalProgressBar } from '@/features/goals/components/GoalProgressBar';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { data: goalDash } = useGoalDashboard('Daily');
  const { data: revDash } = useRevisionDashboard();

  const now = new Date();
  const currentHour = now.getHours();
  const greeting =
    currentHour < 12
      ? 'Good morning'
      : currentHour < 17
      ? 'Good afternoon'
      : 'Good evening';

  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const catTargetYear = user?.profile?.catTargetYear || 2026;
  const examDateStr = user?.profile?.catExamDate;

  let daysToExam: number | null = null;
  if (examDateStr) {
    const examDate = new Date(examDateStr);
    const diffTime = examDate.getTime() - now.getTime();
    if (diffTime > 0) {
      daysToExam = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  const dailyTargetMinutes = user?.preferences?.dailyStudyTargetMinutes || 360;
  const targetHours = (dailyTargetMinutes / 60).toFixed(1);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Top Welcome Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 to-mint/30 dark:from-dark-card dark:to-dark-surface/60 border-sage-200/80">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-sage-600 dark:text-dark-muted uppercase tracking-wider flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-forest dark:text-sage-300" />
              {dateFormatted}
            </span>
            <h1 className="font-serif text-2xl font-bold text-forest dark:text-sage-100">
              {greeting}, {user?.fullName?.split(' ')[0] || 'Aspirant'}
            </h1>
            <p className="text-xs text-sage-600 dark:text-dark-muted">
              Targeting CAT {catTargetYear} • Daily Benchmark: {targetHours} hrs
            </p>
          </div>

          <Badge variant="mint" className="shrink-0 font-medium text-xs">
            {user?.profile?.preparationLevel || 'Beginner'}
          </Badge>
        </div>

        {daysToExam !== null && (
          <div className="mt-4 pt-3 border-t border-sage-200/50 dark:border-dark-border flex items-center gap-2 text-xs text-forest dark:text-sage-200 font-medium">
            <Hourglass className="w-4 h-4 text-forest-light shrink-0" />
            <span>{daysToExam} days remaining until your target CAT examination</span>
          </div>
        )}
      </Card>

      {/* Quick Action Navigation Grid */}
      <div className="space-y-2">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-dark-muted pl-1">
          Quick Launch
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <NavLink to="/planner">
            <Card variant="interactive" className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-mint/50 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
                <Clock className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-sage-900 dark:text-sage-100">24h Timeline</h3>
                <p className="text-[10px] text-sage-500 dark:text-dark-muted">Life & Timer</p>
              </div>
            </Card>
          </NavLink>

          <NavLink to="/study">
            <Card variant="interactive" className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-sage-200/60 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
                <Layers className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-sage-900 dark:text-sage-100">CAT Syllabus</h3>
                <p className="text-[10px] text-sage-500 dark:text-dark-muted">QA, DILR & VARC</p>
              </div>
            </Card>
          </NavLink>

          <NavLink to="/goals">
            <Card variant="interactive" className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-forest/10 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
                <Target className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-sage-900 dark:text-sage-100">Targets & Goals</h3>
                <p className="text-[10px] text-sage-500 dark:text-dark-muted">Daily & Weekly</p>
              </div>
            </Card>
          </NavLink>

          <NavLink to="/revisions">
            <Card variant="interactive" className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-mint/60 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
                <RotateCcw className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-sage-900 dark:text-sage-100">Spaced Review</h3>
                <p className="text-[10px] text-sage-500 dark:text-dark-muted">
                  {revDash ? `${revDash.dueTodayCount} Due Today` : 'Active Cycles'}
                </p>
              </div>
            </Card>
          </NavLink>
          <NavLink to="/practice">
            <Card variant="interactive" className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-mint/50 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
                <BookOpen className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-sage-900 dark:text-sage-100">Practice Qs</h3>
                <p className="text-[10px] text-sage-500 dark:text-dark-muted">Topic & Custom</p>
              </div>
            </Card>
          </NavLink>

          <NavLink to="/exams">
            <Card variant="interactive" className="p-3.5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-forest/15 dark:bg-dark-surface flex items-center justify-center text-forest dark:text-sage-300 shrink-0">
                <FileCheck className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-sage-900 dark:text-sage-100">Mock Tests</h3>
                <p className="text-[10px] text-sage-500 dark:text-dark-muted">Full & Sectional</p>
              </div>
            </Card>
          </NavLink>
        </div>
      </div>

      {/* Spaced Repetition Due Today Banner */}
      {revDash && (revDash.dueTodayCount > 0 || revDash.overdueCount > 0) && (
        <Card className="p-4 border-sage-300/80 dark:border-dark-border bg-white dark:bg-dark-surface">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-forest text-ivory-100">
                <RotateCcw className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-forest dark:text-sage-100">
                Spaced Repetition Queue
              </h3>
            </div>
            <NavLink
              to="/revisions"
              className="text-xs font-semibold text-forest dark:text-sage-300 flex items-center gap-1 hover:underline"
            >
              Open Hub <ArrowRight className="w-3.5 h-3.5" />
            </NavLink>
          </div>

          <div className="flex items-center gap-3 text-xs text-sage-600 dark:text-dark-muted mt-2">
            <span className="flex items-center gap-1 text-forest dark:text-sage-200 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5 text-mint" />
              {revDash.dueTodayCount} Due Today
            </span>
            {revDash.overdueCount > 0 && (
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                <AlertCircle className="w-3.5 h-3.5" />
                {revDash.overdueCount} Overdue
              </span>
            )}
            <span className="text-sage-400">•</span>
            <span>{revDash.completedTotalCount} Total Completed</span>
          </div>
        </Card>
      )}

      {/* Daily Target Goals Live Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between pl-1">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-dark-muted">
            Today's Target Progress
          </h2>
          <NavLink
            to="/goals"
            className="text-[11px] font-semibold text-forest dark:text-sage-300 hover:underline flex items-center gap-1"
          >
            Manage Goals <ArrowRight className="w-3 h-3" />
          </NavLink>
        </div>

        {goalDash && goalDash.goals.length > 0 ? (
          <div className="space-y-2.5">
            {goalDash.goals.map((g) => (
              <Card key={g.id} className="p-3.5 bg-white dark:bg-dark-surface">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-serif font-semibold text-forest dark:text-sage-100 truncate">
                    {g.title}
                  </span>
                  <span className="font-sans font-medium text-sage-600 dark:text-sage-300">
                    {g.currentValue} / {g.targetValue} {g.unit}
                  </span>
                </div>
                <GoalProgressBar
                  progressPercentage={g.progressPercentage}
                  isAchieved={g.isAchieved}
                />
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-5 text-center bg-white/80 dark:bg-dark-surface">
            <Target className="w-6 h-6 text-sage-400 mx-auto mb-1.5" />
            <p className="text-xs text-sage-600 dark:text-sage-300 font-medium">
              No daily study targets defined yet today.
            </p>
            <NavLink
              to="/goals"
              className="mt-2.5 inline-flex items-center gap-1 text-xs font-semibold text-forest dark:text-sage-200 underline"
            >
              Set your first target
            </NavLink>
          </Card>
        )}
      </div>

      {/* Phase 8: Mindful Preparation & Personal Growth Ecosystem */}
      <div className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-sage-600 dark:text-dark-muted pl-1">
          Mindset, Habits & Reflection
        </h2>

        <div className="grid grid-cols-2 gap-3">
          <NavLink
            to="/reflections"
            className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border hover:border-amber-300 dark:hover:border-amber-500/40 shadow-soft-sm transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xs text-forest dark:text-sage-100 group-hover:text-amber-700 dark:group-hover:text-amber-300">
                Reflections
              </span>
            </div>
            <p className="text-[11px] text-sage-600 dark:text-dark-muted">
              Morning focus & evening debrief
            </p>
          </NavLink>

          <NavLink
            to="/journal"
            className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border hover:border-sage-400 dark:hover:border-sage-500/40 shadow-soft-sm transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-xl bg-mint/50 dark:bg-dark-bg text-forest dark:text-sage-300">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xs text-forest dark:text-sage-100 group-hover:text-forest-dark">
                Journal
              </span>
            </div>
            <p className="text-[11px] text-sage-600 dark:text-dark-muted">
              Thoughts, breakthroughs & notes
            </p>
          </NavLink>

          <NavLink
            to="/habits"
            className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border hover:border-emerald-300 dark:hover:border-emerald-500/40 shadow-soft-sm transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-xl bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xs text-forest dark:text-sage-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                Daily Habits
              </span>
            </div>
            <p className="text-[11px] text-sage-600 dark:text-dark-muted">
              Consistency & streak tracking
            </p>
          </NavLink>

          <NavLink
            to="/mindset"
            className="p-3.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border hover:border-indigo-300 dark:hover:border-indigo-500/40 shadow-soft-sm transition-all group active:scale-[0.98]"
          >
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1.5 rounded-xl bg-indigo-100/70 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                <Compass className="w-4 h-4" />
              </div>
              <span className="font-serif font-bold text-xs text-forest dark:text-sage-100 group-hover:text-indigo-700 dark:group-hover:text-indigo-300">
                Milestones
              </span>
            </div>
            <p className="text-[11px] text-sage-600 dark:text-dark-muted">
              Personal growth & sync live
            </p>
          </NavLink>
        </div>
      </div>
    </div>
  );
};
