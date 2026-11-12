export type LearningStatus =
  | 'NotStarted'
  | 'Learning'
  | 'Practicing'
  | 'Completed'
  | 'RevisionDue'
  | 'Mastered';

export type TopicPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export type ImportanceLevel = 'Low' | 'Medium' | 'High';

export type ResourceType = 'Article' | 'Video' | 'Book' | 'PracticeSet' | 'Other';

export interface SubjectSummary {
  id: number;
  code: string;
  name: string;
  description: string | null;
  isCustom: boolean;
  moduleCount: number;
  topicCount: number;
  completedTopicCount: number;
  progressPercentage: number;
  displayOrder: number;
}

export interface SyllabusOverview {
  totalTopics: number;
  completedTopics: number;
  masteredTopics: number;
  inProgressTopics: number;
  revisionDueTopics: number;
  notStartedTopics: number;
  overallProgressPercentage: number;
  estimatedTotalHours: number;
  estimatedRemainingHours: number;
  subjects: SubjectSummary[];
}

export interface TopicSummary {
  id: number;
  moduleId: number;
  name: string;
  description: string | null;
  estimatedStudyHours: number;
  difficultyLevel: DifficultyLevel;
  importanceLevel: ImportanceLevel;
  displayOrder: number;
  isCustom: boolean;
  status: LearningStatus;
  priority: TopicPriority;
  targetDate: string | null;
  completionDate: string | null;
  confidenceRating: number;
  personalNotes: string | null;
  isCustomExcluded: boolean;
  subtopicCount: number;
  completedSubtopicCount: number;
}

export interface ModuleDetail {
  id: number;
  subjectId: number;
  name: string;
  description: string | null;
  isCustom: boolean;
  topicCount: number;
  completedTopicCount: number;
  progressPercentage: number;
  displayOrder: number;
  topics: TopicSummary[];
}

export interface SubjectDetail {
  subject: SubjectSummary;
  modules: ModuleDetail[];
}

export interface SubtopicDetail {
  id: number;
  topicId: number;
  name: string;
  description: string | null;
  displayOrder: number;
  isCustom: boolean;
  isCompleted: boolean;
  completedAtUtc: string | null;
  notes: string | null;
}

export interface SyllabusResource {
  id: number;
  topicId: number;
  title: string;
  resourceType: ResourceType;
  url: string | null;
  notes: string | null;
  isCustom: boolean;
  displayOrder: number;
}

export interface TopicDetail {
  topic: TopicSummary;
  moduleName: string;
  subjectName: string;
  subjectCode: string;
  subtopics: SubtopicDetail[];
  resources: SyllabusResource[];
}

// Request Payload Types
export interface CreateSubjectDto {
  code: string;
  name: string;
  description?: string | null;
  displayOrder?: number;
}

export interface UpdateSubjectDto {
  code: string;
  name: string;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateModuleDto {
  subjectId: number;
  name: string;
  description?: string | null;
  displayOrder?: number;
}

export interface UpdateModuleDto {
  name: string;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateTopicDto {
  moduleId: number;
  name: string;
  description?: string | null;
  estimatedStudyHours?: number;
  difficultyLevel?: DifficultyLevel;
  importanceLevel?: ImportanceLevel;
  displayOrder?: number;
}

export interface UpdateTopicDto {
  name: string;
  description?: string | null;
  estimatedStudyHours?: number;
  difficultyLevel?: DifficultyLevel;
  importanceLevel?: ImportanceLevel;
  displayOrder?: number;
  isActive?: boolean;
}

export interface CreateSubtopicDto {
  topicId: number;
  name: string;
  description?: string | null;
  displayOrder?: number;
}

export interface UpdateSubtopicDto {
  name: string;
  description?: string | null;
  displayOrder?: number;
  isActive?: boolean;
}

export interface UpdateTopicProgressDto {
  status: LearningStatus;
  priority: TopicPriority;
  targetDate?: string | null;
  confidenceRating: number;
  personalNotes?: string | null;
  isCustomExcluded: boolean;
}

export interface UpdateSubtopicProgressDto {
  isCompleted: boolean;
  notes?: string | null;
}

export interface CreateResourceDto {
  title: string;
  resourceType: ResourceType;
  url?: string | null;
  notes?: string | null;
  displayOrder?: number;
}

