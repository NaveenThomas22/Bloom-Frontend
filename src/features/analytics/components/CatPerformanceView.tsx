import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, TrendingUp, AlertCircle, CheckCircle, Search } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import type { SubjectPerformanceDto, TopicPerformanceDto } from '@/types/analytics';

interface CatPerformanceProps {
  subjects?: SubjectPerformanceDto[];
  topics?: TopicPerformanceDto[];
  isLoading: boolean;
}

export const CatPerformanceView: React.FC<CatPerformanceProps> = ({ subjects = [], topics = [], isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');

  if (isLoading) {
    return (
      <div className="p-8 text-center text-sage-500 animate-pulse">
        Loading CAT Subject Performance Analytics...
      </div>
    );
  }

  // Strong topics (accuracy >= 70% with >= 3 attempts, or confidence >= 4)
  const strongTopics = topics
    .filter((t) => (t.questionsAttempted >= 3 && t.accuracyPercentage >= 70) || t.confidenceRating >= 4)
    .slice(0, 5);

  // Weak topics (accuracy < 60% with >= 3 attempts, or confidence <= 2)
  const weakTopics = topics
    .filter((t) => t.questionsAttempted >= 3 && t.accuracyPercentage < 60)
    .sort((a, b) => a.accuracyPercentage - b.accuracyPercentage)
    .slice(0, 5);

  // Filtered topics for the detailed table
  const filteredTopics = topics.filter((t) => {
    const matchesSearch = t.topicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.moduleName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = selectedSubject === 'ALL' || t.subjectCode === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const chartData = subjects.map((s) => ({
    name: s.subjectCode,
    fullName: s.subjectName,
    accuracy: s.accuracyPercentage,
    studyHours: s.studyHours,
    topicsProgress: s.totalTopics > 0 ? Math.round(((s.completedTopics + s.masteredTopics) / s.totalTopics) * 100) : 0,
  }));

  return (
    <div className="space-y-6">
      {/* 3 Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {subjects.map((sub) => {
          const progress = sub.totalTopics > 0
            ? Math.round(((sub.completedTopics + sub.masteredTopics) / sub.totalTopics) * 100)
            : 0;

          return (
            <div
              key={sub.subjectId}
              className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-forest dark:text-sage-300">
                    {sub.subjectCode}
                  </span>
                  <h3 className="font-serif font-bold text-base text-sage-950 dark:text-sage-100">
                    {sub.subjectName}
                  </h3>
                </div>
                <BookOpen className="w-5 h-5 text-forest/70 dark:text-sage-300" />
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-sage-600 dark:text-dark-muted">
                  <span>Syllabus Covered</span>
                  <span className="font-semibold text-sage-900 dark:text-sage-200">{progress}%</span>
                </div>
                <div className="w-full bg-sage-100 dark:bg-dark-surface h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-forest dark:bg-sage-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-sage-100 dark:border-dark-border text-center">
                <div>
                  <div className="text-[10px] text-sage-500 dark:text-dark-muted">Study Hours</div>
                  <div className="text-xs font-bold text-sage-900 dark:text-sage-200">{sub.studyHours}h</div>
                </div>
                <div>
                  <div className="text-[10px] text-sage-500 dark:text-dark-muted">Accuracy</div>
                  <div className="text-xs font-bold text-sage-900 dark:text-sage-200">{sub.accuracyPercentage}%</div>
                </div>
                <div>
                  <div className="text-[10px] text-sage-500 dark:text-dark-muted">Avg Time</div>
                  <div className="text-xs font-bold text-sage-900 dark:text-sage-200">{sub.averageTimeSpentSeconds}s</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Chart */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-forest dark:text-sage-300" />
          Subject Accuracy & Syllabus Comparison
        </h4>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1D2521',
                  borderColor: '#33423A',
                  color: '#F8F5EB',
                  borderRadius: '12px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="accuracy" name="Practice Accuracy %" fill="#405B49" radius={[4, 4, 0, 0]} />
              <Bar dataKey="topicsProgress" name="Syllabus %" fill="#A8BDA5" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strong vs Weak Topics Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Strong Topics */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 text-forest dark:text-sage-300">
            <CheckCircle className="w-4 h-4" />
            <h4 className="font-serif font-bold text-sm text-sage-950 dark:text-sage-100">
              Top Strong Areas
            </h4>
          </div>
          {strongTopics.length === 0 ? (
            <p className="text-xs text-sage-500 py-3">Practice questions across topics to identify strong areas.</p>
          ) : (
            <div className="space-y-2">
              {strongTopics.map((st) => (
                <div
                  key={st.topicId}
                  className="flex items-center justify-between p-2 rounded-xl bg-sage-50/80 dark:bg-dark-surface/60 border border-sage-100 dark:border-dark-border text-xs"
                >
                  <div>
                    <span className="font-semibold text-sage-900 dark:text-sage-200">{st.topicName}</span>
                    <span className="text-[10px] text-sage-500 dark:text-dark-muted ml-2">({st.subjectCode})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-forest/10 dark:bg-forest/30 text-forest dark:text-sage-300 font-bold text-[10px]">
                      {st.accuracyPercentage}% Acc
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weak Topics */}
        <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
          <div className="flex items-center gap-2 text-rose-dark">
            <AlertCircle className="w-4 h-4" />
            <h4 className="font-serif font-bold text-sm text-sage-950 dark:text-sage-100">
              Needs Immediate Attention
            </h4>
          </div>
          {weakTopics.length === 0 ? (
            <p className="text-xs text-sage-500 py-3">No weak topics detected (accuracy &lt; 60%). Keep practicing!</p>
          ) : (
            <div className="space-y-2">
              {weakTopics.map((wt) => (
                <div
                  key={wt.topicId}
                  className="flex items-center justify-between p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 text-xs"
                >
                  <div>
                    <span className="font-semibold text-sage-900 dark:text-sage-200">{wt.topicName}</span>
                    <span className="text-[10px] text-sage-500 dark:text-dark-muted ml-2">({wt.subjectCode})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/50 text-rose-dark font-bold text-[10px]">
                      {wt.accuracyPercentage}% Acc
                    </span>
                    <Link
                      to={`/practice?topicId=${wt.topicId}`}
                      className="px-2 py-0.5 rounded-lg bg-forest text-white text-[10px] font-medium hover:bg-forest-light transition-all"
                    >
                      Practice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Comprehensive Topic Performance Table */}
      <div className="p-4 rounded-2xl bg-white/80 dark:bg-dark-card/80 border border-sage-200/60 dark:border-dark-border shadow-soft-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-sage-700 dark:text-dark-muted">
            All Topics Breakdown ({filteredTopics.length})
          </h4>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs px-2.5 py-1 rounded-lg border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-900 dark:text-sage-100"
            >
              <option value="ALL">All Subjects</option>
              <option value="QA">QA</option>
              <option value="DILR">DILR</option>
              <option value="VARC">VARC</option>
            </select>
            {/* Search Input */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-sage-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-8 pr-2.5 py-1 rounded-lg border border-sage-200 dark:border-dark-border bg-ivory-50 dark:bg-dark-surface text-sage-900 dark:text-sage-100"
              />
            </div>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sage-200 dark:border-dark-border text-sage-500 dark:text-dark-muted font-medium">
                <th className="py-2 px-2">Topic</th>
                <th className="py-2 px-2">Subject</th>
                <th className="py-2 px-2">Status</th>
                <th className="py-2 px-2">Questions</th>
                <th className="py-2 px-2">Accuracy</th>
                <th className="py-2 px-2">Study Hours</th>
                <th className="py-2 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-100 dark:divide-dark-border">
              {filteredTopics.map((t) => (
                <tr key={t.topicId} className="hover:bg-sage-50/50 dark:hover:bg-dark-surface/40 transition-colors">
                  <td className="py-2 px-2 font-medium text-sage-900 dark:text-sage-100">
                    {t.topicName}
                  </td>
                  <td className="py-2 px-2 text-sage-600 dark:text-dark-muted">
                    {t.subjectCode}
                  </td>
                  <td className="py-2 px-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.status === 'Mastered'
                        ? 'bg-forest/10 dark:bg-forest/30 text-forest dark:text-sage-300'
                        : t.status === 'Completed'
                        ? 'bg-mint/40 text-forest dark:text-sage-200'
                        : 'bg-sage-100 dark:bg-dark-surface text-sage-600 dark:text-dark-muted'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-sage-700 dark:text-dark-muted">
                    {t.questionsCorrect} / {t.questionsAttempted}
                  </td>
                  <td className="py-2 px-2 font-semibold text-sage-900 dark:text-sage-100">
                    {t.accuracyPercentage}%
                  </td>
                  <td className="py-2 px-2 text-sage-700 dark:text-dark-muted">
                    {t.studyHours}h
                  </td>
                  <td className="py-2 px-2 text-right">
                    <Link
                      to={`/practice?topicId=${t.topicId}`}
                      className="text-forest dark:text-sage-300 hover:underline font-medium text-[11px]"
                    >
                      Practice
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

