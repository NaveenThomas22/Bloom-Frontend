import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSyllabusOverview, useSyllabusManagement } from '../hooks/useSyllabus';
import { CustomItemModal } from '../components/CustomItemModal';
import { Button } from '@/components/ui/Button';
import {
  ChevronLeft,
  Plus,
  Trash2,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

export const SyllabusManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { data: overview, isLoading, refetch } = useSyllabusOverview();
  const management = useSyllabusManagement();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<{
    id: number;
    type: 'subject' | 'module' | 'topic' | 'subtopic';
    name: string;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6 text-left animate-in fade-in duration-300">
        <div className="h-6 bg-sage-200/50 dark:bg-dark-surface rounded w-32 animate-pulse" />
        <div className="h-32 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
        <div className="h-48 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
      </div>
    );
  }

  const customSubjects = overview?.subjects.filter((s) => s.isCustom) || [];

  const handleDelete = async () => {
    if (!deleteConfirmationId) return;

    try {
      if (deleteConfirmationId.type === 'subject') {
        await management.deleteSubject.mutateAsync(deleteConfirmationId.id);
      } else if (deleteConfirmationId.type === 'module') {
        await management.deleteModule.mutateAsync(deleteConfirmationId.id);
      } else if (deleteConfirmationId.type === 'topic') {
        await management.deleteTopic.mutateAsync(deleteConfirmationId.id);
      } else if (deleteConfirmationId.type === 'subtopic') {
        await management.deleteSubtopic.mutateAsync(deleteConfirmationId.id);
      }
      setDeleteConfirmationId(null);
      refetch();
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-sage-600 dark:text-sage-400 flex-wrap">
        <Link
          to="/study"
          className="inline-flex items-center gap-1 hover:text-forest dark:hover:text-sage-200 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Syllabus Sanctuary</span>
        </Link>
        <span>/</span>
        <span className="font-semibold text-sage-950 dark:text-sage-100">
          Manage Syllabus
        </span>
      </div>

      {/* Header & Explanatory Notice */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/80 dark:border-dark-border shadow-soft space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
              Customize Syllabus Structure
            </h1>
            <p className="text-xs text-sage-600 dark:text-sage-400">
              Personalize your CAT roadmap with custom study modules, niche topics, or custom subjects
            </p>
          </div>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs h-9 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Custom Item
          </Button>
        </div>

        {/* Protection Alert */}
        <div className="p-4 rounded-2xl bg-mint/30 dark:bg-dark-surface border border-mint/50 dark:border-dark-border flex items-start gap-3 text-xs">
          <ShieldCheck className="w-5 h-5 text-forest dark:text-mint flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-forest dark:text-sage-200">
              CAT Standard Catalog Protected
            </span>
            <p className="text-sage-700 dark:text-sage-400">
              Standard subjects (QA, DILR, VARC) and authoritative CAT topics are immutable shared standards. Any custom modules or topics you add are isolated strictly to your account and can be modified or removed here anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Custom Subjects Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
            Personal Custom Subjects
          </h2>
          <span className="text-xs text-sage-500">
            {customSubjects.length} Custom Subjects
          </span>
        </div>

        {customSubjects.length === 0 ? (
          <div className="p-6 rounded-3xl bg-white/60 dark:bg-dark-card/60 border border-sage-200/40 dark:border-dark-border text-center space-y-2">
            <p className="text-xs text-sage-600 dark:text-sage-400 italic">
              No custom subjects added. You are using the standard CAT syllabus (QA, DILR, VARC).
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="text-xs"
            >
              Add Custom Subject
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {customSubjects.map((subj) => (
              <div
                key={subj.id}
                className="p-4 rounded-2xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/70 dark:border-dark-border shadow-soft flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-mint/40 text-forest">
                      {subj.code}
                    </span>
                    <h3 className="font-semibold text-sage-950 dark:text-sage-100 text-sm">
                      {subj.name}
                    </h3>
                  </div>
                  {subj.description && (
                    <p className="text-xs text-sage-600 dark:text-sage-400">
                      {subj.description}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/study/subject/${subj.id}`)}
                    className="text-xs h-8"
                  >
                    View
                  </Button>
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteConfirmationId({
                        id: subj.id,
                        type: 'subject',
                        name: subj.name,
                      })
                    }
                    className="p-1.5 rounded-lg text-sage-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                    aria-label={`Delete subject ${subj.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmationId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white dark:bg-dark-card border border-sage-200 dark:border-dark-border shadow-soft-lg p-6 space-y-4 text-left">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
                Delete Custom Item?
              </h3>
            </div>
            <p className="text-xs text-sage-600 dark:text-sage-400">
              Are you sure you want to delete &quot;{deleteConfirmationId.name}&quot;? All child modules, topics, and progress records under it will be permanently removed.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteConfirmationId(null)}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-rose-600 hover:bg-rose-700 text-white border-rose-600"
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Item Modal */}
      <CustomItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        subjects={overview?.subjects || []}
      />
    </div>
  );
};
