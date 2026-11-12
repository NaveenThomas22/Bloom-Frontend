import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examsApi } from '../api/examsApi';
import { bookmarksApi } from '@/features/bookmarks/api/bookmarksApi';
import type { ExamReview } from '@/types/exams';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  Bookmark,
  BookmarkCheck,
  FileText,
  Filter,
} from 'lucide-react';

export const ExamReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const attemptId = Number(id);

  const [review, setReview] = useState<ExamReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Correct' | 'Incorrect' | 'Unanswered'>('All');
  const [bookmarkedMap, setBookmarkedMap] = useState<Record<number, boolean>>({});

  useEffect(() => {
    loadReview();
  }, [attemptId]);

  const loadReview = async () => {
    setIsLoading(true);
    try {
      const data = await examsApi.getReview(attemptId);
      setReview(data);
    } catch (err) {
      console.error('Failed to load review:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = async (questionId: number) => {
    const isBookmarked = !!bookmarkedMap[questionId];
    try {
      if (isBookmarked) {
        await bookmarksApi.removeBookmark(questionId);
        setBookmarkedMap((prev) => ({ ...prev, [questionId]: false }));
      } else {
        await bookmarksApi.addBookmark(questionId);
        setBookmarkedMap((prev) => ({ ...prev, [questionId]: true }));
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  if (isLoading || !review) {
    return (
      <div className="py-24 text-center font-serif text-sage-600 dark:text-sage-400">
        Loading exam review & solutions...
      </div>
    );
  }

  // Filter questions
  const filteredQuestions = review.questions.filter((q) => {
    if (selectedSection !== 'All' && q.sectionName !== selectedSection) {
      return false;
    }
    if (statusFilter === 'Correct' && q.isCorrect !== true) return false;
    if (statusFilter === 'Incorrect' && (q.isCorrect === true || !q.userAnswer)) return false;
    if (statusFilter === 'Unanswered' && q.userAnswer) return false;
    return true;
  });

  const sections = Array.from(new Set(review.questions.map((q) => q.sectionName)));

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/exams/${attemptId}/results`)}
            className="p-2 rounded-xl border border-sage-200/60 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-sage-100"
          >
            <ArrowLeft className="w-4 h-4 text-sage-700 dark:text-sage-300" />
          </button>
          <div>
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
              Exam Solutions & Detailed Review
            </h1>
            <p className="text-xs text-sage-600 dark:text-sage-400 mt-0.5">
              {review.summary.templateTitle} — Total Score: {review.summary.totalScore} /{' '}
              {review.summary.maxPossibleScore}
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/bookmarks')}
          className="text-xs h-9"
        >
          <Bookmark className="w-3.5 h-3.5 mr-1.5" />
          View Saved
        </Button>
      </div>

      {/* Filter Row */}
      <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Section Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <span className="text-sage-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Section:
          </span>
          {['All', ...sections].map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSection(sec)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSection === sec
                  ? 'bg-forest text-ivory'
                  : 'bg-ivory-50 dark:bg-dark-surface text-sage-700 dark:text-sage-300 border border-sage-200 dark:border-dark-border'
              }`}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-1.5">
          {(['All', 'Correct', 'Incorrect', 'Unanswered'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-xl text-xs font-medium border transition-colors ${
                statusFilter === st
                  ? 'bg-sage-800 text-white border-sage-800 dark:bg-slate-700'
                  : 'border-sage-200 dark:border-dark-border text-sage-600 hover:bg-sage-100'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-dark-card border border-dashed border-sage-300 dark:border-dark-border text-xs text-sage-500">
            No questions match the current filter selection.
          </div>
        ) : (
          filteredQuestions.map((q) => {
            const isCorrect = q.isCorrect === true;
            const isWrong = q.userAnswer && q.isCorrect === false;
            const isUnanswered = !q.userAnswer;

            return (
              <div
                key={q.questionId}
                className={`p-6 rounded-3xl border transition-all space-y-4 ${
                  isCorrect
                    ? 'border-mint/60 bg-mint/5 dark:bg-mint/5 dark:border-mint/20'
                    : isWrong
                    ? 'border-rose/40 bg-rose/5 dark:bg-rose/5 dark:border-rose/20'
                    : 'border-sage-200/60 bg-white dark:bg-dark-card dark:border-dark-border'
                }`}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-2 pb-2 border-b border-sage-100 dark:border-dark-border">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-sage-500">
                      Q{q.displayOrder} ({q.sectionName})
                    </span>

                    {isCorrect && (
                      <Badge variant="forest" className="text-[10px]">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Correct (+{q.marksAwarded})
                      </Badge>
                    )}
                    {isWrong && (
                      <Badge variant="rose" className="text-[10px]">
                        <XCircle className="w-3 h-3 mr-1" /> Incorrect ({q.marksAwarded})
                      </Badge>
                    )}
                    {isUnanswered && (
                      <Badge variant="sage" className="text-[10px]">
                        <HelpCircle className="w-3 h-3 mr-1" /> Unanswered (0)
                      </Badge>
                    )}

                    <span className="text-[10px] text-sage-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {q.timeSpentSeconds}s
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(q.questionId)}
                    className="p-1.5 text-sage-400 hover:text-forest transition-colors"
                    title="Bookmark question"
                  >
                    {bookmarkedMap[q.questionId] ? (
                      <BookmarkCheck className="w-4 h-4 text-forest dark:text-mint fill-current" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Passage / Set if present */}
                {q.passage && (
                  <div className="p-3.5 rounded-2xl bg-ivory-100/60 dark:bg-dark-surface/60 border border-sage-200/40 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-sage-800 dark:text-sage-200">
                      <FileText className="w-3.5 h-3.5 text-forest" />
                      Reading Comprehension: {q.passage.title}
                    </div>
                    <div className="text-sage-600 dark:text-sage-400 leading-relaxed font-serif whitespace-pre-wrap">
                      {q.passage.content}
                    </div>
                  </div>
                )}

                {q.questionSet && (
                  <div className="p-3.5 rounded-2xl bg-ivory-100/60 dark:bg-dark-surface/60 border border-sage-200/40 text-xs space-y-1">
                    <div className="flex items-center gap-1 font-semibold text-sage-800 dark:text-sage-200">
                      <FileText className="w-3.5 h-3.5 text-forest" />
                      DILR Caselet: {q.questionSet.title}
                    </div>
                    <div className="text-sage-600 dark:text-sage-400 leading-relaxed font-serif whitespace-pre-wrap">
                      {q.questionSet.contextScenario}
                    </div>
                  </div>
                )}

                {/* Question Content */}
                <div className="text-xs sm:text-sm text-sage-950 dark:text-sage-100 font-sans leading-relaxed whitespace-pre-wrap">
                  {q.content}
                </div>

                {/* MCQ Options with official answer key comparison */}
                {q.questionType === 'MCQ' && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt) => {
                      const isUserChoice = q.userAnswer === opt.optionKey;
                      const isCorrectChoice = opt.optionKey === q.correctAnswer;

                      return (
                        <div
                          key={opt.optionKey}
                          className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                            isCorrectChoice
                              ? 'border-forest bg-mint/30 dark:bg-mint/10 font-bold'
                              : isUserChoice && !isCorrectChoice
                              ? 'border-rose/50 bg-rose/10 font-bold'
                              : 'border-sage-200/50 dark:border-dark-border bg-ivory-50/40 dark:bg-dark-surface'
                          }`}
                        >
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                              isCorrectChoice
                                ? 'bg-forest text-ivory'
                                : isUserChoice
                                ? 'bg-rose text-rose-dark'
                                : 'bg-sage-200 text-sage-700'
                            }`}
                          >
                            {opt.optionKey}
                          </span>
                          <span className="text-sage-900 dark:text-sage-100">{opt.content}</span>
                          {isCorrectChoice && (
                            <span className="ml-auto text-[10px] text-forest dark:text-mint font-bold uppercase tracking-wider">
                              Correct Option
                            </span>
                          )}
                          {isUserChoice && !isCorrectChoice && (
                            <span className="ml-auto text-[10px] text-rose-dark font-bold uppercase tracking-wider">
                              Your Option
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* TITA comparison */}
                {q.questionType === 'TITA' && (
                  <div className="p-3.5 rounded-xl bg-ivory-100 dark:bg-dark-surface border border-sage-200 text-xs flex flex-wrap gap-5 items-center">
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
                      <span className="text-[11px] text-sage-500 block">Official Correct Answer:</span>
                      <span className="font-mono font-bold text-sm text-forest dark:text-mint">
                        {q.correctAnswer}
                      </span>
                    </div>
                  </div>
                )}

                {/* Explanation & Steps */}
                {(q.explanation || q.solutionSteps) && (
                  <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border space-y-2">
                    <div className="font-serif font-bold text-xs text-forest dark:text-mint">
                      Official Explanation & Solution:
                    </div>
                    {q.explanation && (
                      <p className="text-xs text-sage-800 dark:text-sage-200 leading-relaxed whitespace-pre-wrap">
                        {q.explanation}
                      </p>
                    )}
                    {q.solutionSteps && (
                      <div className="pt-2 border-t border-sage-100 dark:border-dark-border text-xs text-sage-700 dark:text-sage-300 font-mono leading-relaxed whitespace-pre-wrap">
                        {q.solutionSteps}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
