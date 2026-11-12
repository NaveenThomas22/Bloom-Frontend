import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useSubjectDetail } from '../hooks/useSyllabus';
import { ModuleCard } from '../components/ModuleCard';
import { ProgressBar } from '../components/ProgressBar';
import { CustomItemModal } from '../components/CustomItemModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ChevronLeft, Plus, Search, AlertCircle, Layers, FileText } from 'lucide-react';

export const SubjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const subjectId = Number(id);

  const { data: subjectDetail, isLoading, error } = useSubjectDetail(subjectId);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-6 text-left animate-in fade-in duration-300">
        <div className="h-6 bg-sage-200/50 dark:bg-dark-surface rounded w-32 animate-pulse" />
        <div className="h-32 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-24 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
          <div className="h-24 bg-sage-200/50 dark:bg-dark-surface rounded-3xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (error || !subjectDetail) {
    return (
      <div className="p-8 rounded-3xl bg-rose/20 border border-rose/40 text-center space-y-3">
        <AlertCircle className="w-8 h-8 text-rose-dark mx-auto" />
        <h3 className="font-serif text-lg font-bold text-rose-dark">
          Subject Not Found
        </h3>
        <p className="text-xs text-sage-600 dark:text-sage-400">
          The requested syllabus subject could not be retrieved.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/study')}>
          Back to Syllabus
        </Button>
      </div>
    );
  }

  const { subject, modules } = subjectDetail;

  // Filter modules and topics based on search term and status
  const filteredModules = modules
    .map((mod) => {
      const filteredTopics = mod.topics.filter((topic) => {
        const matchesSearch =
          topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (topic.description && topic.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus =
          statusFilter === 'ALL' || topic.status === statusFilter;
        return matchesSearch && matchesStatus;
      });

      return {
        ...mod,
        topics: filteredTopics,
      };
    })
    .filter((mod) => mod.topics.length > 0 || !searchTerm);

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
        <span className="font-semibold text-sage-900 dark:text-sage-100">
          {subject.code}
        </span>
      </div>

      {/* Subject Header Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-white/95 dark:bg-dark-card/95 border border-sage-200/80 dark:border-dark-border shadow-soft space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md font-mono text-xs font-bold bg-mint/40 text-forest border border-mint/60">
                {subject.code}
              </span>
              <h1 className="font-serif text-2xl font-bold text-sage-950 dark:text-sage-100">
                {subject.name}
              </h1>
              {subject.isCustom && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sage-200 dark:bg-dark-surface text-forest dark:text-sage-300 border border-sage-300/60 dark:border-dark-border">
                  Custom
                </span>
              )}
            </div>
            {subject.description && (
              <p className="text-xs text-sage-600 dark:text-sage-400 max-w-2xl">
                {subject.description}
              </p>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => setIsModalOpen(true)}
            className="text-xs h-9 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Topic
          </Button>
        </div>

        <div className="space-y-2 pt-2 border-t border-sage-100 dark:border-dark-border/60">
          <div className="flex items-center justify-between text-xs text-sage-600 dark:text-sage-400">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-sage-500" />
                {subject.moduleCount} modules
              </span>
              <span className="inline-flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-sage-500" />
                {subject.completedTopicCount} of {subject.topicCount} topics completed
              </span>
            </div>
            <span className="font-semibold text-forest dark:text-sage-300 tabular-nums">
              {Math.round(subject.progressPercentage)}%
            </span>
          </div>

          <ProgressBar
            progress={subject.progressPercentage}
            showPercentage={false}
            size="md"
          />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-sage-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search topics..."
            className="pl-9 h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {['ALL', 'NotStarted', 'Learning', 'Practicing', 'Completed', 'RevisionDue', 'Mastered'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-forest text-white border-forest dark:bg-forest dark:text-sage-100'
                  : 'bg-white/90 dark:bg-dark-card text-sage-700 dark:text-sage-300 border-sage-200/70 dark:border-dark-border hover:bg-sage-50'
              }`}
            >
              {status === 'ALL' ? 'All Topics' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-4">
        {filteredModules.length === 0 ? (
          <div className="p-8 rounded-3xl bg-white/60 dark:bg-dark-card/60 border border-sage-200/40 dark:border-dark-border text-center space-y-2">
            <p className="text-xs text-sage-600 dark:text-sage-400 italic">
              No topics matched your search or status filter.
            </p>
            {(searchTerm || statusFilter !== 'ALL') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('ALL');
                }}
                className="text-xs"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} defaultExpanded={true} />
          ))
        )}
      </div>

      {/* Modal to add custom module or topic to this subject */}
      <CustomItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialType="topic"
        subjects={[subject]}
        modules={modules}
        preselectedSubjectId={subject.id}
      />
    </div>
  );
};
