import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examsApi } from '../api/examsApi';
import type { ExamResult } from '@/types/exams';
import { Button } from '@/components/ui/Button';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

export const ExamResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const attemptId = Number(id);

  const [result, setResult] = useState<ExamResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [attemptId]);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const data = await examsApi.getResults(attemptId);
      setResult(data);
    } catch (err) {
      console.error('Failed to load exam results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !result) {
    return (
      <div className="py-24 text-center font-serif text-sage-600 dark:text-sage-400">
        Calculating percentile and exam scorecard...
      </div>
    );
  }

  const formatSeconds = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-300">
              <Award className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
              Examination Scorecard
            </h1>
          </div>
          <p className="text-xs text-sage-600 dark:text-sage-400 mt-0.5">
            {result.templateTitle} — Submitted on {new Date(result.submittedAtUtc).toLocaleString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate(`/exams/${attemptId}/review`)}
            className="text-xs h-9 bg-forest hover:bg-forest-dark text-ivory font-semibold"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Detailed Question Review
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/exams')}
            className="text-xs h-9"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Exam Catalog
          </Button>
        </div>
      </div>

      {/* Main Scorecard Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Score */}
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-1">
          <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Total Score
          </span>
          <div className="text-3xl font-serif font-bold text-forest dark:text-mint">
            {result.totalScore}
          </div>
          <span className="text-[10px] text-sage-400">
            Out of {result.maxPossibleScore} max marks
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-1">
          <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Accuracy
          </span>
          <div className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100">
            {result.accuracyPercentage}%
          </div>
          <span className="text-[10px] text-sage-400">
            {result.totalCorrect} correct of {result.totalAttempted} attempted
          </span>
        </div>

        {/* Question Split */}
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-1">
          <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Attempt Split
          </span>
          <div className="flex items-center gap-2 pt-1 text-sm font-bold">
            <span className="text-forest flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> {result.totalCorrect}
            </span>
            <span className="text-rose-dark flex items-center gap-1">
              <XCircle className="w-4 h-4" /> {result.totalIncorrect}
            </span>
            <span className="text-sage-400 flex items-center gap-1">
              <HelpCircle className="w-4 h-4" /> {result.totalUnanswered}
            </span>
          </div>
          <span className="text-[10px] text-sage-400">Correct / Incorrect / Skipped</span>
        </div>

        {/* Total Time */}
        <div className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-1">
          <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Total Time Spent
          </span>
          <div className="text-3xl font-serif font-bold text-sage-900 dark:text-sage-100 flex items-center gap-1.5">
            <Clock className="w-5 h-5 text-sage-400" />
            {formatSeconds(result.timeSpentSeconds)}
          </div>
          <span className="text-[10px] text-sage-400">
            Across {result.sectionResults.length} sections
          </span>
        </div>
      </div>

      {/* Section-by-Section Score Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-forest" />
          <h2 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
            Sectional Performance
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {result.sectionResults.map((sec) => (
            <div
              key={sec.sectionId}
              className="p-5 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-sage-100 dark:border-dark-border">
                <h3 className="font-serif text-sm font-bold text-sage-900 dark:text-sage-100">
                  {sec.sectionName}
                </h3>
                <span className="text-xs font-mono font-bold text-forest dark:text-mint">
                  Score: {sec.score} / {sec.maxScore}
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-sage-600 dark:text-sage-400">
                  <span>Questions Attempted:</span>
                  <span className="font-semibold text-sage-800 dark:text-sage-200">
                    {sec.attempted} / {sec.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between text-sage-600 dark:text-sage-400">
                  <span>Correct / Incorrect:</span>
                  <span className="font-semibold text-sage-800 dark:text-sage-200">
                    <span className="text-forest font-bold">{sec.correct}</span> /{' '}
                    <span className="text-rose-dark font-bold">{sec.incorrect}</span>
                  </span>
                </div>
                <div className="flex justify-between text-sage-600 dark:text-sage-400">
                  <span>Accuracy:</span>
                  <span className="font-semibold text-forest dark:text-mint">
                    {sec.accuracyPercentage}%
                  </span>
                </div>
                <div className="flex justify-between text-sage-600 dark:text-sage-400">
                  <span>Time Spent:</span>
                  <span className="font-mono text-sage-800 dark:text-sage-200">
                    {formatSeconds(sec.timeSpentSeconds)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Review CTA Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-mint/30 to-sage-100/50 dark:from-dark-surface dark:to-dark-card border border-mint/40 dark:border-dark-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif text-base font-bold text-sage-950 dark:text-sage-100">
            Ready to review each question?
          </h3>
          <p className="text-xs text-sage-600 dark:text-sage-400">
            Analyze every mistake, step-by-step solutions, and author explanations for QA, DILR & VARC.
          </p>
        </div>

        <Button
          size="sm"
          onClick={() => navigate(`/exams/${attemptId}/review`)}
          className="text-xs h-10 px-6 bg-forest hover:bg-forest-dark text-ivory font-semibold whitespace-nowrap"
        >
          Review All Solutions <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>
    </div>
  );
};
