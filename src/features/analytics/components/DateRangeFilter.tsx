import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { AnalyticsFilterRequest } from '@/types/analytics';

interface DateRangeFilterProps {
  filter: AnalyticsFilterRequest;
  onChange: (filter: AnalyticsFilterRequest) => void;
}

const PRESETS: Array<{ label: string; value: AnalyticsFilterRequest['timeRange'] }> = [
  { label: 'Today', value: 'Today' },
  { label: '7 Days', value: 'Last7Days' },
  { label: '30 Days', value: 'Last30Days' },
  { label: 'This Month', value: 'ThisMonth' },
  { label: 'Last Month', value: 'LastMonth' },
  { label: 'All Time', value: 'AllTime' },
  { label: 'Custom', value: 'Custom' },
];

export const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ filter, onChange }) => {
  const handlePresetSelect = (timeRange: AnalyticsFilterRequest['timeRange']) => {
    onChange({
      ...filter,
      timeRange,
    });
  };

  const handleCustomDateChange = (field: 'startDate' | 'endDate', val: string) => {
    onChange({
      ...filter,
      timeRange: 'Custom',
      [field]: val,
    });
  };

  return (
    <div className="bg-white/80 dark:bg-dark-card/80 backdrop-blur-sm border border-sage-200/60 dark:border-dark-border p-3 rounded-2xl shadow-soft-sm space-y-3">
      {/* Preset Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <Clock className="w-4 h-4 text-forest dark:text-sage-300 shrink-0 ml-1 mr-1" />
        {PRESETS.map((p) => {
          const isActive = filter.timeRange === p.value;
          return (
            <button
              key={p.value}
              type="button"
              onClick={() => handlePresetSelect(p.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-sage-50 dark:bg-dark-surface text-sage-700 dark:text-dark-muted hover:bg-sage-100 dark:hover:bg-dark-border'
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom Date Inputs if Custom is selected */}
      {filter.timeRange === 'Custom' && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-sage-100 dark:border-dark-border">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-3.5 h-3.5 text-sage-500" />
            <label className="text-sage-700 dark:text-dark-muted font-medium">From:</label>
            <input
              type="date"
              value={filter.startDate || ''}
              onChange={(e) => handleCustomDateChange('startDate', e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-900 dark:text-sage-100"
            />
          </div>
          <div className="flex items-center gap-2 text-xs">
            <label className="text-sage-700 dark:text-dark-muted font-medium">To:</label>
            <input
              type="date"
              value={filter.endDate || ''}
              onChange={(e) => handleCustomDateChange('endDate', e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-900 dark:text-sage-100"
            />
          </div>
        </div>
      )}
    </div>
  );
};

