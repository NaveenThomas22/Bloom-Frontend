import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { practiceApi } from '../api/practiceApi';
import { bookmarksApi } from '@/features/bookmarks/api/bookmarksApi';
import type { PracticeSession, PracticeQuestionItem } from '@/types/practice';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronLeft,
  ChevronRight,
  Flag,
  FileText,
} from 'lucide-react';

export const PracticeWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const sessionId = Number(id);

  const [session, setSession] = useState<PracticeSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'saved' | 'saving' | 'idle'>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Time spent per question tracking
  const questionStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    setIsLoading(true);
    try {
      const data = await practiceApi.getSessionById(sessionId);
      if (data.status === 'Completed') {
        navigate(`/practice/results/${sessionId}`, { replace: true });
        return;
      }
      setSession(data);
      setElapsedSeconds(data.timeSpentSeconds || 0);
    } catch (err) {
      console.error('Failed to load practice session:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentItem: PracticeQuestionItem | undefined = session?.questions[currentIndex];

  const handleSelectAnswer = async (answer: string) => {
    if (!session || !currentItem) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    questionStartTimeRef.current = Date.now();

    // Optimistic UI update
    const updatedQuestions = [...session.questions];
    updatedQuestions[currentIndex] = {
      ...currentItem,
      userAnswer: answer,
      isAnswered: true,
      timeSpentSeconds: currentItem.timeSpentSeconds + timeSpent,
    };
    setSession({ ...session, questions: updatedQuestions });

    // Autosave to server
    setAutosaveStatus('saving');
    try {
      await practiceApi.saveAnswer(session.id, {
        questionId: currentItem.questionId,
        userAnswer: answer,
        isMarkedForReview: currentItem.isMarkedForReview,
        timeSpentSeconds: timeSpent,
      });
      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to autosave answer:', err);
      setAutosaveStatus('idle');
    }
  };

  const handleClearAnswer = async () => {
    if (!session || !currentItem) return;

    const updatedQuestions = [...session.questions];
    updatedQuestions[currentIndex] = {
      ...currentItem,
      userAnswer: undefined,
      isAnswered: false,
    };
    setSession({ ...session, questions: updatedQuestions });

    setAutosaveStatus('saving');
    try {
      await practiceApi.saveAnswer(session.id, {
        questionId: currentItem.questionId,
        userAnswer: undefined,
        isMarkedForReview: currentItem.isMarkedForReview,
        timeSpentSeconds: 0,
      });
      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to clear answer:', err);
      setAutosaveStatus('idle');
    }
  };

  const handleToggleMarkReview = async () => {
    if (!session || !currentItem) return;

    const nextMark = !currentItem.isMarkedForReview;
    const updatedQuestions = [...session.questions];
    updatedQuestions[currentIndex] = {
      ...currentItem,
      isMarkedForReview: nextMark,
    };
    setSession({ ...session, questions: updatedQuestions });

    setAutosaveStatus('saving');
    try {
      await practiceApi.saveAnswer(session.id, {
        questionId: currentItem.questionId,
        userAnswer: currentItem.userAnswer,
        isMarkedForReview: nextMark,
        timeSpentSeconds: 0,
      });
      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to toggle mark for review:', err);
    }
  };

  const handleToggleBookmark = async () => {
    if (!currentItem) return;
    try {
      if (currentItem.question.isBookmarked) {
        await bookmarksApi.removeBookmark(currentItem.questionId);
        currentItem.question.isBookmarked = false;
      } else {
        await bookmarksApi.addBookmark(currentItem.questionId);
        currentItem.question.isBookmarked = true;
      }
      setSession({ ...session! });
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const handleSubmitSession = async () => {
    if (!window.confirm('Are you sure you want to complete this practice session and view your results?')) {
      return;
    }

    setIsSubmitting(true);
    try {
      await practiceApi.submitSession(sessionId);
      navigate(`/practice/results/${sessionId}`, { replace: true });
    } catch (err) {
      console.error('Failed to submit session:', err);
      alert('Could not submit practice session. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading || !session || !currentItem) {
    return (
      <div className="py-24 text-center font-serif text-sage-600 dark:text-sage-400">
        Loading practice workspace...
      </div>
    );
  }

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4 text-left animate-in fade-in duration-300 pb-20">
      {/* Top Header */}
      <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="font-serif text-base font-bold text-sage-950 dark:text-sage-100">
              {session.title}
            </h1>
            <Badge variant="sage" className="text-[10px]">
              {currentItem.question.subjectName}
            </Badge>
          </div>
          <p className="text-[11px] text-sage-500">
            Question {currentIndex + 1} of {session.totalQuestions}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Autosave status indicator */}
          <span className="text-[11px] text-sage-400 font-medium">
            {autosaveStatus === 'saving' && 'Saving answer...'}
            {autosaveStatus === 'saved' && '✓ Saved'}
          </span>

          {/* Timer */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-ivory-100 dark:bg-dark-surface border border-sage-200/60 text-xs font-mono font-semibold text-sage-800 dark:text-sage-200">
            <Clock className="w-3.5 h-3.5 text-forest" />
            {formatTimer(elapsedSeconds)}
          </div>

          <Button
            size="sm"
            onClick={handleSubmitSession}
            disabled={isSubmitting}
            className="text-xs h-8 bg-forest hover:bg-forest-dark text-ivory font-semibold"
          >
            {isSubmitting ? 'Evaluating...' : 'Finish Practice'}
          </Button>
        </div>
      </div>

      {/* Question Palette Row */}
      <div className="p-3 rounded-xl bg-white/70 dark:bg-dark-card/70 border border-sage-200/50 flex flex-wrap gap-1.5 items-center">
        {session.questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => {
              questionStartTimeRef.current = Date.now();
              setCurrentIndex(i);
            }}
            className={`w-7 h-7 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
              i === currentIndex
                ? 'ring-2 ring-forest dark:ring-mint font-bold'
                : ''
            } ${
              q.isMarkedForReview
                ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300'
                : q.isAnswered
                ? 'bg-mint text-forest font-bold dark:bg-mint/30 dark:text-mint-light'
                : 'bg-sage-100 dark:bg-dark-surface text-sage-600'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Question Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* If passage or question set is present */}
        {(currentItem.question.passage || currentItem.question.questionSet) && (
          <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm max-h-[600px] overflow-y-auto space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-sage-100 dark:border-dark-border">
              <FileText className="w-4 h-4 text-forest" />
              <h3 className="font-serif text-xs font-bold text-sage-800 dark:text-sage-200">
                {currentItem.question.passage
                  ? `Reading Comprehension: ${currentItem.question.passage.title}`
                  : `Context Scenario: ${currentItem.question.questionSet?.title}`}
              </h3>
            </div>
            <div className="text-xs text-sage-800 dark:text-sage-200 leading-relaxed font-serif whitespace-pre-wrap">
              {currentItem.question.passage?.content ||
                currentItem.question.questionSet?.contextScenario}
            </div>
          </div>
        )}

        {/* Main Question Interaction Column */}
        <div
          className={`${
            currentItem.question.passage || currentItem.question.questionSet
              ? 'lg:col-span-7'
              : 'lg:col-span-12'
          } p-6 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-5`}
        >
          {/* Question Metadata bar */}
          <div className="flex items-center justify-between pb-3 border-b border-sage-100 dark:border-dark-border">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sage-500">Q{currentIndex + 1}</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-100 dark:bg-dark-surface text-sage-700 dark:text-sage-300 font-medium">
                {currentItem.question.difficultyLevel}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-100 dark:bg-dark-surface text-sage-700 dark:text-sage-300 font-medium">
                {currentItem.question.questionType}
              </span>
              <span className="text-[10px] text-sage-500">
                +{currentItem.question.defaultMarks} / -{currentItem.question.defaultPenalty} marks
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleBookmark}
                className="p-1.5 rounded-lg text-sage-400 hover:text-forest transition-colors"
                title="Bookmark"
              >
                {currentItem.question.isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-forest dark:text-mint fill-current" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={handleToggleMarkReview}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                  currentItem.isMarkedForReview
                    ? 'bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'border-sage-200 dark:border-dark-border text-sage-600 hover:bg-sage-100'
                }`}
              >
                <Flag className="w-3 h-3" />
                Mark for Review
              </button>
            </div>
          </div>

          {/* Question Text */}
          <div className="text-sm font-sans text-sage-950 dark:text-sage-100 leading-relaxed whitespace-pre-wrap">
            {currentItem.question.questionContent}
          </div>

          {/* MCQ Options */}
          {currentItem.question.questionType === 'MCQ' ? (
            <div className="space-y-2.5 pt-2">
              {currentItem.question.options.map((opt) => {
                const isSelected = currentItem.userAnswer === opt.optionKey;
                return (
                  <button
                    key={opt.optionKey}
                    onClick={() => handleSelectAnswer(opt.optionKey)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'border-forest bg-mint/20 dark:border-mint dark:bg-mint/10 ring-1 ring-forest'
                        : 'border-sage-200/60 dark:border-dark-border bg-ivory-50/50 dark:bg-dark-surface hover:bg-sage-50'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-forest text-ivory dark:bg-mint dark:text-forest-dark'
                          : 'bg-sage-200/60 dark:bg-dark-border text-sage-700'
                      }`}
                    >
                      {opt.optionKey}
                    </span>
                    <span className="text-xs sm:text-sm text-sage-900 dark:text-sage-100 leading-normal">
                      {opt.content}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* TITA (Type In The Answer) */
            <div className="space-y-3 pt-2">
              <label className="text-xs font-semibold text-sage-700 dark:text-sage-300 block">
                Type In The Answer (TITA):
              </label>
              <div className="flex gap-2 max-w-sm">
                <input
                  type="text"
                  placeholder="Enter numeric or text value..."
                  value={currentItem.userAnswer || ''}
                  onChange={(e) => handleSelectAnswer(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-1 focus:ring-forest font-mono font-bold"
                />
              </div>
              <p className="text-[11px] text-sage-500">
                For decimals, use standard dot representation (e.g. 13.4). No negative marking for TITA.
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-6 border-t border-sage-100 dark:border-dark-border">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentIndex === 0}
                onClick={() => {
                  questionStartTimeRef.current = Date.now();
                  setCurrentIndex(currentIndex - 1);
                }}
                className="text-xs h-8"
              >
                <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
              </Button>

              {currentItem.userAnswer && (
                <button
                  type="button"
                  onClick={handleClearAnswer}
                  className="px-2.5 py-1 text-xs text-sage-500 hover:text-rose-dark transition-colors"
                >
                  Clear Choice
                </button>
              )}
            </div>

            <Button
              size="sm"
              onClick={() => {
                if (currentIndex < session.totalQuestions - 1) {
                  questionStartTimeRef.current = Date.now();
                  setCurrentIndex(currentIndex + 1);
                } else {
                  handleSubmitSession();
                }
              }}
              className="text-xs h-8 bg-forest hover:bg-forest-dark text-ivory"
            >
              {currentIndex < session.totalQuestions - 1 ? (
                <>
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </>
              ) : (
                'Review & Finish'
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
