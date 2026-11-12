import React from 'react';
import { Target, Award, Info } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { QuestionPracticeSummaryDto, MockTestAnalyticsDto } from '@/types/analytics';

interface QuestionAndMockProps {
  practice?: QuestionPracticeSummaryDto;
  mocks?: MockTestAnalyticsDto;
  isLoading: boolean;
}

export const QuestionAndMockView: React.FC<QuestionAndMockProps> = ({ practice, mocks, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-sage-500 animate-pulse">
        Loading Question Practice & Mock Test Analytics...
      </div>
    );
  }

  // Format mock trend data
  const mockTrendData = (mocks?.attempts || [])
    .slice()
    .reverse()
    .map((att) => {
      const qaScore = att.sectionScores.find((s) => s.sectionName.toUpperCase().includes('QA') || s.sectionName.toUpperCase().includes('QUANT'))?.score || 0;
      const dilrScore = att.sectionScores.find((s) => s.sectionName.toUpperCase().includes('DILR') || s.sectionName.toUpperCase().includes('DATA'))?.score || 0;
      const varcScore = att.sectionScores.find((s) => s.sectionName.toUpperCase().includes('VARC') || s.sectionName.toUpperCase().includes('VERBAL'))?.score || 0;

      return {
        name: att.examTitle.length > 15 ? att.examTitle.slice(0, 15) + '...' : att.examTitle,
        fullTitle: att.examTitle,
        totalScore: att.totalScore,
        qa: qaScore,
        dilr: dilrScore,
        varc: varcScore,
        accuracy: att.accuracyPercentage,
      };
    });

  return (
    <div className="space-y-6">
      {/* Question Practice Overview Cards */}
      {practice && (
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted flex items-center gap-2">
              <Target className="w-4 h-4 text-forest dark:text-sage-300" />
              Practice Question Engine Performance
            </h4>
            <span className="text-xs text-sage-500 dark:text-dark-muted">
              {practice.totalSessions} sessions completed
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {/* MCQ Accuracy */}
            <div className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border">
              <div className="text-[10px] text-sage-500">MCQ Accuracy</div>
              <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
                {practice.mcqAccuracy}%
              </div>
              <div className="text-[10px] text-sage-500 mt-0.5">
                {practice.mcqCorrect} / {practice.mcqAttempted} items
              </div>
            </div>

            {/* TITA Accuracy */}
            <div className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border">
              <div className="text-[10px] text-sage-500">TITA (Non-MCQ) Accuracy</div>
              <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
                {practice.titaAccuracy}%
              </div>
              <div className="text-[10px] text-sage-500 mt-0.5">
                {practice.titaCorrect} / {practice.titaAttempted} items
              </div>
            </div>

            {/* Time Efficiency */}
            <div className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border">
              <div className="text-[10px] text-sage-500">Avg Time / Question</div>
              <div className="text-xl font-bold font-serif text-sage-950 dark:text-sage-100">
                {practice.avgSecondsPerQuestion}s
              </div>
              <div className="text-[10px] text-sage-500 mt-0.5">
                Target: ~120s / question
              </div>
            </div>

            {/* Overall Solved */}
            <div className="p-3 rounded-xl bg-sage-50/70 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border">
              <div className="text-[10px] text-sage-500">Overall Accuracy</div>
              <div className="text-xl font-bold font-serif text-forest dark:text-sage-200">
                {practice.overallAccuracy}%
              </div>
              <div className="text-[10px] text-sage-500 mt-0.5">
                {practice.totalQuestionsCorrect} / {practice.totalQuestionsAttempted} total
              </div>
            </div>
          </div>

          {/* Difficulty Level Breakdown */}
          <div className="grid grid-cols-3 gap-3 pt-2 border-t border-sage-100 dark:border-dark-border">
            <div className="text-center p-2 rounded-xl bg-mint/30 dark:bg-dark-surface">
              <span className="text-[10px] text-sage-600 dark:text-dark-muted font-medium">Easy Questions</span>
              <div className="text-sm font-bold text-forest dark:text-sage-200">{practice.easyAccuracy}%</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-sage-50 dark:bg-dark-surface">
              <span className="text-[10px] text-sage-600 dark:text-dark-muted font-medium">Medium Questions</span>
              <div className="text-sm font-bold text-sage-900 dark:text-sage-100">{practice.mediumAccuracy}%</div>
            </div>
            <div className="text-center p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20">
              <span className="text-[10px] text-rose-dark font-medium">Hard Questions</span>
              <div className="text-sm font-bold text-rose-dark">{practice.hardAccuracy}%</div>
            </div>
          </div>
        </div>
      )}

      {/* Mock Test Performance Section */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted flex items-center gap-2">
              <Award className="w-4 h-4 text-forest dark:text-sage-300" />
              CAT Mock Examination Trajectory
            </h4>
            <p className="text-xs text-sage-500 dark:text-dark-muted mt-0.5">
              Completed Mocks: {mocks?.totalCompletedMocks || 0} | Average Score: {mocks?.averageScore || 0}
            </p>
          </div>
        </div>

        {/* Cohort Percentile Transparency Banner */}
        <div className="flex items-center gap-2.5 p-3 rounded-xl bg-sage-50 dark:bg-dark-surface border border-sage-200/60 dark:border-dark-border text-xs text-sage-700 dark:text-dark-muted">
          <Info className="w-4 h-4 text-forest shrink-0" />
          <span>
            <strong>Percentile Policy:</strong> {mocks?.cohortStatus}. Percentiles are never fabricated or synthetically invented without a live peer cohort.
          </span>
        </div>

        {/* Mock Scores Trend Line Chart */}
        {mockTrendData.length > 0 ? (
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
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
                <Line type="monotone" dataKey="totalScore" name="Total Marks" stroke="#405B49" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="qa" name="QA Score" stroke="#A8BDA5" strokeWidth={1.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="dilr" name="DILR Score" stroke="#B8CDB5" strokeWidth={1.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="varc" name="VARC Score" stroke="#E9C9C5" strokeWidth={1.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="p-8 text-center text-sage-500 text-xs">
            No mock tests completed yet. Take a full or sectional mock test to see your score trajectory.
          </div>
        )}

        {/* Mock Test Attempts Table */}
        {(mocks?.attempts || []).length > 0 && (
          <div className="space-y-2 pt-2 border-t border-sage-100 dark:border-dark-border">
            <h5 className="text-[11px] font-bold uppercase text-sage-600 dark:text-dark-muted">
              Recent Attempts History
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-sage-200 dark:border-dark-border text-sage-500 dark:text-dark-muted font-medium">
                    <th className="py-2 px-2">Mock Test</th>
                    <th className="py-2 px-2">Date</th>
                    <th className="py-2 px-2">Score</th>
                    <th className="py-2 px-2">Accuracy</th>
                    <th className="py-2 px-2">Correct/Att</th>
                    <th className="py-2 px-2">Time Spent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sage-100 dark:divide-dark-border">
                  {mocks!.attempts.map((att) => (
                    <tr key={att.attemptId} className="hover:bg-sage-50/50 dark:hover:bg-dark-surface/40 transition-colors">
                      <td className="py-2 px-2 font-medium text-sage-900 dark:text-sage-100">
                        {att.examTitle}
                      </td>
                      <td className="py-2 px-2 text-sage-600 dark:text-dark-muted">
                        {new Date(att.submittedAtUtc).toLocaleDateString()}
                      </td>
                      <td className="py-2 px-2 font-bold text-forest dark:text-sage-300">
                        {att.totalScore} / {att.maxPossibleScore}
                      </td>
                      <td className="py-2 px-2 font-semibold text-sage-900 dark:text-sage-100">
                        {att.accuracyPercentage}%
                      </td>
                      <td className="py-2 px-2 text-sage-700 dark:text-dark-muted">
                        {att.totalCorrect} / {att.totalAttempted}
                      </td>
                      <td className="py-2 px-2 text-sage-700 dark:text-dark-muted">
                        {Math.round(att.timeSpentSeconds / 60)}m
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
