import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { practiceApi } from '../api/practiceApi';
import { useSyllabusOverview, useSubjectDetail } from '@/features/syllabus/hooks/useSyllabus';
import type { PracticeMode, PracticeSession } from '@/types/practice';
import type { DifficultyLevel } from '@/types/questions';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Play,
  Clock,
  Target,
  ArrowRight,
  History,
  AlertCircle,
} from 'lucide-react';

export const PracticeSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { data: syllabus } = useSyllabusOverview();

  const [mode, setMode] = useState<PracticeMode>(
    (searchParams.get('mode') as PracticeMode) || 'Subject'
  );
  const [subjectId, setSubjectId] = useState<number | undefined>(
    searchParams.get('subjectId') ? Number(searchParams.get('subjectId')) : undefined
  );
  const [topicId, setTopicId] = useState<number | undefined>(
    searchParams.get('topicId') ? Number(searchParams.get('topicId')) : undefined
  );
  const [difficulty, setDifficulty] = useState<DifficultyLevel | undefined>(undefined);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timeLimitMinutes, setTimeLimitMinutes] = useState<number | undefined>(undefined);

  const [recentSessions, setRecentSessions] = useState<PracticeSession[]>([]);
  const [isStarting, setIsStarting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: subjectDetail } = useSubjectDetail(subjectId || 0);
  const allTopicsInSubject = subjectDetail?.modules.flatMap((m) => m.topics) || [];

  useEffect(() => {
    // If no subject selected, default to first subject
    if (!subjectId && syllabus?.subjects.length) {
      setSubjectId(syllabus.subjects[0].id);
    }
  }, [syllabus, subjectId]);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    try {
      const list = await practiceApi.getRecentSessions(10);
      setRecentSessions(list);
    } catch (err) {
      console.error('Failed to load recent sessions:', err);
    }
  };

  const selectedSubject = syllabus?.subjects.find((s) => s.id === subjectId);

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStarting(true);
    setErrorMsg(null);

    try {
      const title =
        mode === 'Topic' && topicId
          ? `${allTopicsInSubject.find((t) => t.id === topicId)?.name || 'Topic'} Practice`
          : mode === 'Subject' && selectedSubject
          ? `${selectedSubject.name} Practice`
          : 'Custom Practice Session';

      const session = await practiceApi.startSession({
        title,
        practiceMode: mode,
        subjectId,
        topicId: mode === 'Topic' ? topicId : undefined,
        difficultyLevel: difficulty,
        questionCount,
        timeLimitMinutes,
      });

      navigate(`/practice/session/${session.id}`);
    } catch (err: any) {
      console.error('Failed to start practice session:', err);
      setErrorMsg(
        err.response?.data?.message || 'Could not start practice session. Please try again.'
      );
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-mint/50 dark:bg-dark-surface text-forest dark:text-sage-300">
              <Target className="w-4 h-4" />
            </span>
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
              Question Practice Engine
            </h1>
          </div>
          <p className="text-xs text-sage-600 dark:text-sage-400 mt-0.5">
            Targeted CAT practice with answer explanations, autosave, and performance analytics
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/exams')}
          className="text-xs h-9"
        >
          Take a Mock Test <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
        </Button>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose/20 border border-rose/40 text-xs text-rose-dark flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Practice Configuration Form */}
      <form
        onSubmit={handleStart}
        className="p-6 rounded-3xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-5"
      >
        <h2 className="font-serif text-base font-bold text-sage-900 dark:text-sage-100">
          Configure Your Session
        </h2>

        {/* Mode Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-sage-700 dark:text-sage-300">
            Practice Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'Subject', label: 'Subject-wise', desc: 'Focus on QA, DILR or VARC' },
              { id: 'Topic', label: 'Topic-wise', desc: 'Target a specific syllabus topic' },
              { id: 'Difficulty', label: 'Difficulty', desc: 'Filter by Easy / Medium / Hard' },
              { id: 'Custom', label: 'Mixed / All', desc: 'Randomized blend across topics' },
            ].map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setMode(m.id as PracticeMode)}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  mode === m.id
                    ? 'border-forest bg-mint/20 dark:border-mint dark:bg-mint/10 ring-1 ring-forest'
                    : 'border-sage-200/60 dark:border-dark-border bg-ivory-50/50 dark:bg-dark-surface hover:bg-sage-50'
                }`}
              >
                <div className="text-xs font-bold text-sage-900 dark:text-sage-100">
                  {m.label}
                </div>
                <div className="text-[10px] text-sage-500 mt-0.5">{m.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subject & Topic Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 dark:text-sage-300">
              Subject
            </label>
            <select
              value={subjectId || ''}
              onChange={(e) => {
                setSubjectId(Number(e.target.value));
                setTopicId(undefined);
              }}
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-900 dark:text-sage-100 text-xs focus:ring-1 focus:ring-forest"
            >
              {syllabus?.subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {mode === 'Topic' && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-sage-700 dark:text-sage-300">
                Topic
              </label>
              <select
                value={topicId || ''}
                onChange={(e) => setTopicId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-900 dark:text-sage-100 text-xs focus:ring-1 focus:ring-forest"
              >
                <option value="">Select a topic...</option>
                {allTopicsInSubject.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Difficulty Level */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 dark:text-sage-300">
              Difficulty
            </label>
            <select
              value={difficulty || ''}
              onChange={(e) =>
                setDifficulty(e.target.value ? (e.target.value as DifficultyLevel) : undefined)
              }
              className="w-full px-3 py-2 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-900 dark:text-sage-100 text-xs focus:ring-1 focus:ring-forest"
            >
              <option value="">Any Difficulty (Mixed)</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>

          {/* Question Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-sage-700 dark:text-sage-300">
              Number of Questions
            </label>
            <div className="flex gap-2">
              {[5, 10, 15, 20].map((num) => (
                <button
                  type="button"
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
                    questionCount === num
                      ? 'bg-forest text-ivory border-forest'
                      : 'border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-700 hover:bg-sage-100'
                  }`}
                >
                  {num} Qs
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Timer selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-sage-700 dark:text-sage-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" /> Optional Timer
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { val: undefined, label: 'Untimed' },
              { val: 10, label: '10 mins' },
              { val: 15, label: '15 mins' },
              { val: 20, label: '20 mins' },
              { val: 30, label: '30 mins' },
            ].map((t) => (
              <button
                type="button"
                key={t.label}
                onClick={() => setTimeLimitMinutes(t.val)}
                className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-colors ${
                  timeLimitMinutes === t.val
                    ? 'bg-forest text-ivory border-forest'
                    : 'border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-700 hover:bg-sage-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isStarting || (mode === 'Topic' && !topicId)}
            className="w-full sm:w-auto px-8 h-10 bg-forest hover:bg-forest-dark text-ivory text-xs font-semibold"
          >
            <Play className="w-3.5 h-3.5 mr-2 fill-current" />
            {isStarting ? 'Preparing Session...' : 'Start Practice Session'}
          </Button>
        </div>
      </form>

      {/* Recent Sessions */}
      {recentSessions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-sage-500" />
            <h3 className="font-serif text-sm font-bold text-sage-900 dark:text-sage-100">
              Recent Practice History
            </h3>
          </div>

          <div className="space-y-2">
            {recentSessions.map((s) => (
              <div
                key={s.id}
                onClick={() =>
                  navigate(
                    s.status === 'Completed'
                      ? `/practice/results/${s.id}`
                      : `/practice/session/${s.id}`
                  )
                }
                className="p-4 rounded-2xl bg-white dark:bg-dark-card border border-sage-200/60 dark:border-dark-border hover:border-forest/50 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-sage-900 dark:text-sage-100">
                      {s.title}
                    </span>
                    <Badge
                      variant={s.status === 'Completed' ? 'mint' : 'sage'}
                      className="text-[10px]"
                    >
                      {s.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-sage-500">
                    <span>{s.totalQuestions} Questions</span>
                    {s.status === 'Completed' && (
                      <>
                        <span>Score: {s.score}</span>
                        <span className="font-semibold text-forest dark:text-mint">
                          {s.accuracyPercentage}% Accuracy
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-forest dark:text-sage-300 font-medium">
                  {s.status === 'Completed' ? 'View Results' : 'Resume'}
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
