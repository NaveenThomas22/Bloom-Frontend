import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Sun, Save, Loader2 } from 'lucide-react';
import { reflectionsApi } from '@/lib/api/reflectionsApi';
import type { ReflectionMood, SaveMorningReflectionRequest } from '@/types/reflections';

export const MorningReflectionPage: React.FC = () => {
  const navigate = useNavigate();
  const [reflectionDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [moods, setMoods] = useState<ReflectionMood[]>([]);
  const [selectedMoodId, setSelectedMoodId] = useState<number>(3); // Default Motivated or first
  const [moodIntensity, setMoodIntensity] = useState<number>(4);
  const [energyLevel, setEnergyLevel] = useState<number>(4);

  const [todayIntention, setTodayIntention] = useState('');
  const [mainPriority, setMainPriority] = useState('');
  const [taskOne, setTaskOne] = useState('');
  const [taskTwo, setTaskTwo] = useState('');
  const [taskThree, setTaskThree] = useState('');
  const [studyTargetMinutes, setStudyTargetMinutes] = useState<number>(180);
  const [personalCommitment, setPersonalCommitment] = useState('');
  const [morningNotes, setMorningNotes] = useState('');

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

        if (existingRef && existingRef.morningMoodId) {
          setSelectedMoodId(existingRef.morningMoodId);
          setMoodIntensity(existingRef.morningMoodIntensity || 3);
          setEnergyLevel(existingRef.morningEnergyLevel || 3);
          setTodayIntention(existingRef.todayIntention || '');
          setMainPriority(existingRef.mainPriority || '');
          setTaskOne(existingRef.taskOne || '');
          setTaskTwo(existingRef.taskTwo || '');
          setTaskThree(existingRef.taskThree || '');
          setStudyTargetMinutes(existingRef.studyTargetMinutes || 180);
          setPersonalCommitment(existingRef.personalCommitment || '');
          setMorningNotes(existingRef.morningNotes || '');
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
    if (!todayIntention.trim()) {
      setErrorMessage('Please state your intention for today.');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    const payload: SaveMorningReflectionRequest = {
      reflectionDate,
      morningMoodId: selectedMoodId,
      morningMoodIntensity: moodIntensity,
      morningEnergyLevel: energyLevel,
      todayIntention: todayIntention.trim(),
      mainPriority: mainPriority.trim() || undefined,
      taskOne: taskOne.trim() || undefined,
      taskTwo: taskTwo.trim() || undefined,
      taskThree: taskThree.trim() || undefined,
      studyTargetMinutes: studyTargetMinutes || undefined,
      personalCommitment: personalCommitment.trim() || undefined,
      morningNotes: morningNotes.trim() || undefined,
    };

    try {
      await reflectionsApi.saveMorningReflection(payload);
      navigate('/reflections');
    } catch (err: any) {
      setErrorMessage(err?.response?.data?.message || 'Failed to save morning reflection.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-sage-500">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-sage-400" />
        <p className="text-xs font-serif">Awakening your morning sanctuary...</p>
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
          <span>Save Intention</span>
        </button>
      </div>

      <div>
        <h1 className="text-xl font-serif font-bold text-forest dark:text-sage-100 flex items-center gap-2">
          <Sun className="w-6 h-6 text-amber-500" />
          Morning Intention & Focus
        </h1>
        <p className="text-xs text-sage-600 dark:text-dark-muted mt-0.5">
          Start your CAT day with high energy, intentional commitments, and disciplined focus
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
          How are you feeling this morning?
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {moods.map((m) => {
            const isSelected = selectedMoodId === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setSelectedMoodId(m.id)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-400 text-amber-900 dark:text-amber-200 shadow-soft-sm scale-105'
                    : 'bg-ivory-100/60 dark:bg-dark-bg border-sage-200/50 dark:border-dark-border text-sage-700 dark:text-dark-muted hover:border-sage-400'
                }`}
              >
                <span className="text-2xl mb-1">{m.emoji}</span>
                <span className="text-[11px] font-semibold">{m.moodName}</span>
              </button>
            );
          })}
        </div>

        {/* Intensity and Energy Sliders */}
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
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">
              <span>Energy Level</span>
              <span>{energyLevel} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={energyLevel}
              onChange={(e) => setEnergyLevel(Number(e.target.value))}
              className="w-full accent-forest dark:accent-sage-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Intention & Priority Card */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <div>
          <label className="block text-xs font-serif font-bold text-forest dark:text-sage-100 mb-1">
            Today's Core Intention <span className="text-rose-500">*</span>
          </label>
          <textarea
            value={todayIntention}
            onChange={(e) => setTodayIntention(e.target.value)}
            rows={2}
            placeholder="e.g. Approach modern algebra with patience, not speed. Embrace mistakes as stepping stones."
            className="w-full p-3 rounded-2xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-sage-700 dark:text-dark-muted mb-1">
            Single Main Priority
          </label>
          <input
            type="text"
            value={mainPriority}
            onChange={(e) => setMainPriority(e.target.value)}
            placeholder="e.g. Master Time, Speed & Distance Formula Set #3"
            className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-sage-400"
          />
        </div>
      </div>

      {/* 3 Key Tasks */}
      <div className="p-5 rounded-3xl bg-white/80 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-2">
        <label className="block text-xs font-serif font-bold text-forest dark:text-sage-100 mb-1">
          Top 3 Non-Negotiable Tasks
        </label>
        <div className="space-y-2">
          <input
            type="text"
            value={taskOne}
            onChange={(e) => setTaskOne(e.target.value)}
            placeholder="1. Complete 20 QA questions on Arithmetic"
            className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
          />
          <input
            type="text"
            value={taskTwo}
            onChange={(e) => setTaskTwo(e.target.value)}
            placeholder="2. Read and analyze 2 Aeon essays for VARC"
            className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
          />
          <input
            type="text"
            value={taskThree}
            onChange={(e) => setTaskThree(e.target.value)}
            placeholder="3. Review scheduled spaced repetition flashcards"
            className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Study Target (mins)</label>
            <input
              type="number"
              value={studyTargetMinutes}
              onChange={(e) => setStudyTargetMinutes(Number(e.target.value))}
              min={15}
              max={720}
              className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-sage-700 dark:text-dark-muted mb-1">Personal Commitment</label>
            <input
              type="text"
              value={personalCommitment}
              onChange={(e) => setPersonalCommitment(e.target.value)}
              placeholder="e.g. Put phone in another room during study"
              className="w-full px-3 py-2 rounded-xl bg-ivory-100 dark:bg-dark-bg border border-sage-200/60 dark:border-dark-border text-xs text-sage-900 dark:text-dark-text focus:outline-none"
            />
          </div>
        </div>
      </div>
    </form>
  );
};
