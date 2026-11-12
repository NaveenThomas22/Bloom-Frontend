export type QuestionType = 'MCQ' | 'TITA';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';

export interface QuestionOption {
  id?: number;
  questionId?: number;
  optionKey: string;
  content: string;
  displayOrder: number;
  isCorrect?: boolean;
}

export interface QuestionPassage {
  id?: number;
  title: string;
  content: string;
  wordCount?: number;
  genre?: string;
  sourceAttribution?: string;
  estimatedReadingMinutes?: number;
}

export interface QuestionSet {
  id?: number;
  title: string;
  contextScenario: string;
  dataPayloadJson?: string;
  setType?: string;
  sourceAttribution?: string;
}

export interface Question {
  id: number;
  subjectId: number;
  subjectName?: string;
  moduleId: number;
  moduleName?: string;
  topicId: number;
  topicName?: string;
  subtopicId?: number;
  subtopicName?: string;
  questionSetId?: number;
  passageId?: number;
  questionType: QuestionType;
  difficultyLevel: DifficultyLevel;
  questionContent: string;
  questionImageUrl?: string;
  correctAnswer?: string;
  titaNumericRangeMin?: number;
  titaNumericRangeMax?: number;
  explanation?: string;
  solutionSteps?: string;
  estimatedSeconds: number;
  defaultMarks: number;
  defaultPenalty: number;
  sourceAttribution?: string;
  tags?: string;
  status: string;
  isBookmarked: boolean;
  options: QuestionOption[];
  passage?: QuestionPassage;
  questionSet?: QuestionSet;
}

export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface QuestionFilter {
  subjectId?: number;
  moduleId?: number;
  topicId?: number;
  subtopicId?: number;
  questionType?: QuestionType;
  difficultyLevel?: DifficultyLevel;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface Bookmark {
  id: number;
  questionId: number;
  note?: string;
  createdAtUtc: string;
  question?: Question;
}

