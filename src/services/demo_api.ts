// API Service Layer with Dummy Data
import { 
  User, 
  AuthResponse, 
  Subject, 
  Lesson, 
  Quiz, 
  PracticeTask, 
  StudentProfile, 
  Enrollment, 
  QuizAttempt,
  StudentDashboard,
  AdminDashboard,
  Language,
  AIAssistRequest,
  AIAssistResponse,
  QuizSubmission
} from '@/types/api';

// Dummy Data
const DUMMY_USER: User = {
  id: 1,
  username: 'john_doe',
  email: 'john@example.com',
  is_staff: false,
  first_name: 'John',
  last_name: 'Doe',
  dp: null
};

const DUMMY_SUBJECTS: Subject[] = [
  {
    id: 1,
    name: 'Mathematics',
    description: 'Advanced mathematics concepts including algebra, calculus, and statistics',
    grade_level: 10,
    language: 'EN'
  },
  {
    id: 2,
    name: 'Physics',
    description: 'Fundamental physics principles and quantum mechanics',
    grade_level: 11,
    language: 'EN'
  },
  {
    id: 3,
    name: 'Computer Science',
    description: 'Programming fundamentals, algorithms, and data structures',
    grade_level: 12,
    language: 'EN'
  }
];

const DUMMY_LESSONS: Lesson[] = [
  {
    id: 1,
    instructor: 'prof_smith',
    subject: 'Mathematics',
    title: 'Introduction to Algebra',
    content: 'This lesson covers the basic concepts of algebra including variables, equations, and problem-solving techniques...',
    status: 'PU',
    created_at: '2024-01-15T10:00:00Z',
    verified_at: '2024-01-16T14:30:00Z'
  },
  {
    id: 2,
    instructor: 'prof_johnson',
    subject: 'Physics',
    title: 'Newton\'s Laws of Motion',
    content: 'Understanding the three fundamental laws that describe the relationship between forces and motion...',
    status: 'PU',
    created_at: '2024-01-20T09:00:00Z',
    verified_at: '2024-01-21T11:15:00Z'
  }
];

const DUMMY_LANGUAGES: Language[] = [
  { code: 'EN', name: 'English' },
  { code: 'ES', name: 'Spanish' },
  { code: 'FR', name: 'French' },
  { code: 'DE', name: 'German' }
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Authentication APIs
export async function registerUser(userData: Partial<User>): Promise<User> {
  await delay(1000);
  return { ...DUMMY_USER, ...userData, id: Math.floor(Math.random() * 1000) };
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  await delay(800);
  return {
    access: 'dummy_access_token_' + Math.random().toString(36).substr(2, 9),
    refresh: 'dummy_refresh_token_' + Math.random().toString(36).substr(2, 9)
  };
}

export async function refreshToken(refreshToken: string): Promise<{ access: string }> {
  await delay(500);
  return {
    access: 'new_dummy_access_token_' + Math.random().toString(36).substr(2, 9)
  };
}

export async function getCurrentUser(): Promise<User> {
  await delay(600);
  return DUMMY_USER;
}

export async function updateUser(userData: Partial<User>): Promise<User> {
  await delay(800);
  return { ...DUMMY_USER, ...userData };
}

// Subject APIs
export async function getSubjects(params?: {
  grade_level?: number;
  language?: string;
  search?: string;
}): Promise<Subject[]> {
  await delay(700);
  let filteredSubjects = [...DUMMY_SUBJECTS];
  
  if (params?.grade_level) {
    filteredSubjects = filteredSubjects.filter(s => s.grade_level === params.grade_level);
  }
  if (params?.language) {
    filteredSubjects = filteredSubjects.filter(s => s.language === params.language);
  }
  if (params?.search) {
    filteredSubjects = filteredSubjects.filter(s => 
      s.name.toLowerCase().includes(params.search!.toLowerCase()) ||
      s.description.toLowerCase().includes(params.search!.toLowerCase())
    );
  }
  
  return filteredSubjects;
}

export async function getSubject(id: number): Promise<Subject> {
  await delay(500);
  const subject = DUMMY_SUBJECTS.find(s => s.id === id);
  if (!subject) throw new Error('Subject not found');
  return subject;
}

export async function createSubject(subjectData: Omit<Subject, 'id'>): Promise<Subject> {
  await delay(1000);
  return { ...subjectData, id: Math.floor(Math.random() * 1000) };
}

// Lesson APIs
export async function getLessons(subjectId: number): Promise<Lesson[]> {
  await delay(800);
  return DUMMY_LESSONS.filter(lesson => lesson.subject === DUMMY_SUBJECTS.find(s => s.id === subjectId)?.name);
}

export async function getLesson(subjectId: number, lessonId: number): Promise<Lesson> {
  await delay(600);
  const lesson = DUMMY_LESSONS.find(l => l.id === lessonId);
  if (!lesson) throw new Error('Lesson not found');
  return lesson;
}

export async function createLesson(subjectId: number, title: string): Promise<Lesson> {
  await delay(1500); // AI generation takes longer
  const subject = DUMMY_SUBJECTS.find(s => s.id === subjectId);
  return {
    id: Math.floor(Math.random() * 1000),
    instructor: 'current_user',
    subject: subject?.name || 'Unknown',
    title,
    content: 'AI-generated lesson content will appear here...',
    status: 'DR',
    created_at: new Date().toISOString(),
    verified_at: null
  };
}

// Quiz APIs
export async function getQuizzes(subjectId: number, lessonId: number): Promise<Quiz[]> {
  await delay(700);
  return [
    {
      id: 1,
      lesson: lessonId,
      lesson_title: DUMMY_LESSONS.find(l => l.id === lessonId)?.title || 'Unknown Lesson',
      version: 1,
      questions: [
        { id: 1, question_text: 'What is 2 + 2?', correct_answer: '4' },
        { id: 2, question_text: 'What is the square root of 16?', correct_answer: '4' }
      ],
      ai_generated: true,
      created_at: new Date().toISOString()
    }
  ];
}

export async function getQuiz(subjectId: number, lessonId: number, quizId: number): Promise<Quiz> {
  await delay(500);
  const quizzes = await getQuizzes(subjectId, lessonId);
  const quiz = quizzes.find(q => q.id === quizId);
  if (!quiz) throw new Error('Quiz not found');
  return quiz;
}

// Practice Task APIs
export async function getPracticeTasks(subjectId: number, lessonId: number): Promise<PracticeTask[]> {
  await delay(600);
  return [
    {
      id: 1,
      lesson: lessonId,
      lesson_title: DUMMY_LESSONS.find(l => l.id === lessonId)?.title || 'Unknown Lesson',
      content: 'Practice solving linear equations with these interactive exercises...',
      difficulty: 'ME',
      ai_generated: true,
      created_at: new Date().toISOString()
    }
  ];
}

// Student Profile APIs
export async function createStudentProfile(profileData: { language: string; current_grade: string }): Promise<StudentProfile> {
  await delay(800);
  return {
    id: 1,
    username: DUMMY_USER.username,
    email: DUMMY_USER.email,
    first_name: DUMMY_USER.first_name,
    last_name: DUMMY_USER.last_name,
    ...profileData
  };
}

export async function getStudentProfile(): Promise<StudentProfile> {
  await delay(600);
  return {
    id: 1,
    username: DUMMY_USER.username,
    email: DUMMY_USER.email,
    first_name: DUMMY_USER.first_name,
    last_name: DUMMY_USER.last_name,
    language: 'EN',
    current_grade: 'GR10'
  };
}

// Enrollment APIs
export async function getEnrollments(): Promise<Enrollment[]> {
  await delay(700);
  return [
    {
      id: 1,
      student: DUMMY_USER.username,
      subject: 'Mathematics',
      enrolled_at: '2024-01-10T00:00:00Z'
    },
    {
      id: 2,
      student: DUMMY_USER.username,
      subject: 'Physics',
      enrolled_at: '2024-01-12T00:00:00Z'
    }
  ];
}

// Quiz Submission APIs
export async function submitQuiz(submission: QuizSubmission): Promise<{
  attempt: QuizAttempt;
  ai_feedback: string;
  regenerated_quiz?: Quiz;
}> {
  await delay(2000); // AI processing takes time
  const attempt: QuizAttempt = {
    id: Math.floor(Math.random() * 1000),
    student: DUMMY_USER,
    quiz: {
      id: submission.quiz_id,
      lesson: 1,
      lesson_title: 'Sample Quiz',
      version: 1,
      questions: [],
      ai_generated: true,
      created_at: new Date().toISOString()
    },
    start_time: new Date(Date.now() - 600000).toISOString(),
    end_time: new Date().toISOString(),
    score: Math.random() * 100,
    passed: Math.random() > 0.3,
    cheating_detected: false
  };

  return {
    attempt,
    ai_feedback: 'Great job! You demonstrated strong understanding of the core concepts. Consider reviewing the advanced topics for even better performance.'
  };
}

// Dashboard APIs
export async function getStudentDashboard(): Promise<StudentDashboard> {
  await delay(1000);
  const profile = await getStudentProfile();
  const enrollments = await getEnrollments();
  
  return {
    student: profile,
    enrollments,
    recent_attempts: [],
    practice_tasks: []
  };
}

export async function getAdminDashboard(): Promise<AdminDashboard> {
  await delay(1200);
  return {
    total_students: 1250,
    total_lessons: 45,
    total_subjects: 8,
    total_quizzes: 180,
    recent_lessons: DUMMY_LESSONS.slice(0, 5),
    recent_attempts: []
  };
}

// Language APIs
export async function getLanguages(): Promise<Language[]> {
  await delay(400);
  return DUMMY_LANGUAGES;
}

// AI Assistant APIs
export async function getAiAssistance(request: AIAssistRequest): Promise<AIAssistResponse> {
  await delay(1500); // AI processing
  return {
    response: `Based on your question about "${request.message}", here are some key insights and guidance tailored to your learning context...`
  };
}