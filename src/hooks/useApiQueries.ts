import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from '@/hooks/use-toast';
import {
  loginUser,
  registerUser,
  getSubjects,
  getSubject,
  getLessons,
  getLesson,
  getQuizzes,
  getQuiz,
  getPracticeTasks,
  getEnrollments,
  getStudentProfile,
  createStudentProfile,
  submitQuiz,
  getAiAssistance,
  getStudentDashboard
} from '@/services/api';
import {
  User,
  Subject,
  Lesson,
  Quiz,
  PracticeTask,
  Enrollment,
  StudentProfile,
  StudentDashboard,
  QuizSubmission,
  AIAssistRequest
} from '@/types/api';

// Auth hooks
export const useLogin = () => {
  const { setAuth, setLoading } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) => 
      loginUser(email, password),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (data, variables) => {
      // Create a user object for the store
      const user: User = {
        id: 1,
        username: variables.email.split('@')[0],
        email: variables.email,
        is_staff: false,
        first_name: '',
        last_name: '',
        dp: null
      };
      setAuth(user, data.access, data.refresh);
      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
      });
    },
    onError: (error: any) => {
      setLoading(false);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useRegister = () => {
  const { setAuth, setLoading } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userData: Partial<User>) => registerUser(userData),
    onMutate: () => {
      setLoading(true);
    },
    onSuccess: (user) => {
      // For demo purposes, also log them in after registration
      setAuth(user, 'demo_token', 'demo_refresh_token');
      toast({
        title: "Account Created!",
        description: "Welcome to our educational platform.",
      });
    },
    onError: (error: any) => {
      setLoading(false);
      toast({
        title: "Registration Failed",
        description: error.message || "Unable to create account. Please try again.",
        variant: "destructive"
      });
    }
  });
};

// Profile hooks
export const useCreateProfile = () => {
  const { setProfile } = useAuthStore();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (profileData: { language: string; current_grade: string }) =>
      createStudentProfile(profileData),
    onSuccess: (profile) => {
      setProfile(profile);
      toast({
        title: "Profile Created!",
        description: "Your learning profile has been set up.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Profile Creation Failed",
        description: error.message || "Unable to create profile. Please try again.",
        variant: "destructive"
      });
    }
  });
};

export const useStudentProfile = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['student-profile'],
    queryFn: getStudentProfile,
    enabled: isAuthenticated,
  });
};

// Subject hooks
export const useSubjects = (params?: {
  grade_level?: number;
  language?: string;
  search?: string;
}) => {
  return useQuery({
    queryKey: ['subjects', params],
    queryFn: () => getSubjects(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSubject = (id: number) => {
  return useQuery({
    queryKey: ['subject', id],
    queryFn: () => getSubject(id),
    enabled: !!id,
  });
};

// Lesson hooks
export const useLessons = (subjectId: number) => {
  return useQuery({
    queryKey: ['lessons', subjectId],
    queryFn: () => getLessons(subjectId),
    enabled: !!subjectId,
  });
};

export const useLesson = (subjectId: number, lessonId: number) => {
  return useQuery({
    queryKey: ['lesson', subjectId, lessonId],
    queryFn: () => getLesson(subjectId, lessonId),
    enabled: !!subjectId && !!lessonId,
  });
};

// Quiz hooks
export const useQuizzes = (subjectId: number, lessonId: number) => {
  return useQuery({
    queryKey: ['quizzes', subjectId, lessonId],
    queryFn: () => getQuizzes(subjectId, lessonId),
    enabled: !!subjectId && !!lessonId,
  });
};

export const useQuiz = (subjectId: number, lessonId: number, quizId: number) => {
  return useQuery({
    queryKey: ['quiz', subjectId, lessonId, quizId],
    queryFn: () => getQuiz(subjectId, lessonId, quizId),
    enabled: !!subjectId && !!lessonId && !!quizId,
  });
};

export const useSubmitQuiz = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (submission: QuizSubmission) => submitQuiz(submission),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['student-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      
      const passed = data.attempt.passed;
      toast({
        title: passed ? "Quiz Passed!" : "Quiz Completed",
        description: `Score: ${Math.round(data.attempt.score)}%. ${data.ai_feedback}`,
        variant: passed ? "default" : "destructive"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Quiz Submission Failed",
        description: error.message || "Unable to submit quiz. Please try again.",
        variant: "destructive"
      });
    }
  });
};

// Practice tasks
export const usePracticeTasks = (subjectId: number, lessonId: number) => {
  return useQuery({
    queryKey: ['practice-tasks', subjectId, lessonId],
    queryFn: () => getPracticeTasks(subjectId, lessonId),
    enabled: !!subjectId && !!lessonId,
  });
};

// Enrollment hooks
export const useEnrollments = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['enrollments'],
    queryFn: getEnrollments,
    enabled: isAuthenticated,
  });
};

// Dashboard hooks
export const useStudentDashboard = () => {
  const { isAuthenticated } = useAuthStore();
  
  return useQuery({
    queryKey: ['student-dashboard'],
    queryFn: getStudentDashboard,
    enabled: isAuthenticated,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// AI Assistant hooks
export const useAiAssistance = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (request: AIAssistRequest) => getAiAssistance(request),
    onError: (error: any) => {
      toast({
        title: "AI Assistant Error",
        description: error.message || "Unable to get AI assistance. Please try again.",
        variant: "destructive"
      });
    }
  });
};