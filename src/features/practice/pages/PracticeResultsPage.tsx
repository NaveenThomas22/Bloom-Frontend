import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { practiceApi } from '../api/practiceApi';
import { bookmarksApi } from '@/features/bookmarks/api/bookmarksApi';
import type { PracticeSession } from '@/types/practice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  BookOpen,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react';

export const PracticeResultsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = Number(id);

  const [session, setSession] = useState<PracticeSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQuestions, setExpandedQuestions] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadResults();
  }, [sessionId]);

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const data = await practiceApi.getSessionById(sessionId);
      setSession(data);
      // Auto-expand all questions by default for quick review
      const expanded: Record<number, boolean> = {};
      data.questions.forEach((q) => {
        expanded[q.id] = true;
      });
      setExpandedQuestions(expanded);
    } catch (err) {
      console.error('Failed to load practice results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (qId: number) => {
    setExpandedQuestions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const toggleBookmark = async (questionId: number, isCurrentlyBookmarked: boolean) => {
    if (!session) return;
    try {
      if (isCurrentlyBookmarked) {
        await bookmarksApi.removeBookmark(questionId);
      } else {
        await bookmarksApi.addBookmark(questionId);
      }
      setSession({
        ...session,
        questions: session.questions.map((q) =>
          q.questionId === questionId
            ? { ...q, question: { ...q.question, isBookmarked: !isCurrentlyBookmarked } }
            : q
        ),
      });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  if (isLoading || !session) {
    return (
      <div className="py-24 text-center font-serif text-sage-600 dark:text-sage-400">
        Compiling practice performance...
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
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-300">
              <Award className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
              Practice Session Summary
            </h1>
          </div>
          <p className="text-xs text-sage-600 dark:text-sage-400 mt-0.5">
            {session.title} — Completed on {new Date(session.completedAtUtc || '').toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/practice')}
            className="text-xs h-9"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            New Practice
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/questions')}
            className="text-xs h-9 bg-forest hover:bg-forest-dark text-ivory"
          >
            <BookOpen className="w-3.5 h-3.5 mr-1.5" />
            Question Bank
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Score */}
        <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-1">
          <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Total Score
          </span>
          <div className="text-2xl font-serif font-bold text-forest dark:text-mint">
            {session.score}
          </div>
          <span className="text-[10px] text-sage-400">
            Out of {session.totalQuestions * 3} max
          </span>
        </div>

        {/* Accuracy */}
        <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-1">
          <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Accuracy
          </span>
          <div className="text-2xl font-serif font-bold text-sage-900 dark:text-sage-100">
            {session.accuracyPercentage}%
          </div>
          <span className="text-[10px] text-sage-400">
            {session.correctAnswers} of {session.attemptedQuestions} attempted
          </span>
        </div>

        {/* Breakdown */}
        <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-1">
          <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Breakdown
          </span>
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs font-bold text-forest flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> {session.correctAnswers}
            </span>
            <span className="text-xs font-bold text-rose-dark flex items-center gap-1">
              <XCircle className="w-3.5 h-3.5" /> {session.incorrectAnswers}
            </span>
            <span className="text-xs font-bold text-sage-400 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> {session.unansweredQuestions}
            </span>
          </div>
          <span className="text-[10px] text-sage-400">Correct / Wrong / Skipped</span>
        </div>

        {/* Time Spent */}
        <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-1">
          <span className="text-[11px] font-semibold text-sage-500 uppercase tracking-wider">
            Time Spent
          </span>
          <div className="text-2xl font-serif font-bold text-sage-900 dark:text-sage-100 flex items-center gap-1">
            <Clock className="w-4 h-4 text-sage-400" />
            {formatSeconds(session.timeSpentSeconds)}
          </div>
          <span className="text-[10px] text-sage-400">
            ~{Math.round(session.timeSpentSeconds / Math.max(1, session.totalQuestions))}s / question
          </span>
        </div>
      </div>

      {/* Question Analysis List */}
      <div className="space-y-4">
        <h2 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
          Question-by-Question Analysis
        </h2>

        {session.questions.map((q, idx) => {
          const isExpanded = expandedQuestions[q.id];
          const isCorrect = q.isCorrect === true;
          const isWrong = q.isAnswered && q.isCorrect === false;
          const isSkipped = !q.isAnswered;

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all ${
                isCorrect
                  ? 'border-mint/60 bg-mint/5 dark:bg-mint/5 dark:border-mint/20'
                  : isWrong
                  ? 'border-rose/40 bg-rose/5 dark:bg-rose/5 dark:border-rose/20'
                  : 'border-sage-200/60 bg-white dark:bg-dark-card dark:border-dark-border'
              }`}
            >
              {/* Question summary header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-sage-500">Q{idx + 1}</span>

                  {isCorrect && (
                    <Badge variant="forest" className="text-[10px]">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> Correct (+{q.question.defaultMarks})
                    </Badge>
                  )}
                  {isWrong && (
                    <Badge variant="rose" className="text-[10px]">
                      <XCircle className="w-3 h-3 mr-1" /> Incorrect (-{q.question.defaultPenalty})
                    </Badge>
                  )}
                  {isSkipped && (
                    <Badge variant="sage" className="text-[10px]">
                      Skipped (0)
                    </Badge>
                  )}

                  <span className="text-[10px] text-sage-500">
                    Time: {q.timeSpentSeconds}s
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => toggleBookmark(q.questionId, !!q.question.isBookmarked)}
                    className="p-1 text-sage-400 hover:text-forest transition-colors"
                    title="Bookmark"
                  >
                    {q.question.isBookmarked ? (
                      <BookmarkCheck className="w-4 h-4 text-forest dark:text-mint fill-current" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    onClick={() => toggleExpand(q.id)}
                    className="p-1 text-sage-400 hover:text-sage-700"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4 pt-3 border-t border-sage-100 dark:border-dark-border text-xs">
                  {/* Passage preview if any */}
                  {q.question.passage && (
                    <div className="p-3 rounded-xl bg-ivory-100/60 dark:bg-dark-surface/60 border border-sage-200/40 space-y-1">
                      <div className="flex items-center gap-1 font-semibold text-sage-800 dark:text-sage-200">
                        <FileText className="w-3.5 h-3.5 text-forest" />
                        Passage: {q.question.passage.title}
                      </div>
                      <p className="text-sage-600 dark:text-sage-400 line-clamp-3 italic">
                        {q.question.passage.content}
                      </p>
                    </div>
                  )}

                  {/* Question Content */}
                  <div className="text-xs sm:text-sm text-sage-950 dark:text-sage-100 font-sans leading-relaxed whitespace-pre-wrap">
                    {q.question.questionContent}
                  </div>

                  {/* MCQ Options with correct answer highlighted */}
                  {q.question.questionType === 'MCQ' && (
                    <div className="space-y-2 pt-1">
                      {q.question.options.map((opt) => {
                        const isUserAnswer = q.userAnswer === opt.optionKey;
                        const isCorrectAnswer =
                          opt.isCorrect ||
                          opt.optionKey === q.question.correctAnswer;

                        return (
                          <div
                            key={opt.optionKey}
                            className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                              isCorrectAnswer
                                ? 'border-forest bg-mint/30 dark:bg-mint/10 dark:border-mint font-semibold'
                                : isUserAnswer && !isCorrectAnswer
                                ? 'border-rose/50 bg-rose/10 dark:bg-rose/10 dark:border-rose/40'
                                : 'border-sage-200/50 dark:border-dark-border bg-ivory-50/40 dark:bg-dark-surface'
                            }`}
                          >
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                                isCorrectAnswer
                                  ? 'bg-forest text-ivory'
                                  : isUserAnswer
                                  ? 'bg-rose text-rose-dark'
                                  : 'bg-sage-200 text-sage-700'
                              }`}
                            >
                              {opt.optionKey}
                            </span>
                            <span className="text-sage-900 dark:text-sage-100">{opt.content}</span>
                            {isCorrectAnswer && (
                              <span className="ml-auto text-[10px] text-forest dark:text-mint font-bold uppercase tracking-wider">
                                Correct Answer
                              </span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="ml-auto text-[10px] text-rose-dark font-bold uppercase tracking-wider">
                                Your Choice
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* TITA Answer details */}
                  {q.question.questionType === 'TITA' && (
                    <div className="p-3 rounded-xl bg-ivory-100 dark:bg-dark-surface border border-sage-200 flex flex-wrap gap-4 items-center">
                      <div>
                        <span className="text-[11px] text-sage-500 block">Your Answer:</span>
                        <span
                          className={`font-mono font-bold text-sm ${
                            isCorrect ? 'text-forest' : 'text-rose-dark'
                          }`}
                        >
                          {q.userAnswer || 'Skipped'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[11px] text-sage-500 block">Correct Answer:</span>
                        <span className="font-mono font-bold text-sm text-forest dark:text-mint">
                          {q.question.correctAnswer}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Explanation & Solution Steps */}
                  {(q.question.explanation || q.question.solutionSteps) && (
                    <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border space-y-2 mt-2">
                      <div className="font-serif font-bold text-xs text-forest dark:text-mint">
                        Explanation & Solution:
                      </div>
                      {q.question.explanation && (
                        <p className="text-xs text-sage-700 dark:text-sage-300 leading-relaxed whitespace-pre-wrap">
                          {q.question.explanation}
                        </p>
                      )}
                      {q.question.solutionSteps && (
                        <div className="pt-2 border-t border-sage-100 dark:border-dark-border text-xs text-sage-600 dark:text-sage-400 leading-relaxed font-mono whitespace-pre-wrap">
                          {q.question.solutionSteps}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
