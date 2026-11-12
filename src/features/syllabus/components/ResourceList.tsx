import React, { useState } from 'react';
import type { ResourceType, SyllabusResource } from '@/types/syllabus';
import { useCreateResource, useDeleteResource } from '../hooks/useSyllabus';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { BookOpen, Video, FileText, CheckCircle, ExternalLink, Plus, Trash2 } from 'lucide-react';

export interface ResourceListProps {
  topicId: number;
  resources: SyllabusResource[];
}

export const ResourceList: React.FC<ResourceListProps> = ({ topicId, resources }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('Article');
  const [url, setUrl] = useState('');
  const [notes, setNotes] = useState('');

  const createResource = useCreateResource(topicId);
  const deleteResource = useDeleteResource(topicId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await createResource.mutateAsync({
      title: title.trim(),
      resourceType,
      url: url.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setUrl('');
    setNotes('');
    setShowAddForm(false);
  };

  const resourceIcons: Record<ResourceType, React.ReactNode> = {
    Article: <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
    Video: <Video className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
    Book: <BookOpen className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
    PracticeSet: <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
    Other: <FileText className="w-4 h-4 text-sage-600 dark:text-sage-400" />,
  };

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between">
        <h4 className="font-serif text-base font-bold text-sage-950 dark:text-sage-100">
          Learning Resources & Material
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-xs py-1 px-2.5 h-auto"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          {showAddForm ? 'Cancel' : 'Add Resource'}
        </Button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-2xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-200 dark:border-dark-border space-y-3"
        >
          <div className="space-y-2">
            <Input
              label="Resource Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Arun Sharma - Quantitative Aptitude Chapter 2"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Select
                label="Type"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceType)}
                options={[
                  { value: 'Article', label: 'Article / Notes' },
                  { value: 'Video', label: 'Video Lecture' },
                  { value: 'Book', label: 'Book Reference' },
                  { value: 'PracticeSet', label: 'Practice Question Set' },
                  { value: 'Other', label: 'Other' },
                ]}
              />
              <Input
                label="URL (Optional)"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            <Input
              label="Personal Notes (Optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Key concepts, page numbers, or tips"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={createResource.isPending || !title.trim()}
            >
              {createResource.isPending ? 'Saving...' : 'Save Resource'}
            </Button>
          </div>
        </form>
      )}

      {resources.length === 0 ? (
        <p className="text-xs text-sage-500 dark:text-sage-400 italic py-2">
          No resources added yet. Add books, video links, or reference sheets above.
        </p>
      ) : (
        <div className="space-y-2">
          {resources.map((res) => (
            <div
              key={res.id}
              className="p-3 rounded-xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/60 dark:border-dark-border flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex items-start gap-2.5">
                <span className="p-1 rounded-md bg-sage-50 dark:bg-dark-surface mt-0.5">
                  {resourceIcons[res.resourceType] || resourceIcons.Other}
                </span>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-semibold text-sage-900 dark:text-sage-100">
                      {res.title}
                    </span>
                    <span className="text-[10px] text-sage-500 uppercase px-1.5 py-0.2 rounded bg-sage-100 dark:bg-dark-surface">
                      {res.resourceType}
                    </span>
                    {res.isCustom && (
                      <span className="text-[10px] text-forest dark:text-sage-300 font-medium">
                        (Personal)
                      </span>
                    )}
                  </div>
                  {res.notes && (
                    <p className="text-sage-600 dark:text-sage-400 text-[11px]">
                      {res.notes}
                    </p>
                  )}
                  {res.url && (
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-forest dark:text-sage-300 hover:underline text-[11px] font-medium pt-0.5"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>

              {res.isCustom && (
                <button
                  type="button"
                  onClick={() => deleteResource.mutate(res.id)}
                  disabled={deleteResource.isPending}
                  className="p-1 rounded text-sage-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                  aria-label="Delete resource"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
