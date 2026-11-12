import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { HeartPulse, CheckSquare, Clock } from 'lucide-react';
import type { LifeCategoryDistributionDto, PlanAdherenceDto, LifeAccountingDayDto } from '@/types/analytics';

interface LifeManagementProps {
  distribution?: LifeCategoryDistributionDto[];
  adherence?: PlanAdherenceDto;
  accounting?: LifeAccountingDayDto;
  isLoading: boolean;
}

const DEFAULT_COLORS = ['#405B49', '#A8BDA5', '#6C8569', '#E9C9C5', '#DCE9D9', '#E9E0D1', '#546B52', '#8DA58A'];

export const LifeManagementView: React.FC<LifeManagementProps> = ({
  distribution = [],
  adherence,
  accounting,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-sage-500 animate-pulse">
        Loading 24-Hour Life Balance Analytics...
      </div>
    );
  }

  const pieData = distribution.map((d, index) => ({
    name: d.categoryName,
    group: d.categoryGroup,
    value: d.totalHours,
    percentage: d.percentage,
    color: d.color && d.color.startsWith('#') ? d.color : DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      {/* 24-Hour Life Balance Donut & Breakdown */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-forest dark:text-sage-300" />
            24-Hour Life Category Distribution
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Donut Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1D2521',
                    borderColor: '#33423A',
                    color: '#F8F5EB',
                    borderRadius: '12px',
                    fontSize: '12px',
                  }}
                  formatter={(value: any, name: any, item: any) => [`${value} hrs (${item.payload.percentage}%)`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Category List */}
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {distribution.map((cat, idx) => (
              <div
                key={cat.categoryName + idx}
                className="flex items-center justify-between p-2 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color || DEFAULT_COLORS[idx % DEFAULT_COLORS.length] }}
                  />
                  <div>
                    <span className="font-semibold text-sage-900 dark:text-sage-100">{cat.categoryName}</span>
                    <span className="text-[10px] text-sage-500 dark:text-dark-muted ml-1.5">({cat.categoryGroup})</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-sage-950 dark:text-sage-100">{cat.totalHours} hrs</span>
                  <span className="text-[10px] text-sage-500 dark:text-dark-muted ml-1">({cat.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Plan Adherence & Daily Accounting Balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Plan Adherence Card */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 text-forest dark:text-sage-300">
            <CheckSquare className="w-4 h-4" />
            <h4 className="font-serif font-bold text-sm text-sage-950 dark:text-sage-100">
              Schedule & Plan Adherence
            </h4>
          </div>

          {adherence ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-sage-600 dark:text-dark-muted">Adherence Rate</span>
                <span className="text-lg font-bold font-serif text-forest dark:text-sage-300">
                  {adherence.adherenceRatePercentage}%
                </span>
              </div>
              <div className="w-full bg-sage-100 dark:bg-dark-surface h-2 rounded-full overflow-hidden">
                <div
                  className="bg-forest dark:bg-sage-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, adherence.adherenceRatePercentage)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-sage-100 dark:border-dark-border text-center">
                <div className="p-2 rounded-xl bg-sage-50 dark:bg-dark-surface">
                  <div className="text-[10px] text-sage-500">Planned Hours</div>
                  <div className="text-xs font-bold text-sage-900 dark:text-sage-200">{adherence.totalPlannedHours} hrs</div>
                </div>
                <div className="p-2 rounded-xl bg-sage-50 dark:bg-dark-surface">
                  <div className="text-[10px] text-sage-500">Actual Hours</div>
                  <div className="text-xs font-bold text-sage-900 dark:text-sage-200">{adherence.totalActualHours} hrs</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-sage-500 py-2">No planned activity adherence data recorded yet.</p>
          )}
        </div>

        {/* 24-Hour Day Accounting Card */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 text-forest dark:text-sage-300">
            <Clock className="w-4 h-4" />
            <h4 className="font-serif font-bold text-sm text-sage-950 dark:text-sage-100">
              Today's 24-Hour Balance
            </h4>
          </div>

          {accounting ? (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-3 rounded-xl bg-mint/30 dark:bg-dark-surface">
                  <div className="text-[10px] text-sage-600 dark:text-dark-muted font-medium">Logged Activities</div>
                  <div className="text-lg font-bold font-serif text-forest dark:text-sage-200">
                    {accounting.accountedHours} hrs
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-sage-50 dark:bg-dark-surface">
                  <div className="text-[10px] text-sage-600 dark:text-dark-muted font-medium">Untracked / Rest</div>
                  <div className="text-lg font-bold font-serif text-sage-800 dark:text-sage-300">
                    {accounting.untrackedHours} hrs
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-sage-500 dark:text-dark-muted text-center pt-1">
                Calendar day base: {accounting.calendarDayHours} hours (DST compliant local window)
              </div>
            </div>
          ) : (
            <p className="text-xs text-sage-500 py-2">Accounting data for current day loading...</p>
          )}
        </div>
      </div>
    </div>
  );
};

