import React, { useState } from 'react';
import { useSyllabusManagement } from '../hooks/useSyllabus';
import type { DifficultyLevel, ImportanceLevel, SubjectSummary, ModuleDetail, TopicSummary } from '@/types/syllabus';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { X } from 'lucide-react';

export type CustomItemType = 'subject' | 'module' | 'topic' | 'subtopic';

export interface CustomItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: CustomItemType;
  subjects?: SubjectSummary[];
  modules?: ModuleDetail[];
  topics?: TopicSummary[];
  preselectedSubjectId?: number;
  preselectedModuleId?: number;
  preselectedTopicId?: number;
}

export const CustomItemModal: React.FC<CustomItemModalProps> = ({
  isOpen,
  onClose,
  initialType = 'topic',
  subjects = [],
  modules = [],
  topics = [],
  preselectedSubjectId,
  preselectedModuleId,
  preselectedTopicId,
}) => {
  const [itemType, setItemType] = useState<CustomItemType>(initialType);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState<number>(preselectedSubjectId || subjects[0]?.id || 0);
  const [moduleId, setModuleId] = useState<number>(preselectedModuleId || modules[0]?.id || 0);
  const [topicId, setTopicId] = useState<number>(preselectedTopicId || topics[0]?.id || 0);
  const [estimatedHours, setEstimatedHours] = useState('4');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('Medium');
  const [importance, setImportance] = useState<ImportanceLevel>('High');
  const [error, setError] = useState<string | null>(null);

  const management = useSyllabusManagement();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (itemType === 'subject') {
        if (!code.trim() || !name.trim()) {
          setError('Code and Name are required');
          return;
        }
        await management.createSubject.mutateAsync({
          code: code.trim().toUpperCase(),
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else if (itemType === 'module') {
        if (!subjectId || !name.trim()) {
          setError('Subject and Module Name are required');
          return;
        }
        await management.createModule.mutateAsync({
          subjectId: Number(subjectId),
          name: name.trim(),
          description: description.trim() || undefined,
        });
      } else if (itemType === 'topic') {
        if (!moduleId || !name.trim()) {
          setError('Module and Topic Name are required');
          return;
        }
        await management.createTopic.mutateAsync({
          moduleId: Number(moduleId),
          name: name.trim(),
          description: description.trim() || undefined,
          estimatedStudyHours: Number(estimatedHours) || 4,
          difficultyLevel: difficulty,
          importanceLevel: importance,
        });
      } else if (itemType === 'subtopic') {
        if (!topicId || !name.trim()) {
          setError('Topic and Subtopic Name are required');
          return;
        }
        await management.createSubtopic.mutateAsync({
          topicId: Number(topicId),
          name: name.trim(),
          description: description.trim() || undefined,
        });
      }

      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create custom item';
      setError(message);
    }
  };

  const isSubmitting =
    management.createSubject.isPending ||
    management.createModule.isPending ||
    management.createTopic.isPending ||
    management.createSubtopic.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-dark-card border border-sage-200 dark:border-dark-border shadow-soft-lg p-6 space-y-5 text-left">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-sage-950 dark:text-sage-100">
            Add Custom Syllabus Item
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-sage-400 hover:text-sage-700 dark:hover:text-sage-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose/40 text-rose-dark text-xs border border-rose/60">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Item Level"
            value={itemType}
            onChange={(e) => setItemType(e.target.value as CustomItemType)}
            options={[
              { value: 'topic', label: 'Topic (Under Module)' },
              { value: 'subtopic', label: 'Subtopic (Under Topic)' },
              { value: 'module', label: 'Module (Under Subject)' },
              { value: 'subject', label: 'Subject (Top Level)' },
            ]}
          />

          {itemType === 'subject' && (
            <>
              <Input
                label="Subject Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. GK, ESSAY"
                required
              />
              <Input
                label="Subject Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. General Knowledge & Current Affairs"
                required
              />
            </>
          )}

          {itemType === 'module' && (
            <>
              <Select
                label="Parent Subject"
                value={subjectId}
                onChange={(e) => setSubjectId(Number(e.target.value))}
                required
                options={subjects.map((s) => ({
                  value: s.id,
                  label: `${s.code} — ${s.name}`,
                }))}
              />
              <Input
                label="Module Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Advanced Permutations & Combinations"
                required
              />
            </>
          )}

          {itemType === 'topic' && (
            <>
              <Select
                label="Parent Module"
                value={moduleId}
                onChange={(e) => setModuleId(Number(e.target.value))}
                required
                options={modules.map((m) => ({
                  value: m.id,
                  label: m.name,
                }))}
              />
              <Input
                label="Topic Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Circular Permutations & Derangements"
                required
              />
              <div className="grid grid-cols-3 gap-2">
                <Input
                  label="Est. Hours"
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                />
                <Select
                  label="Difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
                  options={[
                    { value: 'Easy', label: 'Easy' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Hard', label: 'Hard' },
                  ]}
                />
                <Select
                  label="Importance"
                  value={importance}
                  onChange={(e) => setImportance(e.target.value as ImportanceLevel)}
                  options={[
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'High', label: 'High' },
                  ]}
                />
              </div>
            </>
          )}

          {itemType === 'subtopic' && (
            <>
              <Select
                label="Parent Topic"
                value={topicId}
                onChange={(e) => setTopicId(Number(e.target.value))}
                required
                options={topics.map((t) => ({
                  value: t.id,
                  label: t.name,
                }))}
              />
              <Input
                label="Subtopic Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Derangements Formula & Problems"
                required
              />
            </>
          )}

          <Input
            label="Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Key syllabus objectives or focus areas"
          />

          <div className="flex justify-end gap-3 pt-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
