import React, { useEffect, useState } from 'react';
import { CheckCircle2, Flame, Plus, Loader2, Circle, Trash2, Edit2, Calendar } from 'lucide-react';
import { habitsApi } from '@/lib/api/habitsApi';
import type { HabitCategory, HabitOverview, UserHabit, CreateHabitRequest } from '@/types/habits';

export const HabitsPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [overview, setOverview] = useState<HabitOverview | null>(null);
  const [categories, setCategories] = useState<HabitCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<UserHabit | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [frequency, setFrequency] = useState('Daily');
  const [targetValue, setTargetValue] = useState<number>(1);
  const [targetUnit, setTargetUnit] = useState('times');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [ov, cats] = await Promise.all([
        habitsApi.getOverview(selectedDate),
        habitsApi.getCategories(),
      ]);
      setOverview(ov);
      setCategories(cats);
      if (cats.length > 0 && !categoryId) {
        setCategoryId(cats[0].id);
      }
    } catch (err) {
      // Handled gracefully
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const handleToggleStatus = async (habitId: number, currentStatus?: string) => {
    try {
      if (currentStatus === 'Completed') {
        // Toggle to delete completion
        await habitsApi.deleteCompletion(habitId, selectedDate);
      } else {
        // Toggle to Completed
        await habitsApi.recordCompletion(habitId, {
          completionDate: selectedDate,
          status: 'Completed',
          actualValue: 1,
        });
      }
      loadData();
    } catch (err) {
      alert('Failed to update habit status.');
    }
  };

  const handleOpenModal = (habit?: UserHabit) => {
    if (habit) {
      setEditingHabit(habit);
      setName(habit.name);
      setDescription(habit.description || '');
      setCategoryId(habit.categoryId);
      setFrequency(habit.frequency);
      setTargetValue(habit.targetValue);
      setTargetUnit(habit.targetUnit);
    } else {
      setEditingHabit(null);
      setName('');
      setDescription('');
      setCategoryId(categories.length > 0 ? categories[0].id : 1);
      setFrequency('Daily');
      setTargetValue(1);
      setTargetUnit('times');
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const payload: CreateHabitRequest = {
      categoryId,
      name: name.trim(),
      description: description.trim() || undefined,
      frequency,
      targetFrequencyDays: frequency === 'Daily' ? 7 : 5,
      targetValue,
      targetUnit: targetUnit.trim(),
      startDate: selectedDate,
    };

    try {
      if (editingHabit) {
        await habitsApi.updateHabit(editingHabit.id, {
          ...payload,
          isActive: editingHabit.isActive,
        });
      } else {
        await habitsApi.createHabit(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save habit.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteHabit = async (habitId: number) => {
    if (!window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      await habitsApi.deleteHabit(habitId);
      loadData();
    } catch (err) {
      alert('Failed to delete habit.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest dark:text-sage-100 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            Habits & Discipline
          </h1>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-0.5">
            Consistent preparation rituals, daily momentum, and streak tracking
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-forest dark:bg-sage-600 text-white text-xs font-semibold hover:bg-forest/90 active:scale-95 transition-all shadow-soft-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* Date Selector & Overview Stats */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
        <div className="flex items-center gap-2 text-xs font-semibold text-forest dark:text-sage-200">
          <Calendar className="w-4 h-4 text-sage-500" />
          <span>Tracking for:</span>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-2.5 py-1 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
        />
      </div>

      {overview && (
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
            <div className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Today's Habits</div>
            <div className="text-xl font-bold font-serif text-forest dark:text-sage-100 mt-1">
              {overview.completedToday} / {overview.totalHabits}
            </div>
          </div>
          <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
            <div className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Completion Rate</div>
            <div className="text-xl font-bold font-serif text-emerald-600 dark:text-emerald-400 mt-1">
              {overview.todayCompletionRate}%
            </div>
          </div>
          <div className="bg-white/80 dark:bg-dark-surface p-3.5 rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
            <div className="text-[11px] font-medium text-sage-600 dark:text-dark-muted">Best Active Streak</div>
            <div className="text-xl font-bold font-serif text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-500" />
              {overview.currentBestStreak}d
            </div>
          </div>
        </div>
      )}

      {/* Habit List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-sage-500">
          <Loader2 className="w-7 h-7 animate-spin mb-2 text-sage-400" />
          <p className="text-xs">Gathering habits...</p>
        </div>
      ) : !overview || overview.habits.length === 0 ? (
        <div className="text-center py-12 px-4 rounded-3xl bg-white/60 dark:bg-dark-surface border border-dashed border-sage-300">
          <CheckCircle2 className="w-10 h-10 mx-auto text-sage-400/80 mb-2" />
          <h3 className="font-serif font-bold text-forest dark:text-sage-200 text-sm">No Habits Cultivated Yet</h3>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-1 max-w-xs mx-auto">
            Build consistency with daily study rituals, mock practice, and health routines.
          </p>
          <button
            onClick={() => handleOpenModal()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-forest text-white text-xs font-semibold hover:bg-forest/90"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Habit</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {overview.habits.map((habit) => {
            const isCompleted = habit.todayCompletion?.status === 'Completed';

            return (
              <div
                key={habit.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/60 dark:border-emerald-900/40'
                    : 'bg-white/80 dark:bg-dark-surface border-sage-200/60 dark:border-dark-border'
                } shadow-soft-sm flex items-center justify-between gap-3`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleToggleStatus(habit.id, habit.todayCompletion?.status)}
                    className="p-1 rounded-full text-sage-400 hover:scale-110 active:scale-95 transition-transform"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-900/40" />
                    ) : (
                      <Circle className="w-6 h-6 text-sage-400 hover:text-emerald-500" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-serif font-bold text-forest dark:text-sage-100">
                        {habit.name}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold"
                        style={{
                          backgroundColor: habit.categoryColor ? `${habit.categoryColor}25` : '#A8BDA525',
                          color: habit.categoryColor || '#405B49',
                        }}
                      >
                        {habit.categoryName || 'Habit'}
                      </span>
                    </div>

                    {habit.description && (
                      <p className="text-[11px] text-sage-600 dark:text-dark-muted mt-0.5">{habit.description}</p>
                    )}

                    <div className="flex items-center gap-3 text-[10px] text-sage-500 mt-1">
                      <span>Target: {habit.targetValue} {habit.targetUnit}</span>
                      <span>•</span>
                      <span>{habit.frequency}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-xs font-semibold">
                    <Flame className="w-3.5 h-3.5 fill-amber-500" />
                    <span>{habit.currentStreak}d</span>
                  </div>

                  <button
                    onClick={() => handleOpenModal(habit)}
                    className="p-1.5 rounded-lg text-sage-400 hover:text-forest transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteHabit(habit.id)}
                    className="p-1.5 rounded-lg text-sage-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Habit Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-white dark:bg-dark-surface p-6 rounded-3xl border border-sage-200/80 dark:border-dark-border shadow-soft-xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-forest dark:text-sage-100">
              {editingHabit ? 'Edit Habit' : 'Create New Habit'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">
                  Habit Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Daily 30m QA Practice"
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Target Value</label>
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
                    value={targetUnit}
                    onChange={(e) => setTargetUnit(e.target.value)}
                    placeholder="minutes / questions"
                    className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Frequency</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekdays">Weekdays</option>
                  <option value="Weekends">Weekends</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional brief notes or goal"
                  className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200 text-xs text-sage-900 dark:text-dark-text focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-sage-200 text-xs font-semibold text-sage-700 dark:text-dark-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-xl bg-forest text-white text-xs font-semibold hover:bg-forest/90"
                >
                  {isSubmitting ? 'Saving...' : 'Save Habit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
