import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Save, Loader2, Star, Heart } from 'lucide-react';
import { reflectionsApi } from '@/lib/api/reflectionsApi';
import type { ReflectionMood, SaveEveningReflectionRequest } from '@/types/reflections';

export const EveningReflectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [reflectionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [moods, setMoods] = useState<ReflectionMood[]>([]);
  const [selectedMoodId, setSelectedMoodId] = useState<number>(2); // Calm or first
  const [moodIntensity, setMoodIntensity] = useState<number>(4);
  const [satisfactionRating, setSatisfactionRating] = useState<number>(4);

  const [howWasToday, setHowWasToday] = useState('');
  const [whatAccomplished, setWhatAccomplished] = useState('');
  const [whatWentWell, setWhatWentWell] = useState('');
  const [couldHaveBeenBetter, setCouldHaveBeenBetter] = useState('');
  const [whatLearnedToday, setWhatLearnedToday] = useState('');
  const [whatChallengedMe, setWhatChallengedMe] = useState('');
  const [improveTomorrow, setImproveTomorrow] = useState('');
  const [gratitudeEntry, setGratitudeEntry] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [moodList, existingRef] = await Promise.all([
          reflectionsApi.getMoods(),
          reflectionsApi.getReflectionByDate(reflectionDate),
        ]);
        setMoods(moodList);
        if (moodList.length > 0 && !selectedMoodId) {
          setSelectedMoodId(moodList[0].id);
        }

        if (existingRef && existingRef.eveningMoodId) {
          setSelectedMoodId(existingRef.eveningMoodId);
          setMoodIntensity(existingRef.eveningMoodIntensity || 4);
          setSatisfactionRating(existingRef.satisfactionRating || 4);
          setHowWasToday(existingRef.howWasToday || '');
          setWhatAccomplished(existingRef.whatAccomplished || '');
          setWhatWentWell(existingRef.whatWentWell || '');
          setCouldHaveBeenBetter(existingRef.couldHaveBeenBetter || '');
          setWhatLearnedToday(existingRef.whatLearnedToday || '');
          setWhatChallengedMe(existingRef.whatChallengedMe || '');
          setImproveTomorrow(existingRef.improveTomorrow || '');
          setGratitudeEntry(existingRef.gratitudeEntry || '');
        }
      } catch (err) {
        // Handled gracefully
      } finally {
        setIsLoading(false);
      }
    };

    fetchInit();
  }, [reflectionDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage(null);

    const payload: SaveEveningReflectionRequest = {
      reflectionDate,
      eveningMoodId: selectedMoodId,
      eveningMoodIntensity: moodIntensity,
      howWasToday: howWasToday.trim() || undefined,
      whatAccomplished: whatAccomplished.trim() || undefined,
      whatWentWell: whatWentWell.trim() || undefined,
      couldHaveBeenBetter: couldHaveBeenBetter.trim() || undefined,
      whatLearnedToday: whatLearnedToday.trim() || undefined,
      whatChallengedMe: whatChallengedMe.trim() || undefined,
      satisfactionRating: satisfactionRating || undefined,
      improveTomorrow: improveTomorrow.trim() || undefined,
      gratitudeEntry: gratitudeEntry.trim() || undefined,
    };

    try {
      await reflectionsApi.saveEveningReflection(payload);
      navigate('/reflections');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to save evening reflection.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-sage-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-sage-400" />
        <p className="text-xs font-serif">Preparing evening sanctuary...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/reflections')}
          className="flex items-center gap-1 text-xs text-sage-600 dark:text-dark-muted hover:text-forest transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Reflections</span>
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-forest dark:bg-sage-600 text-white text-xs font-semibold hover:bg-forest/90 active:scale-95 transition-all shadow-soft-sm"
        >
          {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          <span>Save Debrief</span>
        </button>
      </div>

      <div>
        <h1 className="text-xl font-serif font-bold text-forest dark:text-sage-100 flex items-center gap-2">
          <Moon className="w-6 h-6 text-indigo-500" />
          Evening Reflection & Gratitude
        </h1>
        <p className="text-xs text-sage-600 dark:text-dark-muted mt-0.5">
          Unwind, examine your triumphs and learnings, and close your day with appreciation
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
          {errorMessage}
        </div>
      )}

      {/* Mood Compass Selection */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <label className="block text-xs font-serif font-bold text-forest dark:text-sage-100">
          How do you feel at the end of this day?
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {moods.map((m) => {
            const isSelected = selectedMoodId === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setSelectedMoodId(m.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${isSelected
                    ? 'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-400 text-indigo-900 dark:text-indigo-200 shadow-soft-sm scale-105'
                    : 'bg-ivory-100/60 dark:bg-dark-bg border-sage-200/50 dark:border-dark-border text-sage-700 dark:text-dark-muted hover:border-sage-400'
                  }`}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-[11px] font-semibold">{m.moodName}</span>
              </button>
            );
          })}
        </div>

        {/* Rating and Intensity */}
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-sage-100 dark:border-dark-border">
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">
              <span>Mood Intensity</span>
              <span>{moodIntensity} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={moodIntensity}
              onChange={(e) => setMoodIntensity(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">
              Day Satisfaction
            </div>
            <div className="flex items-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setSatisfactionRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${satisfactionRating >= star
                        ? 'text-amber-500 fill-amber-500'
                        : 'text-sage-300 dark:text-dark-muted'
                      }`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Review Fields */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <div>
          <label className="block text-xs font-semibold text-sage-700 dark:text-dark-muted mb-1">
            What did you accomplish today?
          </label>
          <textarea
            value={whatAccomplished}
            onChange={(e) => setWhatAccomplished(e.target.value)}
            rows={2}
            placeholder="e.g. Completed Arithmetic module, solved 2 RC passages, hit 3.5 study hours."
            className="w-full p-3 rounded-2xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-sage-700 dark:text-dark-muted mb-1">
              What went well?
            </label>
            <textarea
              value={whatWentWell}
              onChange={(e) => setWhatWentWell(e.target.value)}
              rows={2}
              placeholder="e.g. Stayed calm during tricky DILR sets."
              className="w-full p-2.5 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-sage-700 dark:text-dark-muted mb-1">
              What could have been better?
            </label>
            <textarea
              value={couldHaveBeenBetter}
              onChange={(e) => setCouldHaveBeenBetter(e.target.value)}
              rows={2}
              placeholder="e.g. Spent too long stuck on one geometry question."
              className="w-full p-2.5 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-sage-700 dark:text-dark-muted mb-1">
            Key Learning / Mindset Shift
          </label>
          <input
            type="text"
            value={whatLearnedToday}
            onChange={(e) => setWhatLearnedToday(e.target.value)}
            placeholder="e.g. Eliminate 2 options first in RC before evaluating nuances."
            className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
          />
        </div>
      </div>

      {/* Gratitude & Growth Card */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <div>
          <label className="block text-xs font-serif font-bold text-forest dark:text-sage-100 mb-1 flex items-center gap-1.5">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Gratitude & Appreciation
          </label>
          <textarea
            value={gratitudeEntry}
            onChange={(e) => setGratitudeEntry(e.target.value)}
            rows={2}
            placeholder="Name 2 or 3 things you are grateful for today (support from family, good health, a focused hour)..."
            className="w-full p-3 rounded-2xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-sage-700 dark:text-dark-muted mb-1">
            How will you improve tomorrow?
          </label>
          <input
            type="text"
            value={improveTomorrow}
            onChange={(e) => setImproveTomorrow(e.target.value)}
            placeholder="e.g. Begin first study session immediately at 8:00 AM."
            className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
          />
        </div>
      </div>
    </form>
  );
};
