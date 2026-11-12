import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Sparkles, ChevronRight, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { reflectionsApi } from '@/lib/api/reflectionsApi';
import type { DailyReflection, ReflectionMood, WeeklyReflectionSummary } from '@/types/reflections';

export const ReflectionsDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [reflection, setReflection] = useState<DailyReflection | null>(null);
  const [moods, setMoods] = useState<ReflectionMood[]>([]);
  const [summary, setSummary] = useState<WeeklyReflectionSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [moodList, refData, sumData] = await Promise.all([
          reflectionsApi.getMoods(),
          reflectionsApi.getReflectionByDate(selectedDate),
          reflectionsApi.getWeeklySummary(selectedDate),
        ]);
        setMoods(moodList);
        setReflection(refData);
        setSummary(sumData);
      } catch (err) {
        // Handled gracefully
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedDate]);

  const hasMorning = Boolean(reflection?.morningCompletedAtUtc);
  const hasEvening = Boolean(reflection?.eveningCompletedAtUtc);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-forest dark:text-sage-100 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            Daily Reflections
          </h1>
          <p className="text-xs text-sage-600 dark:text-dark-muted mt-0.5">
            Morning clarity, evening reflection, and mindful emotional resilience
          </p>
        </div>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border text-xs text-sage-800 dark:text-dark-text shadow-soft-sm focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-sage-500">
          <Loader2 className="w-7 h-7 animate-spin mb-2 text-sage-400" />
          <p className="text-xs">Cultivating your reflections...</p>
        </div>
      ) : (
        <>
          {/* Today's Two Ritual Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Morning Intention Card */}
            <div
              onClick={() => navigate('/reflections/morning')}
              className="p-5 rounded-3xl bg-gradient-to-br from-amber-50/80 to-white/90 dark:from-amber-950/20 dark:to-dark-surface border border-amber-200/60 dark:border-amber-900/30 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-forest dark:text-sage-100">
                      Morning Intention
                    </h3>
                    <p className="text-[11px] text-sage-600 dark:text-dark-muted">
                      Start your day with clarity & focus
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold">
                  {hasMorning ? (
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400">
                      <Circle className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-sage-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {hasMorning && reflection ? (
                <div className="mt-4 pt-3 border-t border-amber-200/40 dark:border-amber-900/20 text-xs space-y-1.5 text-sage-800 dark:text-dark-text">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{reflection.morningMoodEmoji || '☀️'}</span>
                    <span className="font-semibold">{reflection.morningMoodName}</span>
                    <span className="text-sage-500 text-[11px]">Energy: {reflection.morningEnergyLevel}/5</span>
                  </div>
                  {reflection.todayIntention && (
                    <p className="text-[11px] text-sage-700 dark:text-dark-muted line-clamp-2 italic">
                      "{reflection.todayIntention}"
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-[11px] text-sage-600 dark:text-dark-muted">
                  Set your daily focus, top 3 priorities, and study targets for today.
                </p>
              )}
            </div>

            {/* Evening Reflection Card */}
            <div
              onClick={() => navigate('/reflections/evening')}
              className="p-5 rounded-3xl bg-gradient-to-br from-indigo-50/80 to-white/90 dark:from-indigo-950/20 dark:to-dark-surface border border-indigo-200/60 dark:border-indigo-900/30 shadow-soft-sm hover:shadow-soft-md cursor-pointer transition-all active:scale-[0.99] group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-forest dark:text-sage-100">
                      Evening Reflection
                    </h3>
                    <p className="text-[11px] text-sage-600 dark:text-dark-muted">
                      Review progress, breakthroughs & gratitude
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-semibold">
                  {hasEvening ? (
                    <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-indigo-700 dark:text-indigo-400">
                      <Circle className="w-4 h-4" />
                      Pending
                    </span>
                  )}
                  <ChevronRight className="w-4 h-4 text-sage-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>

              {hasEvening && reflection ? (
                <div className="mt-4 pt-3 border-t border-indigo-200/40 dark:border-indigo-900/20 text-xs space-y-1.5 text-sage-800 dark:text-dark-text">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{reflection.eveningMoodEmoji || '🌙'}</span>
                    <span className="font-semibold">{reflection.eveningMoodName}</span>
                    <span className="text-sage-500 text-[11px]">Rating: {reflection.satisfactionRating}/5 ★</span>
                  </div>
                  {reflection.whatAccomplished && (
                    <p className="text-[11px] text-sage-700 dark:text-dark-muted line-clamp-2">
                      {reflection.whatAccomplished}
                    </p>
                  )}
                </div>
              ) : (
                <p className="mt-4 text-[11px] text-sage-600 dark:text-dark-muted">
                  Log your evening debrief, mock takeaways, and practice gratitude.
                </p>
              )}
            </div>
          </div>

          {/* Weekly Mood & Consistency Summary */}
          {summary && (
            <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
              <h3 className="font-serif font-bold text-sm text-forest dark:text-sage-100 flex items-center justify-between">
                <span>Weekly Reflection Summary</span>
                <span className="text-xs font-normal text-sage-500">
                  {summary.startOfWeek} to {summary.endOfWeek}
                </span>
              </h3>

              <div className="grid grid-cols-4 gap-2 pt-1 text-center">
                <div className="p-2.5 rounded-2xl bg-ivory-100 dark:bg-dark-bg">
                  <div className="text-[10px] text-sage-500">Morning</div>
                  <div className="text-lg font-bold font-serif text-forest dark:text-sage-200">
                    {summary.morningReflectionsCount} / 7
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-ivory-100 dark:bg-dark-bg">
                  <div className="text-[10px] text-sage-500">Evening</div>
                  <div className="text-lg font-bold font-serif text-forest dark:text-sage-200">
                    {summary.eveningReflectionsCount} / 7
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-ivory-100 dark:bg-dark-bg">
                  <div className="text-[10px] text-sage-500">Avg Satisfaction</div>
                  <div className="text-lg font-bold font-serif text-amber-600 dark:text-amber-400">
                    {summary.averageSatisfactionRating ? `${summary.averageSatisfactionRating} ★` : '—'}
                  </div>
                </div>
                <div className="p-2.5 rounded-2xl bg-ivory-100 dark:bg-dark-bg">
                  <div className="text-[10px] text-sage-500">Avg Energy</div>
                  <div className="text-lg font-bold font-serif text-emerald-600 dark:text-emerald-400">
                    {summary.averageMorningEnergy ? `${summary.averageMorningEnergy} / 5` : '—'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seeded Mood Spectrum */}
          <div className="p-4 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-2">
            <h4 className="text-xs font-serif font-bold text-forest dark:text-sage-200">Available Mood Compass</h4>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-1">
              {moods.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-1.5 p-2 rounded-xl bg-ivory-100/70 dark:bg-dark-bg text-xs"
                >
                  <span className="text-base">{m.emoji}</span>
                  <span className="text-[11px] font-medium text-sage-800 dark:text-dark-text truncate">
                    {m.moodName}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
