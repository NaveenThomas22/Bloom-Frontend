import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionsApi } from '../api/questionsApi';
import { bookmarksApi } from '@/features/bookmarks/api/bookmarksApi';
import { useSyllabusOverview } from '@/features/syllabus/hooks/useSyllabus';
import type { Question, QuestionFilter } from '@/types/questions';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  BookOpen,
  Bookmark,
  BookmarkCheck,
  Search,
  Filter,
  Play,
  ChevronRight,
  ChevronLeft,
  FileText,
  HelpCircle,
} from 'lucide-react';

export const QuestionBankPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: syllabus } = useSyllabusOverview();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);

  const [filter, setFilter] = useState<QuestionFilter>({
    subjectId: undefined,
    topicId: undefined,
    questionType: undefined,
    difficultyLevel: undefined,
    search: '',
  });

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await questionsApi.getQuestions({
        ...filter,
        page,
        pageSize,
      });
      setQuestions(res.items);
      setTotalCount(res.totalCount);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [page, filter.subjectId, filter.topicId, filter.questionType, filter.difficultyLevel]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadQuestions();
  };

  const toggleBookmark = async (q: Question) => {
    try {
      if (q.isBookmarked) {
        await bookmarksApi.removeBookmark(q.id);
        setQuestions((prev) =>
          prev.map((item) => (item.id === q.id ? { ...item, isBookmarked: false } : item))
        );
      } else {
        await bookmarksApi.addBookmark(q.id);
        setQuestions((prev) =>
          prev.map((item) => (item.id === q.id ? { ...item, isBookmarked: true } : item))
        );
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-300">
              <BookOpen className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
              CAT Question Bank
            </h1>
          </div>
          <p className="text-xs text-sage-600 dark:text-sage-400 mt-0.5">
            Structured repository of authentic CAT Quantitative Aptitude, DILR and VARC questions
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/bookmarks')}
            className="text-xs h-9"
          >
            <Bookmark className="w-3.5 h-3.5 mr-1.5" />
            Saved Questions
          </Button>
          <Button
            size="sm"
            onClick={() => navigate('/practice')}
            className="text-xs h-9 bg-forest hover:bg-forest-dark text-ivory"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            Start Practice
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-sage-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search question text or concepts..."
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value })}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-50/50 dark:bg-dark-surface focus:outline-none focus:ring-1 focus:ring-forest text-sage-900 dark:text-sage-100"
            />
          </div>
          <Button type="submit" size="sm" className="text-xs h-9">
            Search
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="flex items-center gap-1 text-sage-500 font-medium mr-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Subject Filter */}
          <select
            value={filter.subjectId || ''}
            onChange={(e) => {
              setFilter({
                ...filter,
                subjectId: e.target.value ? Number(e.target.value) : undefined,
                topicId: undefined,
              });
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-800 dark:text-sage-200 text-xs"
          >
            <option value="">All Subjects</option>
            {syllabus?.subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={filter.difficultyLevel || ''}
            onChange={(e) => {
              setFilter({
                ...filter,
                difficultyLevel: e.target.value ? (e.target.value as any) : undefined,
              });
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-800 dark:text-sage-200 text-xs"
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          {/* Question Type Filter */}
          <select
            value={filter.questionType || ''}
            onChange={(e) => {
              setFilter({
                ...filter,
                questionType: e.target.value ? (e.target.value as any) : undefined,
              });
              setPage(1);
            }}
            className="px-2.5 py-1.5 rounded-lg border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-800 dark:text-sage-200 text-xs"
          >
            <option value="">All Types (MCQ / TITA)</option>
            <option value="MCQ">MCQ</option>
            <option value="TITA">TITA (Type In The Answer)</option>
          </select>

          {(filter.subjectId || filter.difficultyLevel || filter.questionType || filter.search) && (
            <button
              onClick={() => {
                setFilter({ search: '' });
                setPage(1);
              }}
              className="text-xs text-forest dark:text-sage-300 underline ml-2"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Question List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-sage-200/40 dark:bg-dark-surface animate-pulse"
            />
          ))}
        </div>
      ) : questions.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-dark-card border border-dashed border-sage-300 dark:border-dark-border space-y-2">
          <HelpCircle className="w-8 h-8 text-sage-400 mx-auto" />
          <h3 className="font-serif text-sm font-semibold text-sage-800 dark:text-sage-200">
            No Questions Found
          </h3>
          <p className="text-xs text-sage-500">
            Try adjusting your search criteria or filter combinations.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="p-5 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-bold text-sage-400">
                    #{(page - 1) * pageSize + idx + 1}
                  </span>
                  <Badge variant="sage" className="text-[10px]">
                    {q.subjectName || 'General'}
                  </Badge>
                  {q.topicName && (
                    <Badge variant="sage" className="text-[10px]">
                      {q.topicName}
                    </Badge>
                  )}
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      q.difficultyLevel === 'Hard'
                        ? 'bg-rose/20 text-rose-dark'
                        : q.difficultyLevel === 'Medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-mint/40 text-forest dark:bg-mint/20 dark:text-mint-light'
                    }`}
                  >
                    {q.difficultyLevel}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sage-100 dark:bg-dark-surface text-sage-700 dark:text-sage-300 font-medium">
                    {q.questionType}
                  </span>
                </div>

                <button
                  onClick={() => toggleBookmark(q)}
                  className="p-1.5 rounded-lg text-sage-400 hover:text-forest transition-colors"
                  title={q.isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                >
                  {q.isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4 text-forest dark:text-mint fill-current" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Passage/Set preview if present */}
              {q.passage && (
                <div className="p-3 rounded-xl bg-ivory-100/60 dark:bg-dark-surface/60 border border-sage-200/40 text-xs space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-sage-800 dark:text-sage-200">
                    <FileText className="w-3.5 h-3.5 text-forest" />
                    Reading Comprehension Passage: {q.passage.title}
                  </div>
                  <p className="text-sage-600 dark:text-sage-400 line-clamp-2 italic">
                    {q.passage.content}
                  </p>
                </div>
              )}

              {q.questionSet && (
                <div className="p-3 rounded-xl bg-ivory-100/60 dark:bg-dark-surface/60 border border-sage-200/40 text-xs space-y-1">
                  <div className="flex items-center gap-1 font-semibold text-sage-800 dark:text-sage-200">
                    <FileText className="w-3.5 h-3.5 text-forest" />
                    DILR Caselet: {q.questionSet.title}
                  </div>
                  <p className="text-sage-600 dark:text-sage-400 line-clamp-2">
                    {q.questionSet.contextScenario}
                  </p>
                </div>
              )}

              {/* Question Content */}
              <div className="text-xs sm:text-sm text-sage-900 dark:text-sage-100 font-sans leading-relaxed whitespace-pre-wrap">
                {q.questionContent}
              </div>

              {/* Options */}
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

              {/* Footer action */}
              <div className="flex items-center justify-between pt-2 border-t border-sage-100 dark:border-dark-border text-xs">
                <span className="text-sage-500 text-[11px]">
                  Marks: +{q.defaultMarks} / -{q.defaultPenalty}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    navigate(
                      `/practice?mode=Topic&subjectId=${q.subjectId}&topicId=${q.topicId}`
                    )
                  }
                  className="text-xs h-7 py-0"
                >
                  Practice Topic <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4">
              <span className="text-xs text-sage-500">
                Page {page} of {totalPages} ({totalCount} total questions)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                  className="text-xs h-8"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage(page + 1)}
                  className="text-xs h-8"
                >
                  Next <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
