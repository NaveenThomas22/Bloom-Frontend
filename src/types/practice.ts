import type { Question, DifficultyLevel } from './questions';

export type PracticeMode = 'Topic' | 'Subject' | 'Difficulty' | 'Custom' | 'DILRSet' | 'VARCPassage';

export interface StartPracticeSessionRequest {
  title?: string;
  practiceMode: PracticeMode;
  subjectId?: number;
  topicId?: number;
  questionSetId?: number;
  passageId?: number;
  difficultyLevel?: DifficultyLevel;
  questionType?: string;
  questionCount: number;
  timeLimitMinutes?: number;
}

export interface PracticeQuestionItem {
  id: number;
  questionId: number;
  displayOrder: number;
  userAnswer?: string;
  isAnswered: boolean;
  isCorrect?: boolean;
  isMarkedForReview: boolean;
  timeSpentSeconds: number;
  question: Question;
}

export interface PracticeSession {
  id: number;
  userId: number;
  title: string;
  practiceMode: PracticeMode;
  subjectId?: number;
  subjectName?: string;
  topicId?: number;
  topicName?: string;
  difficultyLevel?: DifficultyLevel;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  score: number;
  accuracyPercentage: number;
  timeSpentSeconds: number;
  timeLimitSeconds?: number;
  status: 'InProgress' | 'Completed' | 'Abandoned';
  startedAtUtc: string;
  completedAtUtc?: string;
  questions: PracticeQuestionItem[];
}

export interface SavePracticeAnswerRequest {
  questionId: number;
  userAnswer?: string;
  isMarkedForReview?: boolean;
  timeSpentSeconds?: number;
}

export interface SubmitPracticeSessionResponse {
  sessionId: number;
  status: string;
  totalQuestions: number;
  attemptedQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unansweredQuestions: number;
  score: number;
  accuracyPercentage: number;
  totalTimeSpentSeconds: number;
  activityRecordId?: number;
  questions: PracticeQuestionItem[];
}

