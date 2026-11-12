import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examsApi } from '../api/examsApi';
import type { ExamTemplate, ActiveExamAttempt, ExamAttemptSummary } from '@/types/exams';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileCheck,
  Clock,
  Play,
  AlertTriangle,
  History,
  Layers,
  ArrowRight,
} from 'lucide-react';

export const ExamListPage: React.FC = () => {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState<ExamTemplate[]>([]);
  const [activeAttempt, setActiveAttempt] = useState<ActiveExamAttempt | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<ExamAttemptSummary[]>([]);
  const [startingTemplateId, setStartingTemplateId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tList, active, recents] = await Promise.all([
        examsApi.getTemplates(),
        examsApi.getActiveAttempt().catch(() => null),
        examsApi.getRecentAttempts().catch(() => []),
      ]);
      setTemplates(tList);
      setActiveAttempt(active);
      setRecentAttempts(recents);
    } catch (err) {
      console.error('Failed to load exam templates:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExam = async (templateId: number) => {
    if (activeAttempt) {
      if (
        !window.confirm(
          'You already have an active exam attempt in progress. Would you like to resume it now?'
        )
      ) {
        return;
      }
      navigate(`/exams/${activeAttempt.id}/workspace`);
      return;
    }

    setStartingTemplateId(templateId);
    try {
      const attempt = await examsApi.startAttempt(templateId);
      navigate(`/exams/${attempt.id}/workspace`);
    } catch (err: any) {
      console.error('Failed to start exam:', err);
      alert(err.response?.data?.message || 'Could not start exam attempt.');
    } finally {
      setStartingTemplateId(null);
    }
  };

  const fullMocks = templates.filter((t) => t.examType === 'FullMock');
  const sectionalMocks = templates.filter((t) => t.examType === 'SectionalMock');

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-300">
              <FileCheck className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
              CAT Mock Test Engine
            </h1>
          </div>
          <p className="text-xs text-sage-600 dark:text-sage-400 mt-0.5">
            Full-length simulations & sectional test series with authentic CAT CBT interface
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/practice')}
          className="text-xs h-9"
        >
          Untimed Practice Mode <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>

      {/* Active Exam Banner */}
      {activeAttempt && (
        <div className="p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-300 dark:border-amber-800 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-200/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-950 dark:text-amber-100">
                  Active Examination In Progress
                </span>
                <span className="animate-pulse w-2 h-2 rounded-full bg-amber-500" />
              </div>
              <p className="text-xs text-amber-800 dark:text-amber-300">
                {activeAttempt.templateTitle} — Section: {activeAttempt.currentSectionName}
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-400">
                Server timer is running. Resume immediately to avoid timeout.
              </p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => navigate(`/exams/${activeAttempt.id}/workspace`)}
            className="text-xs h-9 bg-amber-600 hover:bg-amber-700 text-white font-semibold whitespace-nowrap"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            Resume Examination
          </Button>
        </div>
      )}

      {/* Full-Length Mocks */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-forest dark:text-mint" />
          <h2 className="font-serif text-base font-bold text-sage-950 dark:text-sage-100">
            Full-Length CAT Mock Examinations
          </h2>
        </div>

        {isLoading ? (
          <div className="h-36 rounded-3xl bg-sage-200/40 dark:bg-dark-surface animate-pulse" />
        ) : fullMocks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-sage-200 text-xs text-sage-500 text-center">
            No full mocks available yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fullMocks.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-4 hover:border-forest/50 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="font-serif text-sm font-bold text-sage-950 dark:text-sage-100">
                      {t.title}
                    </h3>
                    <p className="text-xs text-sage-600 dark:text-sage-400">
                      {t.description || 'Comprehensive 3-section CAT paper'}
                    </p>
                  </div>
                  <Badge variant="forest" className="text-[10px]">
                    Full Mock
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-sage-600 dark:text-sage-400 pt-1">
                  <span className="flex items-center gap-1 font-mono font-medium">
                    <Clock className="w-3.5 h-3.5 text-sage-400" />
                    {t.totalDurationMinutes} mins
                  </span>
                  <span>•</span>
                  <span>{t.totalQuestions} Questions</span>
                  <span>•</span>
                  <span>{t.totalMarks} Marks</span>
                </div>

                {/* Section breakdown pill row */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {t.sections.map((s) => (
                    <span
                      key={s.id}
                      className="px-2.5 py-1 rounded-xl bg-ivory-100 dark:bg-dark-surface border border-sage-200/50 text-[10px] font-medium text-sage-800 dark:text-sage-200"
                    >
                      {s.sectionName} ({s.durationMinutes}m)
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-sage-100 dark:border-dark-border">
                  <Button
                    size="sm"
                    disabled={startingTemplateId === t.id}
                    onClick={() => handleStartExam(t.id)}
                    className="w-full text-xs h-9 bg-forest hover:bg-forest-dark text-ivory font-semibold"
                  >
                    <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                    {startingTemplateId === t.id ? 'Initializing Test...' : 'Start Full Mock'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sectional Mocks */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-forest dark:text-mint" />
          <h2 className="font-serif text-base font-bold text-sage-950 dark:text-sage-100">
            Sectional Practice Mocks
          </h2>
        </div>

        {sectionalMocks.length === 0 ? (
          <div className="p-6 rounded-2xl bg-white dark:bg-dark-card border border-sage-200 text-xs text-sage-500 text-center">
            No sectional mocks available.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {sectionalMocks.map((t) => (
              <div
                key={t.id}
                className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3 hover:border-forest/50 transition-all"
              >
                <div className="space-y-1">
                  <Badge variant="mint" className="text-[10px]">
                    Sectional
                  </Badge>
                  <h3 className="font-serif text-sm font-bold text-sage-950 dark:text-sage-100">
                    {t.title}
                  </h3>
                  <p className="text-[11px] text-sage-500 line-clamp-2">
                    {t.description || 'Targeted 40-minute sectional sprint'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-sage-600 dark:text-sage-400 font-medium">
                  <span>{t.totalDurationMinutes} mins</span>
                  <span>{t.totalQuestions} Questions</span>
                  <span>{t.totalMarks} Marks</span>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  disabled={startingTemplateId === t.id}
                  onClick={() => handleStartExam(t.id)}
                  className="w-full text-xs h-8"
                >
                  <Play className="w-3 h-3 mr-1 fill-current" />
                  Start Sectional
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Past Attempts History */}
      {recentAttempts.length > 0 && (
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sage-500" />
            <h2 className="font-serif text-base font-bold text-sage-950 dark:text-sage-100">
              Exam History & Performance
            </h2>
          </div>

          <div className="space-y-2">
            {recentAttempts.map((att) => (
              <div
                key={att.id}
                onClick={() =>
                  navigate(
                    att.status === 'Submitted' || att.status === 'AutoSubmitted'
                      ? `/exams/${att.id}/results`
                      : `/exams/${att.id}/workspace`
                  )
                }
                className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border hover:border-forest/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sage-900 dark:text-sage-100">
                      {att.templateTitle}
                    </span>
                    <Badge
                      variant={att.status === 'Submitted' ? 'mint' : 'sage'}
                      className="text-[10px]"
                    >
                      {att.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-sage-500">
                    <span>{new Date(att.startedAtUtc).toLocaleDateString()}</span>
                    <span>•</span>
                    <span>
                      Score: <b className="text-forest dark:text-mint">{att.totalScore}</b> /{' '}
                      {att.maxPossibleScore}
                    </span>
                    <span>•</span>
                    <span>Accuracy: {att.accuracyPercentage}%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-forest dark:text-sage-300 font-medium">
                  {att.status === 'Submitted' || att.status === 'AutoSubmitted'
                    ? 'View Scorecard & Review'
                    : 'Resume Test'}
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
