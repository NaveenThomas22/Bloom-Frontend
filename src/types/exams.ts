import type { QuestionOption, QuestionPassage, QuestionSet, QuestionType } from './questions';

export type ExamType = 'FullMock' | 'SectionalMock' | 'Custom';
export type AnswerStatus = 'NotVisited' | 'NotAnswered' | 'Answered' | 'MarkedForReview' | 'AnsweredAndMarkedForReview';

export interface ExamSection {
  id: number;
  examTemplateId: number;
  sectionName: string;
  subjectId?: number;
  displayOrder: number;
  durationMinutes: number;
  questionCount: number;
  canNavigateBack: boolean;
  correctMarks: number;
  incorrectPenalty: number;
}

export interface ExamTemplate {
  id: number;
  title: string;
  description?: string;
  examType: ExamType;
  totalDurationMinutes: number;
  totalQuestions: number;
  totalMarks: number;
  instructions?: string;
  isPublished: boolean;
  sections: ExamSection[];
}

export interface ExamAttemptQuestionItem {
  id: number;
  examSectionId: number;
  questionId: number;
  displayOrder: number;
  questionType: QuestionType;
  content: string;
  options: QuestionOption[];
  passage?: QuestionPassage;
  questionSet?: QuestionSet;
  marks: number;
  penalty: number;
  userAnswer?: string;
  answerStatus: AnswerStatus;
  timeSpentSeconds: number;
  version: number;
}

export interface ActiveExamAttempt {
  id: number;
  examTemplateId: number;
  templateTitle: string;
  status: 'Created' | 'InProgress' | 'Submitted' | 'AutoSubmitted' | 'Expired' | 'Abandoned';
  serverTimeUtc: string;
  startedAtUtc: string;
  deadlineUtc: string;
  remainingSecondsTotal: number;
  currentSectionId: number;
  currentSectionName: string;
  currentSectionIndex: number;
  totalSections: number;
  sectionStartedAtUtc: string;
  sectionDeadlineUtc: string;
  remainingSecondsCurrentSection: number;
  currentQuestionIndex: number;
  sections: ExamSection[];
  questions: ExamAttemptQuestionItem[];
}

export interface SaveExamAnswerRequest {
  questionId: number;
  userAnswer?: string;
  answerStatus: AnswerStatus;
  timeSpentSeconds?: number;
  expectedVersion: number;
}

export interface SaveExamAnswerResponse {
  questionId: number;
  newVersion: number;
  lastSavedAtUtc: string;
}

export interface TransitionSectionRequest {
  targetSectionId: number;
}

export interface ExamAttemptSectionResult {
  sectionId: number;
  sectionName: string;
  displayOrder: number;
  score: number;
  maxScore: number;
  totalQuestions: number;
  attempted: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
}

export interface ExamResult {
  attemptId: number;
  examTemplateId: number;
  templateTitle: string;
  examType: string;
  status: string;
  startedAtUtc: string;
  submittedAtUtc: string;
  totalScore: number;
  maxPossibleScore: number;
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  sectionResults: ExamAttemptSectionResult[];
}

export interface ExamReviewQuestion {
  questionId: number;
  examSectionId: number;
  sectionName: string;
  displayOrder: number;
  questionType: string;
  content: string;
  options: QuestionOption[];
  passage?: QuestionPassage;
  questionSet?: QuestionSet;
  userAnswer?: string;
  correctAnswer: string;
  answerStatus: string;
  isCorrect?: boolean;
  marksAwarded: number;
  maxMarks: number;
  penalty: number;
  explanation?: string;
  solutionSteps?: string;
  timeSpentSeconds: number;
}

export interface ExamReview {
  summary: ExamResult;
  questions: ExamReviewQuestion[];
}

export interface ExamAttemptSummary {
  id: number;
  examTemplateId: number;
  templateTitle: string;
  examType: string;
  status: string;
  startedAtUtc: string;
  deadlineUtc: string;
  submittedAtUtc?: string;
  totalScore: number;
  maxPossibleScore: number;
  totalQuestions: number;
  totalAttempted: number;
  totalCorrect: number;
  totalIncorrect: number;
  totalUnanswered: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
}

