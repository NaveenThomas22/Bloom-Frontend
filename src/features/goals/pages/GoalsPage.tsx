import React, { useState } from 'react';
import { Target, Flag, Plus, Loader2 } from 'lucide-react';
import type { CreateGoalDto, CreateMilestoneDto, GoalPeriod, PreparationMilestone, UpdateGoalDto, UpdateMilestoneDto, UserGoal } from '@/types/goals';
import {
  useGoalDashboard,
  useCreateGoal,
  useUpdateGoal,
  useDeleteGoal,
  useMilestones,
  useCreateMilestone,
  useUpdateMilestone,
  useDeleteMilestone,
} from '../hooks/useGoals';
import { GoalCard } from '../components/GoalCard';
import { GoalFormModal } from '../components/GoalFormModal';
import { MilestoneCard } from '../components/MilestoneCard';
import { MilestoneFormModal } from '../components/MilestoneFormModal';

export const GoalsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Milestones'>('Daily');

  // Goals Queries & Mutations
  const isMilestonesTab = activeTab === 'Milestones';
  const goalPeriod = isMilestonesTab ? 'Daily' : (activeTab as GoalPeriod);

  const { data: dashboard, isLoading: goalsLoading } = useGoalDashboard(goalPeriod);
  const createGoalMutation = useCreateGoal();
  const updateGoalMutation = useUpdateGoal();
  const deleteGoalMutation = useDeleteGoal();

  // Milestones Queries & Mutations
  const { data: milestones, isLoading: milestonesLoading } = useMilestones();
  const createMilestoneMutation = useCreateMilestone();
  const updateMilestoneMutation = useUpdateMilestone();
  const deleteMilestoneMutation = useDeleteMilestone();

  // Modal States
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<UserGoal | null>(null);

  const [milestoneModalOpen, setMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<PreparationMilestone | null>(null);

  const handleGoalSubmit = async (data: CreateGoalDto | UpdateGoalDto) => {
    if (editingGoal) {
      await updateGoalMutation.mutateAsync({ id: editingGoal.id, data: data as UpdateGoalDto });
    } else {
      await createGoalMutation.mutateAsync(data as CreateGoalDto);
    }
  };

  const handleMilestoneSubmit = async (data: CreateMilestoneDto | UpdateMilestoneDto) => {
    if (editingMilestone) {
      await updateMilestoneMutation.mutateAsync({ id: editingMilestone.id, data: data as UpdateMilestoneDto });
    } else {
      await createMilestoneMutation.mutateAsync(data as CreateMilestoneDto);
    }
  };

  const handleToggleMilestone = async (m: PreparationMilestone) => {
    const nextStatus = m.status === 'Completed' ? 'Pending' : 'Completed';
    await updateMilestoneMutation.mutateAsync({
      id: m.id,
      data: {
        title: m.title,
        description: m.description,
        targetDate: m.targetDate,
        priority: m.priority,
        subjectId: m.subjectId,
        topicId: m.topicId,
        status: nextStatus,
      },
    });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-gradient-to-br from-forest to-forest/90 text-ivory-100 rounded-3xl p-5 shadow-soft-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-white/10 backdrop-blur-md">
              <Target className="w-5 h-5 text-mint" />
            </span>
            <div>
              <h2 className="font-serif text-xl font-bold tracking-tight">CAT Targets & Milestones</h2>
              <p className="text-xs text-sage-200">Cultivating steady preparation momentum</p>
            </div>
          </div>

          <button
            onClick={() => {
              if (activeTab === 'Milestones') {
                setEditingMilestone(null);
                setMilestoneModalOpen(true);
              } else {
                setEditingGoal(null);
                setGoalModalOpen(true);
              }
            }}
            className="px-3 py-2 rounded-2xl bg-ivory-100 text-forest text-xs font-semibold hover:bg-white active:scale-95 transition-all shadow-soft-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{activeTab === 'Milestones' ? 'New Milestone' : 'Set Target'}</span>
          </button>
        </div>

        {/* Aggregate Stats */}
        {!isMilestonesTab && dashboard && (
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/15">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 text-center">
              <span className="block text-[10px] text-sage-200 font-medium">Active Targets</span>
              <span className="font-serif text-lg font-bold">{dashboard.totalGoals}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 text-center">
              <span className="block text-[10px] text-sage-200 font-medium">Achieved</span>
              <span className="font-serif text-lg font-bold text-mint">{dashboard.achievedGoals}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 text-center">
              <span className="block text-[10px] text-sage-200 font-medium">Average Completion</span>
              <span className="font-serif text-lg font-bold">{dashboard.averageProgressPercentage.toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white/80 dark:bg-dark-surface rounded-2xl border border-sage-200/60 dark:border-dark-border shadow-soft-sm">
        {(['Daily', 'Weekly', 'Monthly', 'Milestones'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              activeTab === tab
                ? 'bg-forest text-ivory-100 font-semibold shadow-soft-sm'
                : 'text-sage-600 dark:text-dark-muted hover:text-forest dark:hover:text-sage-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {isMilestonesTab ? (
        <div className="space-y-3">
          {milestonesLoading ? (
            <div className="py-12 text-center text-xs text-sage-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sage-400" />
              Loading milestones...
            </div>
          ) : milestones && milestones.length > 0 ? (
            milestones.map((m) => (
              <MilestoneCard
                key={m.id}
                milestone={m}
                onToggleComplete={handleToggleMilestone}
                onEdit={(milestone) => {
                  setEditingMilestone(milestone);
                  setMilestoneModalOpen(true);
                }}
                onDelete={(id) => deleteMilestoneMutation.mutate(id)}
              />
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/60 dark:border-dark-border">
              <Flag className="w-8 h-8 text-sage-300 dark:text-sage-600 mx-auto mb-2 stroke-[1.5]" />
              <h4 className="font-serif text-base font-semibold text-forest dark:text-sage-200">
                No Milestones Defined
              </h4>
              <p className="text-xs text-sage-500 dark:text-dark-muted mt-1 max-w-xs mx-auto">
                Set milestones for major CAT milestones such as finishing arithmetic, completing RC passage targets, or starting mock exams.
              </p>
              <button
                onClick={() => {
                  setEditingMilestone(null);
                  setMilestoneModalOpen(true);
                }}
                className="mt-4 px-4 py-2 rounded-2xl bg-forest text-ivory-100 text-xs font-semibold hover:bg-forest/90 transition-colors shadow-soft-sm inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Create First Milestone
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {goalsLoading ? (
            <div className="py-12 text-center text-xs text-sage-500">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-sage-400" />
              Calculating live progress against activities...
            </div>
          ) : dashboard && dashboard.goals.length > 0 ? (
            dashboard.goals.map((goal) => (
              <GoalCard
                key={goal.id}
                goal={goal}
                onEdit={(g) => {
                  setEditingGoal(g);
                  setGoalModalOpen(true);
                }}
                onDelete={(id) => deleteGoalMutation.mutate(id)}
              />
            ))
          ) : (
            <div className="text-center py-12 px-4 bg-white dark:bg-dark-surface rounded-3xl border border-sage-200/60 dark:border-dark-border">
              <Target className="w-8 h-8 text-sage-300 dark:text-sage-600 mx-auto mb-2 stroke-[1.5]" />
              <h4 className="font-serif text-base font-semibold text-forest dark:text-sage-200">
                No {activeTab} Goals Set
              </h4>
              <p className="text-xs text-sage-500 dark:text-dark-muted mt-1 max-w-xs mx-auto">
                Define measurable study minute targets, topic completion goals, or question practice targets for this {activeTab.toLowerCase()} cycle.
              </p>
              <button
                onClick={() => {
                  setEditingGoal(null);
                  setGoalModalOpen(true);
                }}
                className="mt-4 px-4 py-2 rounded-2xl bg-forest text-ivory-100 text-xs font-semibold hover:bg-forest/90 transition-colors shadow-soft-sm inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Set {activeTab} Target
              </button>
            </div>
          )}
        </div>
      )}

      {/* Goal Form Modal */}
      <GoalFormModal
        isOpen={goalModalOpen}
        onClose={() => setGoalModalOpen(false)}
        onSubmit={handleGoalSubmit}
        editingGoal={editingGoal}
        defaultPeriod={activeTab === 'Milestones' ? 'Daily' : activeTab}
      />

      {/* Milestone Form Modal */}
      <MilestoneFormModal
        isOpen={milestoneModalOpen}
        onClose={() => setMilestoneModalOpen(false)}
        onSubmit={handleMilestoneSubmit}
        editingMilestone={editingMilestone}
      />
    </div>
  );
};

