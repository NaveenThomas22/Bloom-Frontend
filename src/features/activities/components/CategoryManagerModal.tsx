import React, { useState } from 'react';
import {
  useActivityCategories,
  useCreateCategory,
  useDeleteCategory,
} from '../hooks/useActivities';
import type { CreateCategoryDto } from '@/types/activity';
import { Tag, Plus, Trash2, X, AlertCircle, Shield } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { data: categories = [] } = useActivityCategories(true);
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [group, setGroup] = useState('Personal');
  const [color, setColor] = useState('#8FA893');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!code.trim() || !name.trim()) {
      setError('Category code and name are required.');
      return;
    }

    try {
      const dto: CreateCategoryDto = {
        categoryCode: code.trim().toUpperCase(),
        categoryName: name.trim(),
        categoryGroup: group,
        color,
        description: description.trim() || undefined,
        icon: 'activity',
      };
      await createCategory.mutateAsync(dto);
      setCode('');
      setName('');
      setDescription('');
      setIsAdding(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to create category.');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to deactivate category "${name}"?`)) {
      try {
        await deleteCategory.mutateAsync(id);
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Failed to delete category.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sage-950/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg max-h-[85vh] flex flex-col bg-white dark:bg-dark-card rounded-3xl shadow-soft-xl border border-sage-200/80 dark:border-dark-border text-left overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-sage-200/60 dark:border-dark-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-2xl bg-forest/10 text-forest dark:text-sage-300">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-sage-950 dark:text-sage-100">
                Activity Categories
              </h3>
              <p className="text-xs text-sage-500 dark:text-dark-muted">
                Standard life spheres & personal custom activities
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-sage-400 hover:text-sage-700 hover:bg-sage-100 dark:hover:bg-dark-surface"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {error && (
            <div className="p-3 rounded-2xl bg-rose/15 border border-rose/30 text-rose-dark flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Add Category Trigger / Form */}
          {!isAdding ? (
            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-sage-300 dark:border-dark-border text-forest dark:text-sage-300 hover:bg-sage-50 dark:hover:bg-dark-surface font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Activity Category</span>
            </button>
          ) : (
            <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-ivory-100 dark:bg-dark-surface border border-sage-200 dark:border-dark-border space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sage-900 dark:text-sage-100">New Category</span>
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="text-sage-400 hover:text-sage-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-medium text-sage-700 dark:text-sage-300">Code (Unique)</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="e.g. YOGA"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card font-mono text-xs uppercase"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-sage-700 dark:text-sage-300">Display Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Morning Yoga"
                    className="w-full px-2.5 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <label className="font-medium text-sage-700 dark:text-sage-300">Sphere / Group</label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs"
                  >
                    <option value="Study">Study</option>
                    <option value="RestAndSleep">Rest & Sleep</option>
                    <option value="MealsAndBreaks">Meals & Breaks</option>
                    <option value="Personal">Personal Care & Routine</option>
                    <option value="WorkAndCommute">Work & Commute</option>
                    <option value="HealthAndFitness">Health & Fitness</option>
                    <option value="LeisureAndSocial">Leisure & Social</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-medium text-sage-700 dark:text-sage-300">Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full px-2 py-1 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-sage-700 dark:text-sage-300">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Notes about this activity..."
                  className="w-full px-2.5 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border bg-white dark:bg-dark-card text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-3 py-1.5 rounded-xl border border-sage-200 dark:border-dark-border"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createCategory.isPending}
                  className="px-4 py-1.5 rounded-xl bg-forest hover:bg-forest-dark text-ivory font-semibold shadow-soft-sm active:scale-95"
                >
                  {createCategory.isPending ? 'Saving...' : 'Add Category'}
                </button>
              </div>
            </form>
          )}

          {/* List of categories */}
          <div className="space-y-2">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="p-3 rounded-2xl bg-white dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0 shadow-soft-sm"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sage-950 dark:text-sage-100 truncate">
                        {cat.categoryName}
                      </span>
                      <span className="font-mono text-[10px] text-sage-500 uppercase">
                        {cat.categoryCode}
                      </span>
                    </div>
                    <div className="text-[11px] text-sage-500 dark:text-dark-muted">
                      {cat.categoryGroup} {cat.description ? `· ${cat.description}` : ''}
                    </div>
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-1.5">
                  {!cat.isCustom ? (
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] bg-sage-100 dark:bg-dark-card text-sage-600 dark:text-dark-muted flex items-center gap-1"
                      title="Shared System Default"
                    >
                      <Shield className="w-3 h-3" />
                      Default
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id, cat.categoryName)}
                      className="p-1.5 rounded-xl text-sage-400 hover:text-rose-dark hover:bg-rose/10 transition-colors"
                      title="Deactivate Custom Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
