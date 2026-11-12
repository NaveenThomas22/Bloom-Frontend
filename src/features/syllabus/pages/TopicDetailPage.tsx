import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  useTopicDetail,
  useUpdateTopicProgress,
  useUpdateSubtopicProgress,
} from '../hooks/useSyllabus';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { ResourceList } from '../components/ResourceList';
import { CustomItemModal } from '../components/CustomItemModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { LearningStatus, TopicPriority } from '@/types/syllabus';
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Save,
  Star,
} from 'lucide-react';

export const TopicDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const topicId = Number(id);

  const { data: topicDetail, isLoading, error } = useTopicDetail(topicId);
  const updateTopicProgress = useUpdateTopicProgress(topicId);

  // Local state for interactive controls
  const [status, setStatus] = useState<LearningStatus>('NotStarted');
  const [priority, setPriority] = useState<TopicPriority>('Medium');
  const [targetDate, setTargetDate] = useState<string>('');
  const [confidenceRating, setConfidenceRating] = useState<number>(0);
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [isSubtopicModalOpen, setIsSubtopicModalOpen] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Populate local form state when topicDetail loads
  useEffect(() => {
    if (topicDetail) {
      setStatus(topicDetail.topic.status);
      setPriority(topicDetail.topic.priority);
      setTargetDate(
        topicDetail.topic.targetDate
          ? new Date(topicDetail.topic.targetDate).toISOString().split('T')[0]
          : ''
      );
      setConfidenceRating(topicDetail.topic.confidenceRating || 0);
      setPersonalNotes(topicDetail.topic.personalNotes || '');
    }
  }, [topicDetail]);

  if (isLoading) {
    return (
      <div className="space-y-6 text-left animate-in fade-in duration-300">
        <div className="h-6 bg-sage-200/50 dark:bg-dark-surface rounded w-48 animate-pulse" />
        <div className="h-48 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
        <div className="h-64 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
      </div>
    );
  }

  if (error || !topicDetail) {
    return (
      <div className="p-8 rounded-3xl bg-rose/20 border border-rose/40 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-dark mx-auto" />
        <h3 className="font-serif text-lg font-bold text-rose-dark">
          Topic Not Found
        </h3>
        <p className="text-xs text-sage-600 dark:text-sage-400">
          The requested syllabus topic could not be retrieved.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/study')}>
          Back to Syllabus
        </Button>
      </div>
    );
  }

  const { topic, moduleName, subjectName, subjectCode, subtopics, resources } =
    topicDetail;

  const handleSaveProgress = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      await updateTopicProgress.mutateAsync({
        status,
        priority,
        targetDate: targetDate ? new Date(targetDate).toISOString() : null,
        confidenceRating,
        personalNotes: personalNotes.trim() || null,
        isCustomExcluded: topic.isCustomExcluded,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch {
      // Error handled by react-query
    }
  };

  const completedSubtopicsCount = subtopics.filter((s) => s.isCompleted).length;

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-sage-600 dark:text-sage-400 flex-wrap">
        <Link
          to="/study"
          className="hover:text-forest dark:hover:text-sage-200 transition-colors"
        >
          Syllabus
        </Link>
        <span>/</span>
        <span className="hover:text-forest dark:hover:text-sage-200 transition-colors">
          {subjectCode} ({subjectName})
        </span>
        <span>/</span>
        <span className="text-sage-700 dark:text-sage-300">{moduleName}</span>
        <span>/</span>
        <span className="font-semibold text-sage-950 dark:text-sage-100">
          {topic.name}
        </span>
      </div>

      {/* Topic Overview Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/80 dark:border-dark-border shadow-soft space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-mint/40 text-forest border border-mint/60">
                {subjectCode}
              </span>
              <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
                {topic.name}
              </h1>
              {topic.isCustom && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sage-200 dark:bg-dark-surface text-forest dark:text-sage-300 border border-sage-300/60 dark:border-dark-border">
                  Custom
                </span>
              )}
            </div>
            {topic.description && (
              <p className="text-xs text-sage-600 dark:text-sage-400 max-w-2xl">
                {topic.description}
              </p>
            )}
          </div>
          <StatusBadge status={status} />
        </div>

        {/* Quick topic metadata bar */}
        <div className="flex items-center gap-3 flex-wrap text-xs pt-3 border-t border-sage-100 dark:border-dark-border/60">
          <PriorityBadge priority={priority} />

          <span className="px-2 py-0.5 rounded-md text-[11px] font-medium border bg-sage-100/70 dark:bg-dark-surface text-sage-800 dark:text-sage-300 border-sage-200 dark:border-dark-border">
            Difficulty: {topic.difficultyLevel}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] text-sage-600 dark:text-sage-400">
            <Clock className="w-3.5 h-3.5 text-sage-500" />
            Estimated: {topic.estimatedStudyHours} hrs
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] text-sage-600 dark:text-sage-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-forest dark:text-mint" />
            Subtopics: {completedSubtopicsCount}/{subtopics.length}
          </span>
        </div>
      </div>

      {/* Interactive Progress & Learning Controls */}
      <div className="p-5 sm:p-6 rounded-3xl bg-sage-50/60 dark:bg-dark-card/90 border border-sage-200/80 dark:border-dark-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
            Track Learning Progress
          </h3>
          {saveSuccess && (
            <span className="inline-flex items-center gap-1 text-xs text-forest dark:text-mint font-semibold animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4" />
              Saved to Sanctuary!
            </span>
          )}
        </div>

        <form onSubmit={handleSaveProgress} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Select
              label="Learning Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as LearningStatus)}
              options={[
                { value: 'NotStarted', label: 'Not Started' },
                { value: 'Learning', label: 'Learning (Theory)' },
                { value: 'Practicing', label: 'Practicing (Problem Sets)' },
                { value: 'Completed', label: 'Completed' },
                { value: 'RevisionDue', label: 'Revision Due' },
                { value: 'Mastered', label: 'Mastered' },
              ]}
            />

            <Select
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value as TopicPriority)}
              options={[
                { value: 'Low', label: 'Low' },
                { value: 'Medium', label: 'Medium' },
                { value: 'High', label: 'High' },
                { value: 'Urgent', label: 'Urgent' },
              ]}
            />

            <Input
              label="Target Completion Date"
              type="date"
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
            />
          </div>

          {/* Confidence Rating Stars */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-sage-800 dark:text-sage-200">
              Personal Confidence Rating
            </label>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setConfidenceRating(star === confidenceRating ? 0 : star)}
                  className="p-2 min-w-[36px] min-h-[36px] flex items-center justify-center rounded-xl hover:bg-sage-100 dark:hover:bg-dark-surface transition-colors"
                  aria-label={`Rate confidence ${star} of 5`}
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= confidenceRating
                        ? 'fill-amber-400 text-amber-500'
                        : 'text-sage-300 dark:text-sage-600'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-sage-500 dark:text-sage-400 ml-2">
                {confidenceRating > 0
                  ? `${confidenceRating}/5 Stars`
                  : 'Not rated yet'}
              </span>
            </div>
          </div>

          {/* Personal Notes */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-sage-800 dark:text-sage-200">
              Personal Study Notes & Key Formulas
            </label>
            <textarea
              rows={4}
              value={personalNotes}
              onChange={(e) => setPersonalNotes(e.target.value)}
              placeholder="Record tricky edge cases, shortcuts, formula reminders, and recurring traps..."
              className="w-full rounded-2xl p-3 text-xs bg-white dark:bg-dark-card border border-sage-200 dark:border-dark-border text-sage-950 dark:text-sage-100 placeholder:text-sage-400 focus:outline-none focus:ring-2 focus:ring-forest/30 dark:focus:ring-sage-400/30 transition-all resize-y"
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={updateTopicProgress.isPending}
              size="sm"
              className="gap-1.5 text-xs"
            >
              <Save className="w-4 h-4" />
              {updateTopicProgress.isPending ? 'Saving...' : 'Update Progress'}
            </Button>
          </div>
        </form>
      </div>

      {/* Subtopics Checklist Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/80 dark:border-dark-border shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
              Subtopics Checklist
            </h3>
            <p className="text-xs text-sage-600 dark:text-sage-400">
              {completedSubtopicsCount} of {subtopics.length} subtopics mastered
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSubtopicModalOpen(true)}
            className="text-xs h-8"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Subtopic
          </Button>
        </div>

        {subtopics.length === 0 ? (
          <p className="text-xs text-sage-500 italic py-2">
            No subtopics defined for this topic. Click &quot;Add Subtopic&quot; to break it down.
          </p>
        ) : (
          <div className="space-y-2">
            {subtopics.map((subtopic) => (
              <SubtopicItem
                key={subtopic.id}
                subtopic={subtopic}
                topicId={topicId}
              />
            ))}
          </div>
        )}
      </div>

      {/* Learning Resources & Books Section */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/80 dark:border-dark-border shadow-soft">
        <ResourceList topicId={topicId} resources={resources} />
      </div>

      {/* Modal to add subtopic */}
      <CustomItemModal
        isOpen={isSubtopicModalOpen}
        onClose={() => setIsSubtopicModalOpen(false)}
        initialType="subtopic"
        topics={[topic]}
        preselectedTopicId={topic.id}
      />
    </div>
  );
};

// Subtopic Checkbox Item
interface SubtopicItemProps {
  subtopic: {
    id: number;
    name: string;
    description: string | null;
    isCompleted: boolean;
    completedAtUtc: string | null;
    isCustom: boolean;
  };
  topicId: number;
}

const SubtopicItem: React.FC<SubtopicItemProps> = ({ subtopic, topicId }) => {
  const updateSubtopic = useUpdateSubtopicProgress(subtopic.id, topicId);

  const handleToggle = () => {
    updateSubtopic.mutate({
      isCompleted: !subtopic.isCompleted,
    });
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleToggle();
        }
      }}
      className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center justify-between gap-3 text-xs ${
        subtopic.isCompleted
          ? 'bg-mint/20 dark:bg-forest/20 border-mint/60 dark:border-forest/40'
          : 'bg-white/80 dark:bg-dark-card/80 border-sage-200/70 dark:border-dark-border hover:bg-sage-50/60'
      }`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={subtopic.isCompleted}
          onChange={(e) => {
            e.stopPropagation();
            handleToggle();
          }}
          onClick={(e) => e.stopPropagation()}
          className="w-4 h-4 rounded text-forest focus:ring-forest cursor-pointer"
          aria-label={`Mark ${subtopic.name} as completed`}
        />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span
              className={`font-medium ${
                subtopic.isCompleted
                  ? 'line-through text-sage-500 dark:text-sage-400'
                  : 'text-sage-950 dark:text-sage-100'
              }`}
            >
              {subtopic.name}
            </span>
            {subtopic.isCustom && (
              <span className="text-[10px] text-forest dark:text-sage-300">
                (Custom)
              </span>
            )}
          </div>
          {subtopic.description && (
            <p className="text-[11px] text-sage-500 dark:text-sage-400">
              {subtopic.description}
            </p>
          )}
        </div>
      </div>

      {subtopic.completedAtUtc && (
        <span className="text-[10px] text-sage-500 dark:text-sage-400 tabular-nums flex-shrink-0">
          {new Date(subtopic.completedAtUtc).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          })}
        </span>
      )}
    </div>
  );
};
