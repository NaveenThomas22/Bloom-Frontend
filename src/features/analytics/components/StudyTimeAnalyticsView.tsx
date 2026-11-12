import React from 'react';
import { Clock, Sun, Sunrise, Sunset, Moon, TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { DailyStudyTrendDto, TimeOfDayDistributionDto } from '@/types/analytics';

interface StudyTimeAnalyticsProps {
  trends?: DailyStudyTrendDto[];
  timeOfDay?: TimeOfDayDistributionDto[];
  isLoading: boolean;
}

export const StudyTimeAnalyticsView: React.FC<StudyTimeAnalyticsProps> = ({ trends = [], timeOfDay = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-sage-500 animate-pulse">
        Loading Study Time Trends...
      </div>
    );
  }

  const totalPeriodHours = trends.reduce((acc, curr) => acc + curr.studyHours, 0);
  const avgHoursPerDay = trends.length > 0 ? (totalPeriodHours / trends.length).toFixed(1) : '0';

  const chartData = trends.map((t) => ({
    date: t.date,
    total: t.studyHours,
    qa: t.qaHours,
    dilr: t.dilrHours,
    varc: t.varcHours,
    other: t.otherHours,
  }));

  const getBlockIcon = (block: string) => {
    if (block.toLowerCase().includes('morning')) return <Sunrise className="w-5 h-5 text-amber-500" />;
    if (block.toLowerCase().includes('afternoon')) return <Sun className="w-5 h-5 text-amber-600" />;
    if (block.toLowerCase().includes('evening')) return <Sunset className="w-5 h-5 text-rose-500" />;
    return <Moon className="w-5 h-5 text-indigo-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Overview Stat Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-sage-600 dark:text-dark-muted">Total Study in Period</span>
            <div className="text-2xl font-serif font-bold text-sage-950 dark:text-sage-100">
              {totalPeriodHours.toFixed(1)} hrs
            </div>
          </div>
          <Clock className="w-8 h-8 text-forest/40 dark:text-sage-400/40" />
        </div>

        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-sage-600 dark:text-dark-muted">Daily Average</span>
            <div className="text-2xl font-serif font-bold text-sage-950 dark:text-sage-100">
              {avgHoursPerDay} hrs / day
            </div>
          </div>
          <TrendingUp className="w-8 h-8 text-forest/40 dark:text-sage-400/40" />
        </div>
      </div>

      {/* Daily Study Time Trend Chart */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-forest dark:text-sage-300" />
            Daily Study Time Progression (Hours)
          </h4>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-forest" /> QA</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-sage-400" /> DILR</span>
            <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-mint-dark" /> VARC</span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1D2521',
                  borderColor: '#33423A',
                  color: '#F8F5EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Area type="monotone" dataKey="qa" name="QA Hours" stackId="1" stroke="#405B49" fill="#405B49" fillOpacity={0.8} />
              <Area type="monotone" dataKey="dilr" name="DILR Hours" stackId="1" stroke="#A8BDA5" fill="#A8BDA5" fillOpacity={0.8} />
              <Area type="monotone" dataKey="varc" name="VARC Hours" stackId="1" stroke="#B8CDB5" fill="#B8CDB5" fillOpacity={0.8} />
              <Area type="monotone" dataKey="other" name="Other CAT" stackId="1" stroke="#E9C9C5" fill="#E9C9C5" fillOpacity={0.8} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Study Time of Day Distribution */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted">
          Peak Study Rhythm by Time of Day
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {timeOfDay.map((item) => (
            <div
              key={item.timeBlock}
              className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border space-y-2 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-medium text-sage-700 dark:text-dark-muted">{item.timeBlock}</span>
                {getBlockIcon(item.timeBlock)}
              </div>
              <div>
                <div className="text-lg font-bold font-serif text-sage-950 dark:text-sage-100">
                  {item.studyHours} hrs
                </div>
                <div className="text-[10px] text-sage-500 dark:text-dark-muted">
                  {item.activityCount} study sessions
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

