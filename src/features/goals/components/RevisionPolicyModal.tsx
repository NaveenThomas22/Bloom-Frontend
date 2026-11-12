import React, { useState } from 'react';
import { X, Settings2, Plus, Trash2, ShieldCheck, Loader2 } from 'lucide-react';
import {
  useRevisionPolicies,
  useCreateRevisionPolicy,
  useDeleteRevisionPolicy,
} from '../hooks/useGoals';

interface RevisionPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RevisionPolicyModal: React.FC<RevisionPolicyModalProps> = ({ isOpen, onClose }) => {
  const { data: policies, isLoading } = useRevisionPolicies();
  const createPolicyMutation = useCreateRevisionPolicy();
  const deletePolicyMutation = useDeleteRevisionPolicy();

  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [intervalsCsv, setIntervalsCsv] = useState('1,3,7,14,30');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Policy name is required.');
      return;
    }
    if (!intervalsCsv.trim()) {
      setError('Intervals are required.');
      return;
    }

    try {
      await createPolicyMutation.mutateAsync({
        policyName: name.trim(),
        description: description.trim() || undefined,
        intervalsCsv: intervalsCsv.trim(),
      });
      setName('');
      setDescription('');
      setIntervalsCsv('1,3,7,14,30');
      setIsAdding(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create revision policy.';
      setError(message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/80 dark:border-dark-border max-w-lg w-full p-6 shadow-soft-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-sage-100 dark:border-dark-border">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-forest text-ivory-100">
              <Settings2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold text-forest dark:text-sage-100">
                Spaced Repetition Policies
              </h3>
              <p className="text-xs text-sage-600 dark:text-dark-muted">
                Retention intervals and review algorithms
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-sage-400 hover:text-forest dark:hover:text-sage-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 rounded-2xl text-xs text-rose-700 dark:text-rose-300">
            {error}
          </div>
        )}

        {/* Existing Policies List */}
        <div className="mt-4 space-y-3">
          {isLoading ? (
            <div className="py-8 text-center text-xs text-sage-500">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-sage-400" />
              Loading repetition policies...
            </div>
          ) : (
            policies?.map((policy) => (
              <div
                key={policy.id}
                className="p-4 rounded-2xl border border-sage-200/60 dark:border-dark-border bg-ivory-100/60 dark:bg-dark-card flex items-start justify-between gap-3"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-serif text-sm font-semibold text-forest dark:text-sage-100 truncate">
                      {policy.policyName}
                    </h4>
                    {policy.isSystem ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold bg-sage-100 text-forest dark:bg-dark-surface dark:text-sage-300">
                        <ShieldCheck className="w-3 h-3 text-forest" /> System
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-mint/50 text-forest dark:bg-dark-surface dark:text-sage-200">
                        Custom
                      </span>
                    )}
                  </div>
                  {policy.description && (
                    <p className="text-xs text-sage-600 dark:text-dark-muted mb-2 line-clamp-2">
                      {policy.description}
                    </p>
                  )}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-medium text-sage-500 dark:text-dark-muted">
                      Intervals (Days):
                    </span>
                    {policy.intervals.map((intv, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-white dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border text-xs font-mono font-semibold text-forest dark:text-sage-200"
                      >
                        +{intv}d
                      </span>
                    ))}
                  </div>
                </div>

                {!policy.isSystem && (
                  <button
                    onClick={() => {
                      if (confirm('Delete this custom revision policy?')) {
                        deletePolicyMutation.mutate(policy.id);
                      }
                    }}
                    className="p-1.5 text-sage-400 hover:text-rose-600 rounded-lg transition-colors"
                    aria-label="Delete policy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Policy Form */}
        {isAdding ? (
          <form onSubmit={handleCreate} className="mt-4 p-4 rounded-2xl border border-sage-300 dark:border-dark-border bg-white dark:bg-dark-card space-y-3 text-xs">
            <h4 className="font-serif font-semibold text-forest dark:text-sage-100">
              Create Custom Revision Policy
            </h4>
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Policy Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ultra-Intensive Rapid Review"
                className="w-full px-3 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Target purpose and strategy"
                className="w-full px-3 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-surface text-sage-900 dark:text-sage-100 focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
            </div>
            <div>
              <label className="block font-medium text-sage-700 dark:text-sage-300 mb-1">
                Intervals (Comma-separated days) *
              </label>
              <input
                type="text"
                required
                value={intervalsCsv}
                onChange={(e) => setIntervalsCsv(e.target.value)}
                placeholder="1,3,7,14,30"
                className="w-full px-3 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-ivory-100 dark:bg-dark-surface text-sage-900 dark:text-sage-100 font-mono focus:outline-none focus:ring-2 focus:ring-sage-400"
              />
              <p className="text-[10px] text-sage-500 mt-1">
                Example: 1,2,4,7,15 (Step 1 scheduled in 1 day, Step 2 in 2 days, etc.)
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border text-sage-600 dark:text-sage-300 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createPolicyMutation.isPending}
                className="flex-1 py-1.5 rounded-xl bg-forest text-ivory-100 font-semibold shadow-soft-sm"
              >
                {createPolicyMutation.isPending ? 'Saving...' : 'Save Policy'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mt-4">
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 rounded-2xl border-2 border-dashed border-sage-300 dark:border-dark-border text-sage-700 dark:text-sage-300 font-medium hover:bg-sage-50 dark:hover:bg-dark-card flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> Add Custom Spaced Policy
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

