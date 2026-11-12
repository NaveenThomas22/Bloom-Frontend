import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthLayout } from './layouts/AuthLayout';
import { AppLayout } from './layouts/AppLayout';
import { WelcomePage } from '@/features/auth/pages/WelcomePage';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { RegisterPage } from '@/features/auth/pages/RegisterPage';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';
import { PlannerPage } from '@/features/planner/pages/PlannerPage';
import { StudyPage } from '@/features/study/pages/StudyPage';
import { SubjectPage } from '@/features/syllabus/pages/SubjectPage';
import { TopicDetailPage } from '@/features/syllabus/pages/TopicDetailPage';
import { SyllabusManagePage } from '@/features/syllabus/pages/SyllabusManagePage';
import { InsightsPage } from '@/features/insights/pages/InsightsPage';
import { ProfilePage } from '@/features/profile/pages/ProfilePage';
import { SettingsPage } from '@/features/settings/pages/SettingsPage';
import { GoalsPage } from '@/features/goals/pages/GoalsPage';
import { RevisionPage } from '@/features/goals/pages/RevisionPage';
import { QuestionBankPage } from '@/features/questions/pages/QuestionBankPage';
import { BookmarksPage } from '@/features/bookmarks/pages/BookmarksPage';
import { PracticeSetupPage } from '@/features/practice/pages/PracticeSetupPage';
import { PracticeWorkspacePage } from '@/features/practice/pages/PracticeWorkspacePage';
import { PracticeResultsPage } from '@/features/practice/pages/PracticeResultsPage';
import { ExamListPage } from '@/features/exams/pages/ExamListPage';
import { ExamWorkspacePage } from '@/features/exams/pages/ExamWorkspacePage';
import { ExamResultsPage } from '@/features/exams/pages/ExamResultsPage';
import { ExamReviewPage } from '@/features/exams/pages/ExamReviewPage';
import { JournalDashboardPage } from '@/features/journal/pages/JournalDashboardPage';
import { JournalEditorPage } from '@/features/journal/pages/JournalEditorPage';
import { ReflectionsDashboardPage } from '@/features/reflections/pages/ReflectionsDashboardPage';
import { MorningReflectionPage } from '@/features/reflections/pages/MorningReflectionPage';
import { EveningReflectionPage } from '@/features/reflections/pages/EveningReflectionPage';
import { HabitsPage } from '@/features/habits/pages/HabitsPage';
import { MindsetPage } from '@/features/mindset/pages/MindsetPage';
import { NotificationsPage } from '@/features/notifications/pages/NotificationsPage';
import { NotificationSettingsPage } from '@/features/notifications/pages/NotificationSettingsPage';
import { useAuthStore } from '@/store/useAuthStore';

export const AppRouter: React.FC = () => {
  const { isAuthenticated, isInitializing } = useAuthStore();

  return (
    <Routes>
      {/* Root redirector */}
      <Route
        path="/"
        element={
          isInitializing ? (
            <div className="min-h-screen flex items-center justify-center bg-ivory-200 dark:bg-dark-bg font-serif text-forest text-sm">
              Cultivating sanctuary...
            </div>
          ) : isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/welcome" replace />
          )
        }
      />

      {/* Guest Authentication Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/welcome" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Protected Aspirant Routes */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/planner" element={<PlannerPage />} />
        <Route path="/study" element={<StudyPage />} />
        <Route path="/study/subject/:id" element={<SubjectPage />} />
        <Route path="/study/topic/:id" element={<TopicDetailPage />} />
        <Route path="/study/manage" element={<SyllabusManagePage />} />
        <Route path="/insights" element={<InsightsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/revisions" element={<RevisionPage />} />
        <Route path="/questions" element={<QuestionBankPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />
        <Route path="/practice" element={<PracticeSetupPage />} />
        <Route path="/practice/session/:id" element={<PracticeWorkspacePage />} />
        <Route path="/practice/results/:id" element={<PracticeResultsPage />} />
        <Route path="/exams" element={<ExamListPage />} />
        <Route path="/exams/:id/results" element={<ExamResultsPage />} />
        <Route path="/exams/:id/review" element={<ExamReviewPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/journal" element={<JournalDashboardPage />} />
        <Route path="/journal/new" element={<JournalEditorPage />} />
        <Route path="/journal/:id" element={<JournalEditorPage />} />
        <Route path="/reflections" element={<ReflectionsDashboardPage />} />
        <Route path="/reflections/morning" element={<MorningReflectionPage />} />
        <Route path="/reflections/evening" element={<EveningReflectionPage />} />
        <Route path="/habits" element={<HabitsPage />} />
        <Route path="/mindset" element={<MindsetPage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/notification-settings" element={<NotificationSettingsPage />} />
      </Route>

      {/* Fullscreen CAT CBT Terminal (Without distracting standard header/bottom nav) */}
      <Route
        path="/exams/:id/workspace"
        element={
          isInitializing ? (
            <div className="min-h-screen flex items-center justify-center font-serif text-forest text-sm bg-slate-900 text-white">
              Starting CAT Terminal...
            </div>
          ) : isAuthenticated ? (
            <ExamWorkspacePage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

