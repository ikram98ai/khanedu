import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import * as api from '@/services/api';
import { 
  Subject, 
  Lesson, 
  Quiz, 
  PracticeTask, 
  StudentDashboard, 
  Language, 
  QuizSubmission,
  StudentProfile 
} from '@/types/api';

// Query Keys
export const queryKeys = {
  subjects: (params?: { grade_level?: number; language?: string; search?: string }) => 
    ['subjects', params] as const,
  subject: (id: number) => ['subject', id] as const,
  lessons: (subjectId: number) => ['lessons', subjectId] as const,
  lesson: (subjectId: number, lessonId: number) => ['lesson', subjectId, lessonId] as const,
  quizzes: (subjectId: number, lessonId: number) => ['quizzes', subjectId, lessonId] as const,
  practiceTasks: (subjectId: number, lessonId: number) => ['practiceTasks', subjectId, lessonId] as const,
  studentDashboard: () => ['studentDashboard'] as const,
  studentProfile: () => ['studentProfile'] as const,
  enrollments: () => ['enrollments'] as const,
  languages: () => ['languages'] as const,
};

// Subject Queries
export const useSubjects = (params?: { grade_level?: number; language?: string; search?: string }) => {
  return useQuery({
    queryKey: queryKeys.subjects(params),
    queryFn: () => api.getSubjects(params),
  });
};

export const useSubject = (id: number) => {
  return useQuery({
    queryKey: queryKeys.subject(id),
    queryFn: () => api.getSubject(id),
    enabled: !!id,
  });
};

// Lesson Queries
export const useLessons = (subjectId: number) => {
  return useQuery({
    queryKey: queryKeys.lessons(subjectId),
    queryFn: () => api.getLessons(subjectId),
    enabled: !!subjectId,
  });
};

export const useLesson = (subjectId: number, lessonId: number) => {
  return useQuery({
    queryKey: queryKeys.lesson(subjectId, lessonId),
    queryFn: () => api.getLesson(subjectId, lessonId),
    enabled: !!(subjectId && lessonId),
  });
};

// Quiz Queries
export const useQuizzes = (subjectId: number, lessonId: number) => {
  return useQuery({
    queryKey: queryKeys.quizzes(subjectId, lessonId),
    queryFn: () => api.getQuizzes(subjectId, lessonId),
    enabled: !!(subjectId && lessonId),
  });
};

// Practice Task Queries
export const usePracticeTasks = (subjectId: number, lessonId: number) => {
  return useQuery({
    queryKey: queryKeys.practiceTasks(subjectId, lessonId),
    queryFn: () => api.getPracticeTasks(subjectId, lessonId),
    enabled: !!(subjectId && lessonId),
  });
};

// Dashboard Queries
export const useStudentDashboard = () => {
  return useQuery({
    queryKey: queryKeys.studentDashboard(),
    queryFn: api.getStudentDashboard,
  });
};

export const useStudentProfile = () => {
  return useQuery({
    queryKey: queryKeys.studentProfile(),
    queryFn: api.getStudentProfile,
  });
};

export const useEnrollments = () => {
  return useQuery({
    queryKey: queryKeys.enrollments(),
    queryFn: api.getEnrollments,
  });
};

export const useLanguages = () => {
  return useQuery({
    queryKey: queryKeys.languages(),
    queryFn: api.getLanguages,
  });
};

// Mutations
export const useCreateStudentProfile = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (profileData: { language: string; current_grade: string }) =>
      api.createStudentProfile(profileData),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.studentProfile(), data);
      queryClient.invalidateQueries({ queryKey: queryKeys.studentDashboard() });
      toast.success('Profile created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create profile: ${error.message}`);
    },
  });
};

export const useCreateLesson = (subjectId: number) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (title: string) => api.createLesson(subjectId, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.lessons(subjectId) });
      toast.success('Lesson created successfully!');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create lesson: ${error.message}`);
    },
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (submission: QuizSubmission) => api.submitQuiz(submission),
    onSuccess: (data) => {
      // Invalidate dashboard to show updated progress
      queryClient.invalidateQueries({ queryKey: queryKeys.studentDashboard() });
      toast.success(`Quiz completed! Score: ${data.attempt.score.toFixed(1)}%`);
    },
    onError: (error: Error) => {
      toast.error(`Failed to submit quiz: ${error.message}`);
    },
  });
};

export const useAIAssistance = () => {
  return useMutation({
    mutationFn: ({ message, context }: { message: string; context: string }) =>
      api.getAiAssistance({ message, context }),
    onError: (error: Error) => {
      toast.error(`AI assistance failed: ${error.message}`);
    },
  });
};