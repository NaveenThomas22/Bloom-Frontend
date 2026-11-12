import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookmarksApi } from '../api/bookmarksApi';
import type { Question } from '@/types/questions';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bookmark, Trash2, ArrowLeft, Play, HelpCircle } from 'lucide-react';

export const BookmarksPage: React.FC = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadBookmarks = async () => {
    setIsLoading(true);
    try {
      const res = await bookmarksApi.getBookmarks();
      setQuestions(res.items);
    } catch (err) {
      console.error('Failed to load bookmarks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await bookmarksApi.removeBookmark(id);
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/questions')}
            className="p-2 rounded-xl border border-sage-200/60 dark:border-dark-border bg-white dark:bg-dark-card hover:bg-sage-100"
          >
            <ArrowLeft className="w-4 h-4 text-sage-700 dark:text-sage-300" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-300">
                <Bookmark className="w-4 h-4 fill-current" />
              </span>
              <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
                Bookmarked Questions
              </h1>
            </div>
            <p className="text-xs text-sage-600 dark:text-sage-400 mt-0.5">
              Review saved questions and challenging concepts
            </p>
          </div>
        </div>

        {questions.length > 0 && (
          <Button
            size="sm"
            onClick={() => navigate('/practice?mode=Custom')}
            className="text-xs h-9 bg-forest hover:bg-forest-dark text-ivory"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            Practice All
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-sage-200/40 dark:bg-dark-surface animate-pulse"
            />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-dark-card border border-dashed border-sage-300 dark:border-dark-border space-y-2">
          <HelpCircle className="w-8 h-8 text-sage-400 mx-auto" />
          <h3 className="font-serif text-sm font-semibold text-sage-800 dark:text-sage-200">
            No Bookmarked Questions
          </h3>
          <p className="text-xs text-sage-500">
            While browsing the Question Bank or practicing, click the bookmark icon to save questions here.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/questions')}
            className="text-xs mt-2"
          >
            Explore Question Bank
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Badge variant="sage" className="text-[10px]">
                    {q.subjectName || 'General'}
                  </Badge>
                  {q.topicName && (
                    <Badge variant="sage" className="text-[10px]">
                      {q.topicName}
                    </Badge>
                  )}
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-100 dark:bg-dark-surface text-sage-700 dark:text-sage-300 font-medium">
                    {q.difficultyLevel}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-100 dark:bg-dark-surface text-sage-700 dark:text-sage-300 font-medium">
                    {q.questionType}
                  </span>
                </div>

                <button
                  onClick={() => handleRemove(q.id)}
                  className="p-1.5 text-sage-400 hover:text-rose-dark transition-colors"
                  title="Remove from bookmarks"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs sm:text-sm text-sage-900 dark:text-sage-100 font-sans leading-relaxed whitespace-pre-wrap">
                {q.questionContent}
              </div>

              {q.questionType === 'MCQ' && q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {q.options.map((opt) => (
                    <div
                      key={opt.optionKey}
                      className="p-2.5 rounded-xl border border-sage-200/60 dark:border-dark-border bg-ivory-50/50 dark:bg-dark-surface text-xs flex items-start gap-2"
                    >
                      <span className="font-bold text-forest dark:text-mint min-w-4">
                        {opt.optionKey}.
                      </span>
                      <span className="text-sage-800 dark:text-sage-200">{opt.content}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-sage-100 dark:border-dark-border text-xs">
                <span className="text-sage-500 text-[11px]">
                  Default Marks: +{q.defaultMarks} / -{q.defaultPenalty}
                </span>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    navigate(
                      `/practice?mode=Topic&subjectId=${q.subjectId}&topicId=${q.topicId}`
                    )
                  }
                  className="text-xs h-7 py-0"
                >
                  Practice This Topic
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
