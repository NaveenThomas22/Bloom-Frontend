import React, { useEffect, useState } from 'react';
import { Award, Compass, Plus, RefreshCw, CheckCircle2, Loader2, Trash2 } from 'lucide-react';
import { habitsApi } from '@/lib/api/habitsApi';
import type { MilestoneOverview, CreateMilestoneRequest } from '@/types/habits';

export const MindsetPage: React.FC = () => {
  const [overview, setOverview] = useState<MilestoneOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('STUDY_HOURS');
  const [targetValue, setTargetValue] = useState<number>(50);
  const [unit, setUnit] = useState('hours');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const data = await habitsApi.getMilestoneOverview();
      setOverview(data);
    } catch (err) {
      // Handled gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSyncProgress = async () => {
    try {
      setIsSyncing(true);
      setSyncFeedback(null);
      await habitsApi.syncMilestones();
      setSyncFeedback(`Successfully synchronized live progress across your CAT preparation.`);
      loadData();
    } catch (err) {
      setSyncFeedback('Unable to synchronize milestone progress.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCreateMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const payload: CreateMilestoneRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      targetValue,
      unit: unit.trim(),
    };

    try {
      await habitsApi.createMilestone(payload);
      setIsModalOpen(false);
      setTitle('');
      setDescription('');
      loadData();
    } catch (err) {
      alert('Failed to create milestone.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this personal milestone?')) return;
    try {
      await habitsApi.deleteMilestone(id);
      loadData();
    } catch (err) {
      alert('Failed to delete milestone.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest dark:text-sage-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            Mindset & Milestones
          </h1>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-0.5">
            Personal growth, big-picture CAT milestones, and resilience metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncProgress}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-sage-200/60 dark:border-dark-border text-sage-700 dark:text-dark-muted bg-white/80 dark:bg-dark-surface text-xs font-semibold hover:text-forest active:scale-95 transition-all shadow-soft-sm"
            title="Recalculate milestone progress from study logs, questions, and mock tests"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-forest dark:bg-sage-600 text-white text-xs font-semibold hover:bg-forest/90 active:scale-95 transition-all shadow-soft-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Milestone</span>
          </button>
        </div>
      </div>

      {syncFeedback && (
        <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-4 gap-2.5">
          <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm text-center">
            <div className="text-[10px] font-medium text-sage-600 dark:text-dark-muted">Total</div>
            <div className="text-xl font-bold font-serif text-forest dark:text-sage-100 mt-0.5">
              {overview.totalMilestones}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm text-center">
            <div className="text-[10px] font-medium text-sage-600 dark:text-dark-muted">Achieved</div>
            <div className="text-xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-0.5">
              {overview.achievedCount}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm text-center">
            <div className="text-[10px] font-medium text-sage-600 dark:text-dark-muted">In Progress</div>
            <div className="text-xl font-bold font-serif text-amber-600 dark:text-amber-400 mt-0.5">
              {overview.inProgressCount}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm text-center">
            <div className="text-[10px] font-medium text-sage-600 dark:text-dark-muted">Avg Progress</div>
            <div className="text-xl font-bold font-serif text-forest dark:text-sage-100 mt-0.5">
              {overview.overallProgressPercentage}%
            </div>
          </div>
        </div>
      )}

      {/* Milestone List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-sage-500">
          <Loader2 className="w-7 h-7 animate-spin mb-2 text-sage-400" />
          <p className="text-xs">Gathering milestones...</p>
        </div>
      ) : !overview || overview.milestones.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white/60 dark:bg-dark-surface border border-dashed border-sage-300">
          <Award className="w-10 h-10 mx-auto text-sage-400/80 mb-2" />
          <h3 className="font-serif font-bold text-forest dark:text-sage-200 text-sm">No Milestones Planted</h3>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-1 max-w-xs mx-auto">
            Set ambitious targets like "Solve 500 Questions", "Complete 50 Study Hours", or "Take 10 Mocks".
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-forest text-white text-xs font-semibold hover:bg-forest/90"
          >
            <Plus className="w-4 h-4" />
            <span>Create Milestone</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {overview.milestones.map((m) => {
            const isAchieved = m.status === 'Achieved';

            return (
              <div
                key={m.id}
                className="p-4 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-sage-100 dark:bg-dark-bg text-forest dark:text-sage-300">
                        {m.category}
                      </span>
                      {isAchieved ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Achieved
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
                          In Progress
                        </span>
                      )}
                    </div>

                    <h3 className="font-serif font-bold text-sm text-forest dark:text-sage-100">{m.title}</h3>
                    {m.description && (
                      <p className="text-[11px] text-sage-600 dark:text-dark-muted mt-0.5">{m.description}</p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1 text-sage-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-sage-600 dark:text-dark-muted">
                    <span>
                      {m.currentValue} / {m.targetValue} {m.unit}
                    </span>
                    <span className="font-semibold text-forest dark:text-sage-200">{m.progressPercentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-sage-100 dark:bg-dark-border overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isAchieved ? 'bg-emerald-600' : 'bg-forest dark:bg-sage-400'
                      }`}
                      style={{ width: `${Math.min(100, m.progressPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-dark-surface p-6 rounded-3xl border border-sage-200/80 dark:border-dark-border shadow-soft-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-forest dark:text-sage-100">Plant New Milestone</h3>

            <form onSubmit={handleCreateMilestone} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">
                  Milestone Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Complete 50 Hours of Arithmetic Practice"
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">
                  Tracking Category
                </label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    if (e.target.value === 'STUDY_HOURS') setUnit('hours');
                    if (e.target.value === 'QUESTIONS_SOLVED') setUnit('questions');
                    if (e.target.value === 'TOPICS_MASTERED') setUnit('topics');
                    if (e.target.value === 'MOCK_TESTS') setUnit('mocks');
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                >
                  <option value="STUDY_HOURS">Study Hours (auto-synced)</option>
                  <option value="QUESTIONS_SOLVED">Questions Solved (auto-synced)</option>
                  <option value="TOPICS_MASTERED">Topics Mastered (auto-synced)</option>
                  <option value="MOCK_TESTS">Mock Tests Submitted (auto-synced)</option>
                  <option value="GENERAL">Custom / General Goal</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Target</label>
                  <input
                    type="number"
                    min={1}
                    value={targetValue}
                    onChange={(e) => setTargetValue(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Unit</label>
                  <input
                    type="text"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional context or milestone significance"
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-sage-200 text-xs font-semibold text-sage-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest/90"
                >
                  {isSubmitting ? 'Planting...' : 'Plant Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
