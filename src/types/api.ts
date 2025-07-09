// API Types based on apidocs.md

export interface User {
  id: string;
  username: string;
  email: string;
  is_staff: boolean;
  first_name: string;
  last_name: string;
  dp: string | null;
}

export interface AuthResponse {
  access: string;
  refresh: string;
}

export interface Subject {
  id: string;
  name: string;
  description: string;
  grade_level: number;
  language: string;
}

export interface Lesson {
  id: string;
  instructor: string;
  subject: string;
  title: string;
  content: string;
  status: 'VE' | 'DR' 
  duration?: string; // Duration in minutes
  progress?: number; // Progress percentage
  created_at: string;
  verified_at: string | null;
}

export interface Question {
  id: string;
  question_text: string;
  correct_answer: string;
}

export interface Quiz {
  id: string;
  lesson: string;
  lesson_title: string;
  version: number;
  questions: Question[];
  ai_generated: boolean;
  created_at: string;
}

export interface PracticeTask {
  id: string;
  lesson: string;
  lesson_title: string;
  content: string;
  difficulty: 'EA' | 'ME' | 'HA'; // Easy, Medium, Hard
  ai_generated: boolean;
  created_at: string;
}

export interface StudentProfile {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  language: string;
  current_grade: string;
}

export interface Enrollment {
  id: string;
  student: string;
  subject: Subject;
  enrolled_at: string;
}

export interface QuizAttempt {
  id: string;
  student: User;
  quiz: Quiz;
  start_time: string;
  end_time: string;
  score: number;
  passed: boolean;
  cheating_detected: boolean;
}

export interface QuizResponse {
  question_id: string;
  answer: string;
}

export interface QuizSubmission {
  quiz_id: string;
  responses: QuizResponse[];
}

export interface StudentDashboard {
  student: StudentProfile;
  enrollments: Enrollment[];
  recent_attempts: QuizAttempt[];
  practice_tasks: PracticeTask[];
}

export interface AdminDashboard {
  total_students: number;
  total_lessons: number;
  total_subjects: number;
  total_quizzes: number;
  recent_lessons: Lesson[];
  recent_attempts: QuizAttempt[];
}

export interface Language {
  code: string;
  name: string;
}

export interface AIAssistRequest {
  message: string;
  context: string;
}

export interface AIAssistResponse {
  response: string;
}