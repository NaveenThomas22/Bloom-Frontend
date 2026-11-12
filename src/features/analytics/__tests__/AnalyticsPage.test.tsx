import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, render, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InsightsPage } from '@/features/insights/pages/InsightsPage';
import { analyticsApi } from '@/lib/api/analyticsApi';

// Mock recharts ResponsiveContainer to avoid size measuring issues in jsdom
vi.mock('recharts', async () => {
  const actual = await vi.importActual<any>('recharts');
  return {
    ...actual,
    ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  };
});

vi.mock('@/lib/api/analyticsApi', () => ({
  analyticsApi: {
    getOverview: vi.fn(),
    getSubjectPerformance: vi.fn(),
    getTopicPerformance: vi.fn(),
    getStudyTrends: vi.fn(),
    getTimeOfDay: vi.fn(),
    getLifeDistribution: vi.fn(),
    getDailyLifeAccounting: vi.fn(),
    getPlanAdherence: vi.fn(),
    getQuestionPractice: vi.fn(),
    getMockTests: vi.fn(),
    getRevisions: vi.fn(),
    getGoals: vi.fn(),
    getHabits: vi.fn(),
    getMindsetGrowth: vi.fn(),
    getRecommendations: vi.fn(),
  },
}));

describe('Analytics & InsightsPage Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    vi.mocked(analyticsApi.getOverview).mockResolvedValue({
      studyHoursPeriod: 14.5,
      studyHoursAllTime: 125.0,
      questionsAttempted: 120,
      questionsCorrect: 96,
      practiceAccuracy: 80.0,
      topicsMastered: 8,
      topicsCompleted: 24,
      totalTopics: 72,
      mockTestsCompleted: 3,
      averageMockScore: 82.5,
      currentStreakDays: 5,
      hasActiveTimer: false,
      activeTimerMinutes: 0,
    });

    vi.mocked(analyticsApi.getSubjectPerformance).mockResolvedValue([
      {
        subjectId: 1,
        subjectCode: 'QA',
        subjectName: 'Quantitative Aptitude',
        totalTopics: 30,
        completedTopics: 15,
        masteredTopics: 5,
        studyHours: 20.0,
        questionsAttempted: 80,
        questionsCorrect: 64,
        accuracyPercentage: 80.0,
        averageTimeSpentSeconds: 110,
      },
      {
        subjectId: 2,
        subjectCode: 'DILR',
        subjectName: 'Data Interpretation & Logical Reasoning',
        totalTopics: 22,
        completedTopics: 10,
        masteredTopics: 3,
        studyHours: 12.0,
        questionsAttempted: 50,
        questionsCorrect: 35,
        accuracyPercentage: 70.0,
        averageTimeSpentSeconds: 130,
      },
      {
        subjectId: 3,
        subjectCode: 'VARC',
        subjectName: 'Verbal Ability & Reading Comprehension',
        totalTopics: 20,
        completedTopics: 9,
        masteredTopics: 5,
        studyHours: 10.0,
        questionsAttempted: 60,
        questionsCorrect: 48,
        accuracyPercentage: 80.0,
        averageTimeSpentSeconds: 90,
      },
    ]);

    vi.mocked(analyticsApi.getTopicPerformance).mockResolvedValue([
      {
        topicId: 10,
        topicName: 'Percentages & Fractions',
        subjectCode: 'QA',
        subjectName: 'Quantitative Aptitude',
        moduleName: 'Arithmetic',
        status: 'Mastered',
        confidenceRating: 5,
        questionsAttempted: 30,
        questionsCorrect: 27,
        accuracyPercentage: 90.0,
        studyHours: 6.5,
      },
      {
        topicId: 20,
        topicName: 'Permutations & Combinations',
        subjectCode: 'QA',
        subjectName: 'Quantitative Aptitude',
        moduleName: 'Modern Math',
        status: 'InLearning',
        confidenceRating: 2,
        questionsAttempted: 15,
        questionsCorrect: 6,
        accuracyPercentage: 40.0,
        studyHours: 4.0,
      },
    ]);

    vi.mocked(analyticsApi.getStudyTrends).mockResolvedValue([
      { date: '2026-11-10', studyHours: 3.5, qaHours: 2.0, dilrHours: 1.0, varcHours: 0.5, otherHours: 0.0 },
      { date: '2026-11-11', studyHours: 4.0, qaHours: 2.5, dilrHours: 1.0, varcHours: 0.5, otherHours: 0.0 },
    ]);

    vi.mocked(analyticsApi.getTimeOfDay).mockResolvedValue([
      { timeBlock: 'Morning (05:00 - 11:59)', studyHours: 6.0, activityCount: 4 },
      { timeBlock: 'Afternoon (12:00 - 16:59)', studyHours: 3.0, activityCount: 2 },
      { timeBlock: 'Evening (17:00 - 21:59)', studyHours: 4.5, activityCount: 3 },
      { timeBlock: 'Night (22:00 - 04:59)', studyHours: 1.0, activityCount: 1 },
    ]);

    vi.mocked(analyticsApi.getLifeDistribution).mockResolvedValue([
      { categoryGroup: 'Study', categoryName: 'CAT Preparation', color: '#405B49', totalHours: 14.5, percentage: 40.0 },
      { categoryGroup: 'Sleep', categoryName: 'Restorative Sleep', color: '#A8BDA5', totalHours: 16.0, percentage: 44.0 },
    ]);

    vi.mocked(analyticsApi.getDailyLifeAccounting).mockResolvedValue({
      date: '2026-11-12',
      accountedHours: 16.5,
      untrackedHours: 7.5,
      calendarDayHours: 24.0,
    });

    vi.mocked(analyticsApi.getPlanAdherence).mockResolvedValue({
      totalPlannedHours: 15.0,
      totalActualHours: 14.5,
      completedPlansCount: 5,
      totalScheduledPlansCount: 6,
      adherenceRatePercentage: 83.33,
    });

    vi.mocked(analyticsApi.getQuestionPractice).mockResolvedValue({
      totalSessions: 12,
      totalQuestionsAttempted: 190,
      totalQuestionsCorrect: 147,
      overallAccuracy: 77.37,
      mcqAttempted: 140,
      mcqCorrect: 112,
      mcqAccuracy: 80.0,
      titaAttempted: 50,
      titaCorrect: 35,
      titaAccuracy: 70.0,
      easyAccuracy: 88.0,
      mediumAccuracy: 75.0,
      hardAccuracy: 58.0,
      avgSecondsPerQuestion: 105.0,
    });

    vi.mocked(analyticsApi.getMockTests).mockResolvedValue({
      totalCompletedMocks: 2,
      averageScore: 82.5,
      cohortStatus: 'Cohort percentile unavailable (Single-user mode)',
      attempts: [
        {
          attemptId: 1,
          examTemplateId: 5,
          examTitle: 'CAT Full Length Mock 1',
          examType: 'FullMock',
          submittedAtUtc: '2026-11-10T14:00:00Z',
          totalScore: 88.0,
          maxPossibleScore: 198.0,
          accuracyPercentage: 78.0,
          totalAttempted: 40,
          totalCorrect: 31,
          totalIncorrect: 9,
          totalUnanswered: 26,
          timeSpentSeconds: 7200,
          sectionScores: [
            { sectionName: 'VARC', score: 32.0, maxScore: 66.0, attempted: 14, correct: 11, accuracyPercentage: 78.5, timeSpentSeconds: 2400 },
            { sectionName: 'DILR', score: 26.0, maxScore: 66.0, attempted: 12, correct: 9, accuracyPercentage: 75.0, timeSpentSeconds: 2400 },
            { sectionName: 'QA', score: 30.0, maxScore: 66.0, attempted: 14, correct: 11, accuracyPercentage: 78.5, timeSpentSeconds: 2400 },
          ],
        },
      ],
    });

    vi.mocked(analyticsApi.getRevisions).mockResolvedValue({
      totalSchedules: 15,
      completedSchedules: 12,
      overdueSchedules: 2,
      upcomingSchedules: 1,
      completionRatePercentage: 80.0,
      averageConfidence: 4.2,
      understandingDistribution: { Mastered: 8, Good: 4 },
    });

    vi.mocked(analyticsApi.getGoals).mockResolvedValue([
      {
        goalId: 1,
        title: 'Weekly Study Target',
        goalPeriod: 'Weekly',
        targetMetric: 'StudyMinutes',
        targetValue: 1200,
        currentValue: 900,
        unit: 'Minutes',
        progressPercentage: 75.0,
        isCompleted: false,
      },
    ]);

    vi.mocked(analyticsApi.getHabits).mockResolvedValue([
      {
        habitId: 1,
        habitName: 'Read 2 Editorial Passages',
        categoryName: 'VARC Reading',
        frequency: 'Daily',
        currentStreak: 8,
        longestStreak: 12,
        completionRatePercentage: 90.0,
        totalCompleted: 9,
        totalSkipped: 1,
        totalMissed: 0,
      },
    ]);

    vi.mocked(analyticsApi.getMindsetGrowth).mockResolvedValue({
      morningReflectionsCount: 7,
      eveningReflectionsCount: 6,
      totalDaysWithReflections: 7,
      averageMorningEnergy: 4.5,
      averageEveningSatisfaction: 4.2,
      totalPlannedStudyMinutes: 900,
      actualStudyMinutes: 870,
      moodDistribution: [
        { moodCode: 'FOCUSED', moodName: 'Focused', emoji: '🎯', color: '#405B49', count: 8, percentage: 61.54 },
        { moodCode: 'CALM', moodName: 'Calm', emoji: '🌿', color: '#A8BDA5', count: 5, percentage: 38.46 },
      ],
    });

    vi.mocked(analyticsApi.getRecommendations).mockResolvedValue([
      {
        id: 'REC_WEAK_20',
        category: 'Practice',
        priority: 'Critical',
        title: 'Targeted Practice: Permutations & Combinations',
        message: 'Your accuracy in Permutations & Combinations is 40%.',
        actionLabel: 'Practice Questions',
        actionUrl: '/practice?topicId=20',
      },
    ]);
  });

  const renderComponent = () =>
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <InsightsPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

  it('renders header, overview cards and preset pills', async () => {
    renderComponent();

    expect(screen.getByText(/Analytics, Insights & CAT Mastery/i)).toBeInTheDocument();
    expect(screen.getByText('7 Days')).toBeInTheDocument();
    expect(screen.getByText('30 Days')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('14.5h')).toBeInTheDocument();
      expect(screen.getAllByText('80%').length).toBeGreaterThan(0);
      expect(screen.getByText(/5 days/i)).toBeInTheDocument();
    });
  });

  it('renders smart recommendations with critical priority and action deep link', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText(/Targeted Practice: Permutations & Combinations/i)).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
      const actionLink = screen.getByRole('link', { name: /Practice Questions/i });
      expect(actionLink).toHaveAttribute('href', '/practice?topicId=20');
    });
  });

  it('switches to CAT Mastery tab and displays subject cards and weak areas', async () => {
    renderComponent();

    const catTab = screen.getByRole('button', { name: /CAT Mastery/i });
    fireEvent.click(catTab);

    await waitFor(() => {
      expect(screen.getAllByText('Quantitative Aptitude').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Data Interpretation & Logical Reasoning').length).toBeGreaterThan(0);
      expect(screen.getByText('Needs Immediate Attention')).toBeInTheDocument();
      expect(screen.getAllByText('Permutations & Combinations').length).toBeGreaterThan(0);
    });
  });

  it('switches to Practice & Mocks tab and displays cohort policy statement', async () => {
    renderComponent();

    const practiceTab = screen.getByRole('button', { name: /Practice & Mocks/i });
    fireEvent.click(practiceTab);

    await waitFor(() => {
      expect(screen.getByText(/Practice Question Engine Performance/i)).toBeInTheDocument();
      expect(screen.getByText(/Cohort percentile unavailable \(Single-user mode\)/i)).toBeInTheDocument();
      expect(screen.getByText('CAT Full Length Mock 1')).toBeInTheDocument();
    });
  });

  it('switches to Retention & Habits tab and displays spaced repetition and habit streaks', async () => {
    renderComponent();

    const retTab = screen.getByRole('button', { name: /Retention & Habits/i });
    fireEvent.click(retTab);

    await waitFor(() => {
      expect(screen.getByText(/Spaced Repetition & Retention Health/i)).toBeInTheDocument();
      expect(screen.getByText(/Read 2 Editorial Passages/i)).toBeInTheDocument();
      expect(screen.getByText('8d')).toBeInTheDocument();
    });
  });

  it('switches to Mindset & Growth tab and displays aggregated mood metrics without text leakage', async () => {
    renderComponent();

    const mindsetTab = screen.getByRole('button', { name: /Mindset & Growth/i });
    fireEvent.click(mindsetTab);

    await waitFor(() => {
      expect(screen.getByText(/Morning Check-ins/i)).toBeInTheDocument();
      expect(screen.getByText(/Reflected Mood Balance/i)).toBeInTheDocument();
      expect(screen.getByText('Focused')).toBeInTheDocument();
      expect(screen.getByText('🎯')).toBeInTheDocument();
    });
  });
});
