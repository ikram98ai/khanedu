// React hooks for API calls
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import * as api from "@/services/demo_api";
import {
  User,
  Subject,
  Lesson,
  Quiz,
  PracticeTask,
  StudentProfile,
  Enrollment,
  StudentDashboard,
  Language,
  QuizSubmission,
} from "@/types/api";

// Generic hook for API calls
export function useAsyncOperation<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (operation: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);
      const result = await operation();
      setData(result);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, execute };
}

// Authentication hooks
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { loading, execute } = useAsyncOperation<any>();

  const login = useCallback(
    async (email: string, password: string) => {
      const authResponse = await execute(() => api.loginUser(email, password));
      if (authResponse) {
        localStorage.setItem("accessToken", authResponse.access);
        localStorage.setItem("refreshToken", authResponse.refresh);
        const userData = await api.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
        toast.success("Successfully logged in!");
      }
      return authResponse;
    },
    [execute]
  );

  const register = useCallback(
    async (userData: Partial<User>) => {
      const newUser = await execute(() => api.registerUser(userData));
      if (newUser) {
        toast.success("Account created successfully!");
      }
      return newUser;
    },
    [execute]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Successfully logged out!");
  }, []);

  return { user, isAuthenticated, login, register, logout, loading };
}

// Subject hooks
export function useSubjects(params?: {
  grade_level?: number;
  language?: string;
  search?: string;
}) {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { loading, error, execute } = useAsyncOperation<Subject[]>();

  useEffect(() => {
    execute(() => api.getSubjects(params)).then(setSubjects);
  }, [execute, params?.grade_level, params?.language, params?.search]);

  return {
    subjects,
    loading,
    error,
    refetch: () => execute(() => api.getSubjects(params)).then(setSubjects),
  };
}

export function useSubject(id: number) {
  const [subject, setSubject] = useState<Subject | null>(null);
  const { loading, error, execute } = useAsyncOperation<Subject>();

  useEffect(() => {
    if (id) {
      execute(() => api.getSubject(id)).then(setSubject);
    }
  }, [execute, id]);

  return { subject, loading, error };
}

// Lesson hooks
export function useLessons(subjectId: number) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const { loading, error, execute } = useAsyncOperation<Lesson[]>();

  useEffect(() => {
    if (subjectId) {
      execute(() => api.getLessons(subjectId)).then(setLessons);
    }
  }, [execute, subjectId]);

  const createLesson = useCallback(
    async (title: string) => {
      try {
        const newLesson = await api.createLesson(subjectId, title);
        setLessons((prev) => [...prev, newLesson]);
        toast.success("Lesson created successfully!");
        return newLesson;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create lesson";
        toast.error(errorMessage);
        throw error;
      }
    },
    [subjectId]
  );

  return { lessons, loading, error, createLesson };
}

export function useLesson(subjectId: number, lessonId: number) {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const { loading, error, execute } = useAsyncOperation<Lesson>();

  useEffect(() => {
    if (subjectId && lessonId) {
      execute(() => api.getLesson(subjectId, lessonId)).then(setLesson);
    }
  }, [execute, subjectId, lessonId]);

  return { lesson, loading, error };
}

// Quiz hooks
export function useQuizzes(subjectId: number, lessonId: number) {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const { loading, error, execute } = useAsyncOperation<Quiz[]>();

  useEffect(() => {
    if (subjectId && lessonId) {
      execute(() => api.getQuizzes(subjectId, lessonId)).then(setQuizzes);
    }
  }, [execute, subjectId, lessonId]);

  return { quizzes, loading, error };
}

export function useQuizSubmission() {
  const { loading, execute } = useAsyncOperation<any>();

  const submitQuiz = useCallback(
    async (submission: QuizSubmission) => {
      const result = await execute(() => api.submitQuiz(submission));
      if (result) {
        toast.success(
          `Quiz completed! Score: ${result.attempt.score.toFixed(1)}%`
        );
      }
      return result;
    },
    [execute]
  );

  return { submitQuiz, loading };
}

// Practice Task hooks
export function usePracticeTasks(subjectId: number, lessonId: number) {
  const [tasks, setTasks] = useState<PracticeTask[]>([]);
  const { loading, error, execute } = useAsyncOperation<PracticeTask[]>();

  useEffect(() => {
    if (subjectId && lessonId) {
      execute(() => api.getPracticeTasks(subjectId, lessonId)).then(setTasks);
    }
  }, [execute, subjectId, lessonId]);

  return { tasks, loading, error };
}

// Student Profile hooks
export function useStudentProfile() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const { loading, error, execute } = useAsyncOperation<StudentProfile>();

  const createProfile = useCallback(
    async (profileData: { language: string; current_grade: string }) => {
      const newProfile = await execute(() =>
        api.createStudentProfile(profileData)
      );
      if (newProfile) {
        setProfile(newProfile);
        toast.success("Profile created successfully!");
      }
      return newProfile;
    },
    [execute]
  );

  const fetchProfile = useCallback(async () => {
    const profileData = await execute(() => api.getStudentProfile());
    if (profileData) {
      setProfile(profileData);
    }
    return profileData;
  }, [execute]);

  return { profile, loading, error, createProfile, fetchProfile };
}

// Enrollment hooks
export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const { loading, error, execute } = useAsyncOperation<Enrollment[]>();

  useEffect(() => {
    execute(() => api.getEnrollments()).then(setEnrollments);
  }, [execute]);

  return { enrollments, loading, error };
}

// Dashboard hooks
export function useStudentDashboard() {
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const { loading, error, execute } = useAsyncOperation<StudentDashboard>();

  useEffect(() => {
    execute(() => api.getStudentDashboard()).then(setDashboard);
  }, [execute]);

  return { dashboard, loading, error };
}

// Language hooks
export function useLanguages() {
  const [languages, setLanguages] = useState<Language[]>([]);
  const { loading, error, execute } = useAsyncOperation<Language[]>();

  useEffect(() => {
    execute(() => api.getLanguages()).then(setLanguages);
  }, [execute]);

  return { languages, loading, error };
}

// AI Assistant hooks
export function useAIAssistant() {
  const { loading, execute } = useAsyncOperation<any>();

  const getAssistance = useCallback(
    async (message: string, context: string) => {
      const response = await execute(() =>
        api.getAiAssistance({ message, context })
      );
      return response?.response;
    },
    [execute]
  );

  return { getAssistance, loading };
}
