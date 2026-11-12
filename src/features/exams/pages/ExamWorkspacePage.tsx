import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examsApi } from '../api/examsApi';
import { useAuthStore } from '@/store/useAuthStore';
import type {
  ActiveExamAttempt,
  ExamAttemptQuestionItem,
  AnswerStatus,
  ExamSection,
} from '@/types/exams';
import { Button } from '@/components/ui/Button';
import {
  User,
  FileText,
  Check,
  Flag,
} from 'lucide-react';

export const ExamWorkspacePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const attemptId = Number(id);
  const { user } = useAuthStore();

  const [attempt, setAttempt] = useState<ActiveExamAttempt | null>(null);
  const [currentQuestionId, setCurrentQuestionId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Timers (server authoritative with local countdown)
  const [remainingSectionSec, setRemainingSectionSec] = useState<number>(0);
  const [remainingTotalSec, setRemainingTotalSec] = useState<number>(0);

  // Time tracking per question
  const questionStartTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    loadAttempt();
  }, [attemptId]);

  const loadAttempt = async () => {
    setIsLoading(true);
    try {
      const data = await examsApi.getAttemptById(attemptId);
      if (data.status === 'Submitted' || data.status === 'AutoSubmitted') {
        navigate(`/exams/${attemptId}/results`, { replace: true });
        return;
      }
      setAttempt(data);
      setRemainingSectionSec(data.remainingSecondsCurrentSection);
      setRemainingTotalSec(data.remainingSecondsTotal);

      // Select first question of current section
      const firstInSec = data.questions.find((q) => q.examSectionId === data.currentSectionId);
      if (firstInSec) {
        setCurrentQuestionId(firstInSec.questionId);
      }
    } catch (err) {
      console.error('Failed to load exam attempt:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Timer Tick
  useEffect(() => {
    if (!attempt || attempt.status !== 'InProgress') return;

    const interval = setInterval(() => {
      setRemainingSectionSec((prev) => {
        if (prev <= 1) {
          handleSectionTimeout();
          return 0;
        }
        return prev - 1;
      });

      setRemainingTotalSec((prev) => {
        if (prev <= 1) {
          handleTotalExamTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [attempt?.status, attempt?.currentSectionId]);

  const handleSectionTimeout = async () => {
    if (!attempt) return;
    const currentSectionIndex = attempt.sections.findIndex((s) => s.id === attempt.currentSectionId);
    if (currentSectionIndex < attempt.sections.length - 1) {
      const nextSection = attempt.sections[currentSectionIndex + 1];
      try {
        const nextAttempt = await examsApi.transitionSection(attempt.id, {
          targetSectionId: nextSection.id,
        });
        setAttempt(nextAttempt);
        setRemainingSectionSec(nextAttempt.remainingSecondsCurrentSection);
        const firstInNext = nextAttempt.questions.find((q) => q.examSectionId === nextSection.id);
        if (firstInNext) setCurrentQuestionId(firstInNext.questionId);
      } catch (err) {
        console.error('Section transition error:', err);
      }
    } else {
      await handleFinalSubmit(true);
    }
  };

  const handleTotalExamTimeout = async () => {
    await handleFinalSubmit(true);
  };

  // Questions in currently active section
  const currentSectionQuestions =
    attempt?.questions.filter((q) => q.examSectionId === attempt.currentSectionId) || [];
  const currentQuestion: ExamAttemptQuestionItem | undefined =
    attempt?.questions.find((q) => q.questionId === currentQuestionId) || currentSectionQuestions[0];

  const currentSection: ExamSection | undefined = attempt?.sections.find(
    (s) => s.id === attempt.currentSectionId
  );

  const saveCurrentAnswer = async (
    newAnswer?: string,
    newStatus: AnswerStatus = 'Answered'
  ) => {
    if (!attempt || !currentQuestion) return;

    const timeSpent = Math.max(1, Math.round((Date.now() - questionStartTimeRef.current) / 1000));
    questionStartTimeRef.current = Date.now();

    // Optimistic UI state
    const updated = attempt.questions.map((q) =>
      q.questionId === currentQuestion.questionId
        ? {
            ...q,
            userAnswer: newAnswer,
            answerStatus: newStatus,
            timeSpentSeconds: q.timeSpentSeconds + timeSpent,
          }
        : q
    );
    setAttempt({ ...attempt, questions: updated });

    const currentVersion = currentQuestion.version || 1;

    setAutosaveStatus('saving');
    try {
      const saveRes = await examsApi.saveAnswer(attempt.id, {
        questionId: currentQuestion.questionId,
        userAnswer: newAnswer,
        answerStatus: newStatus,
        timeSpentSeconds: timeSpent,
        expectedVersion: currentVersion,
      });

      // Update confirmed version in local attempt state
      setAttempt((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: prev.questions.map((q) =>
            q.questionId === currentQuestion.questionId
              ? { ...q, version: saveRes.newVersion }
              : q
          ),
        };
      });

      setAutosaveStatus('saved');
      setTimeout(() => setAutosaveStatus('idle'), 2500);
    } catch (err: any) {
      console.error('Autosave exam answer error:', err);
      if (err?.response?.status === 409) {
        try {
          const freshAttempt = await examsApi.getAttemptById(attempt.id);
          setAttempt(freshAttempt);
        } catch {
          // ignore reload errors
        }
      }
      setAutosaveStatus('idle');
    }
  };

  const handleSaveAndNext = async () => {
    if (!currentQuestion) return;
    const answer = currentQuestion.userAnswer;
    const status: AnswerStatus = answer ? 'Answered' : 'NotAnswered';
    await saveCurrentAnswer(answer, status);

    // Navigate to next question in section
    const currentIndex = currentSectionQuestions.findIndex(
      (q) => q.questionId === currentQuestion.questionId
    );
    if (currentIndex < currentSectionQuestions.length - 1) {
      questionStartTimeRef.current = Date.now();
      setCurrentQuestionId(currentSectionQuestions[currentIndex + 1].questionId);
    }
  };

  const handleClearResponse = async () => {
    if (!currentQuestion) return;
    await saveCurrentAnswer(undefined, 'NotAnswered');
  };

  const handleMarkForReviewAndNext = async () => {
    if (!currentQuestion) return;
    const answer = currentQuestion.userAnswer;
    const status: AnswerStatus = answer ? 'AnsweredAndMarkedForReview' : 'MarkedForReview';
    await saveCurrentAnswer(answer, status);

    const currentIndex = currentSectionQuestions.findIndex(
      (q) => q.questionId === currentQuestion.questionId
    );
    if (currentIndex < currentSectionQuestions.length - 1) {
      questionStartTimeRef.current = Date.now();
      setCurrentQuestionId(currentSectionQuestions[currentIndex + 1].questionId);
    }
  };

  const handleTransitionSection = async () => {
    if (!attempt) return;
    const currentIdx = attempt.sections.findIndex((s) => s.id === attempt.currentSectionId);
    if (currentIdx >= attempt.sections.length - 1) {
      // Last section -> submit exam
      await handleFinalSubmit(false);
      return;
    }

    const nextSection = attempt.sections[currentIdx + 1];
    const confirmed = window.confirm(
      `Are you sure you want to submit the ${currentSection?.sectionName} section? Once submitted, you CANNOT return to this section as per official CAT rules.`
    );
    if (!confirmed) return;

    try {
      const nextAttempt = await examsApi.transitionSection(attempt.id, {
        targetSectionId: nextSection.id,
      });
      setAttempt(nextAttempt);
      setRemainingSectionSec(nextAttempt.remainingSecondsCurrentSection);
      const firstInNext = nextAttempt.questions.find((q) => q.examSectionId === nextSection.id);
      if (firstInNext) setCurrentQuestionId(firstInNext.questionId);
    } catch (err: any) {
      console.error('Section transition error:', err);
      alert(err.response?.data?.message || 'Could not transition section.');
    }
  };

  const handleFinalSubmit = async (isAuto = false) => {
    if (!attempt) return;
    if (!isAuto) {
      const confirmed = window.confirm(
        'Are you sure you want to submit your examination? Your final score and sectional breakdown will be calculated.'
      );
      if (!confirmed) return;
    }

    setIsSubmitting(true);
    try {
      await examsApi.submitAttempt(attempt.id);
      navigate(`/exams/${attempt.id}/results`, { replace: true });
    } catch (err) {
      console.error('Final exam submission error:', err);
      alert('Could not submit exam. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (isLoading || !attempt || !currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center font-serif text-slate-700 bg-slate-100">
        Authenticating and loading CAT examination terminal...
      </div>
    );
  }

  // Format timer MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.max(0, Math.floor(totalSeconds / 60));
    const secs = Math.max(0, totalSeconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Question count stats for current section
  const answeredCount = currentSectionQuestions.filter((q) => q.answerStatus === 'Answered').length;
  const notAnsweredCount = currentSectionQuestions.filter(
    (q) => q.answerStatus === 'NotAnswered'
  ).length;
  const markedReviewCount = currentSectionQuestions.filter(
    (q) => q.answerStatus === 'MarkedForReview'
  ).length;
  const ansMarkedCount = currentSectionQuestions.filter(
    (q) => q.answerStatus === 'AnsweredAndMarkedForReview'
  ).length;
  const notVisitedCount = currentSectionQuestions.filter(
    (q) => q.answerStatus === 'NotVisited'
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex flex-col font-sans select-none pb-8">
      {/* 1. Official CAT Examination Header */}
      <header className="bg-slate-800 text-white px-4 py-2.5 shadow-md flex flex-wrap items-center justify-between gap-3 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 border border-slate-600">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold leading-none">{user?.fullName || 'Candidate'}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              Roll No: CAT{attempt.id.toString().padStart(6, '0')}
            </div>
          </div>
        </div>

        <div className="text-center hidden sm:block">
          <div className="text-xs font-bold uppercase tracking-wide text-slate-200">
            {attempt.templateTitle}
          </div>
          <div className="text-[11px] text-emerald-400 font-semibold">
            Active Section: {attempt.currentSectionName}
          </div>
        </div>

        {/* Timers */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 block leading-none">
              Section Time Left
            </span>
            <span
              className={`font-mono text-base font-bold leading-tight ${
                remainingSectionSec < 300 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'
              }`}
            >
              {formatTimer(remainingSectionSec)}
            </span>
          </div>

          <div className="text-right hidden md:block">
            <span className="text-[10px] uppercase text-slate-400 block leading-none">
              Total Exam Left
            </span>
            <span className="font-mono text-xs text-slate-300 block leading-tight">
              {formatTimer(remainingTotalSec)}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Section Navigation Tabs */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700 px-4 py-2 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1">Sections:</span>
          {attempt.sections.map((s, idx) => {
            const isCurrent = s.id === attempt.currentSectionId;
            const isCompleted =
              idx < attempt.sections.findIndex((sec) => sec.id === attempt.currentSectionId);

            return (
              <div
                key={s.id}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  isCurrent
                    ? 'bg-slate-800 text-white shadow-sm ring-1 ring-slate-800 dark:bg-emerald-600 dark:ring-emerald-600'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                }`}
              >
                {isCompleted && <Check className="w-3.5 h-3.5" />}
                <span>{s.sectionName}</span>
                <span className="text-[10px] opacity-75">({s.questionCount} Qs)</span>
              </div>
            );
          })}
        </div>

        {/* Autosave status indicator */}
        <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
          {autosaveStatus === 'saving' && (
            <span className="text-amber-600 font-bold">Autosaving...</span>
          )}
          {autosaveStatus === 'saved' && (
            <span className="text-emerald-600 font-bold">✓ Response Saved</span>
          )}
        </div>
      </div>

      {/* 3. Main CBT Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: Question & Passage Pane */}
        <div className="lg:col-span-8 xl:col-span-9 flex flex-col space-y-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 shadow-sm flex-1 flex flex-col">
            {/* Question Top Subheader */}
            <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                  Question No. {currentQuestion.displayOrder}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 font-semibold">
                  {currentQuestion.questionType}
                </span>
              </div>

              <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Marks for correct answer:{' '}
                <span className="text-emerald-600 font-bold">+{currentQuestion.marks}</span> |
                Negative mark:{' '}
                <span className="text-rose-600 font-bold">-{currentQuestion.penalty}</span>
              </div>
            </div>

            {/* Split View for Passage/Question Set or QA prompt */}
            <div className="p-4 sm:p-6 flex-1 overflow-y-auto max-h-[calc(100vh-320px)] space-y-5">
              {/* Reading Comprehension Passage */}
              {currentQuestion.passage && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    RC Passage: {currentQuestion.passage.title}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-wrap">
                    {currentQuestion.passage.content}
                  </div>
                </div>
              )}

              {/* DILR Caselet Scenario */}
              {currentQuestion.questionSet && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-750 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-slate-200">
                    <FileText className="w-4 h-4 text-emerald-600" />
                    Caselet: {currentQuestion.questionSet.title}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-serif whitespace-pre-wrap">
                    {currentQuestion.questionSet.contextScenario}
                  </div>
                </div>
              )}

              {/* Question Text */}
              <div className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed whitespace-pre-wrap">
                {currentQuestion.content}
              </div>

              {/* MCQ Options */}
              {currentQuestion.questionType === 'MCQ' ? (
                <div className="space-y-2.5 pt-2">
                  {currentQuestion.options.map((opt) => {
                    const isSelected = currentQuestion.userAnswer === opt.optionKey;
                    return (
                      <label
                        key={opt.optionKey}
                        onClick={() => saveCurrentAnswer(opt.optionKey, 'Answered')}
                        className={`w-full p-3.5 rounded-xl border text-left flex items-start gap-3 cursor-pointer transition-all ${
                          isSelected
                            ? 'border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30 dark:border-emerald-500 ring-1 ring-emerald-500'
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q_${currentQuestion.questionId}`}
                          checked={isSelected}
                          onChange={() => {}}
                          className="mt-1 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                          {opt.optionKey}.
                        </span>
                        <span className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
                          {opt.content}
                        </span>
                      </label>
                    );
                  })}
                </div>
              ) : (
                /* TITA Input Box */
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Type your answer in the box below:
                  </label>
                  <input
                    type="text"
                    value={currentQuestion.userAnswer || ''}
                    placeholder="Enter answer..."
                    onChange={(e) => saveCurrentAnswer(e.target.value, 'Answered')}
                    className="w-full max-w-sm px-4 py-2.5 text-base font-mono font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-slate-500 block">
                    Virtual numeric keypad supported. Use '.' for decimals.
                  </span>
                </div>
              )}
            </div>

            {/* Bottom Actions Toolbar */}
            <div className="p-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleSaveAndNext}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-4 font-bold"
                >
                  Save & Next
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearResponse}
                  className="text-xs h-9 px-3 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600"
                >
                  Clear Response
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkForReviewAndNext}
                  className="text-xs h-9 px-3 text-purple-700 border-purple-300 dark:text-purple-300 dark:border-purple-700"
                >
                  <Flag className="w-3 h-3 mr-1" />
                  Mark for Review & Next
                </Button>
              </div>

              <Button
                size="sm"
                onClick={handleTransitionSection}
                disabled={isSubmitting}
                className="bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 text-white text-xs h-9 px-5 font-bold"
              >
                {attempt.sections.findIndex((s) => s.id === attempt.currentSectionId) ===
                attempt.sections.length - 1
                  ? isSubmitting
                    ? 'Submitting...'
                    : 'Submit Test'
                  : 'Submit Section'}
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column: Question Palette */}
        <div className="lg:col-span-4 xl:col-span-3 flex flex-col space-y-3">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-300 dark:border-slate-700 p-4 shadow-sm space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 pb-2">
              Question Palette ({currentSection?.sectionName})
            </h3>

            {/* Official Legend Grid */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {answeredCount}
                </span>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-rose-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {notAnsweredCount}
                </span>
                <span>Not Answered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[10px]">
                  {markedReviewCount}
                </span>
                <span>Marked for Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-[10px] relative">
                  {ansMarkedCount}
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 border border-white" />
                </span>
                <span>Ans & Marked</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <span className="w-5 h-5 rounded-md bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-[10px]">
                  {notVisitedCount}
                </span>
                <span>Not Visited</span>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-2">
                Choose a Question:
              </div>
              <div className="grid grid-cols-5 gap-2 max-h-[300px] overflow-y-auto p-1">
                {currentSectionQuestions.map((q) => {
                  const isCurrent = q.questionId === currentQuestion.questionId;
                  let bgStyle = 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200';

                  if (q.answerStatus === 'Answered') {
                    bgStyle = 'bg-emerald-600 text-white font-bold';
                  } else if (q.answerStatus === 'NotAnswered') {
                    bgStyle = 'bg-rose-600 text-white font-bold';
                  } else if (q.answerStatus === 'MarkedForReview') {
                    bgStyle = 'bg-purple-600 text-white font-bold';
                  } else if (q.answerStatus === 'AnsweredAndMarkedForReview') {
                    bgStyle = 'bg-purple-600 text-white font-bold ring-2 ring-emerald-400';
                  }

                  return (
                    <button
                      key={q.questionId}
                      onClick={() => {
                        questionStartTimeRef.current = Date.now();
                        setCurrentQuestionId(q.questionId);
                      }}
                      className={`h-9 rounded-lg text-xs font-bold transition-all relative ${bgStyle} ${
                        isCurrent ? 'ring-2 ring-slate-900 dark:ring-white scale-105' : ''
                      }`}
                    >
                      {q.displayOrder}
                      {q.answerStatus === 'AnsweredAndMarkedForReview' && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
