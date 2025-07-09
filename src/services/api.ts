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


import axios from 'axios';

import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Use Zustand store directly to get the token, since it's persisted and hydrated
    // const token = useAuthStore.getState().token;
    const token = localStorage.getItem('accessToken');

    console.log("Token: ",token)
    if (token) {
      config.headers['Authorization'] = `JWT ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;
//     if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (refreshToken) {
//         try {
//           const { data } = await axios.post(`${API_BASE_URL}/auth/jwt/refresh/`, {
//             refresh: refreshToken,
//           });
//           localStorage.setItem('accessToken', data.access);
//           api.defaults.headers.common['Authorization'] = `JWT ${data.access}`;
//           return api(originalRequest);
//         } catch (refreshError) {
//           console.error('Token refresh failed', refreshError);
//           // Redirect to login or handle logout
//         }
//       }
//     }
//     return Promise.reject(error);
//   }
// );




export default api;

// Authentication APIs
export async function registerUser(userData: Partial<User>): Promise<User> {
  const response = await api.post('/auth/users/', userData)
  return response.data;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  const response = await  api.post('/auth/jwt/create/', {email,password})
  localStorage.setItem('accessToken', response.data.access);
  localStorage.setItem('refreshToken', response.data.refresh);
  return response.data
}

export async function refreshToken(refreshToken: string): Promise<{ access: string }> {
  const response = await  api.post('/auth/jwt/refresh/', {refreshToken})
  return response.data
}

export async function getCurrentUser(): Promise<User> {
  const response = await  api.get('/auth/users/me/')
  return response.data
}

export async function updateUser(userData: Partial<User>): Promise<User> {
  const response = await  api.put('/auth/users/me/', userData)
  return response.data
}

export async function updateEmail(emailData: Partial<User>): Promise<User> {
  const response = await  api.post('/auth/users/set_email/', emailData)
  return response.data
}

// Subject APIs
export const subjects = {
  updateSubject: (subjectId:string, subjectData:Subject) => api.put(`/subjects/${subjectId}/`, subjectData),
  patchSubject: (subjectId:string, subjectData:Subject) => api.patch(`/subjects/${subjectId}/`, subjectData),
  deleteSubject: (subjectId:string) => api.delete(`/subjects/${subjectId}/`),
};

export async function getSubjects(params?: {
  grade_level?: number;
  language?: string;
  search?: string;
}): Promise<Subject[]> {
  
  const response = await api.get<Subject[]>('/subjects/', {params})
  return response.data;
}

export async function getSubject(id: string): Promise<Subject> {
  const response = await api.get(`/subjects/${id}/`)
  return response.data;
}

export async function createSubject(subjectData: Omit<Subject, 'id'>): Promise<Subject> {
  const response = await api.post('/subjects/', subjectData)
  return response.data;
}




// Lesson APIs
export const lessons = {
  updateLesson: (subjectPk:string, lessonId:string, lessonData:Lesson) => api.put(`/subjects/${subjectPk}/lessons/${lessonId}/`, lessonData),
  patchLesson: (subjectPk:string, lessonId:string, lessonData:Lesson) => api.patch(`/subjects/${subjectPk}/lessons/${lessonId}/`, lessonData),
  deleteLesson: (subjectPk:string, lessonId:string) => api.delete(`/subjects/${subjectPk}/lessons/${lessonId}/`),
  verifyLesson: (subjectPk:string, lessonId:string) => api.get(`/subjects/${subjectPk}/lessons/${lessonId}/verify/`),
};

export async function getLessons(subjectId: string): Promise<Lesson[]> {
  const response = await api.get(`/subjects/${subjectId}/lessons/`)
  return response.data;}

export async function getLesson(subjectId: string, lessonId:string ): Promise<Lesson> {
  const response = await  api.get(`/subjects/${subjectId}/lessons/${lessonId}/`)
  return response.data;}

export async function createLesson(subjectId: string, title: string): Promise<Lesson> {
  const response = await api.post(`/subjects/${subjectId}/lessons/`, {title})
  return response.data;
}




// Quiz APIs
export const quizzes = {
  createQuiz: (subjectPk:string, lessonPk:string, quizData:Quiz) => api.post(`/subjects/${subjectPk}/lessons/${lessonPk}/quizzes/`, quizData),
  updateQuiz: (subjectPk:string, lessonPk:string, quizId:string, quizData:Quiz) => api.put(`/subjects/${subjectPk}/lessons/${lessonPk}/quizzes/${quizId}/`, quizData),
  patchQuiz: (subjectPk:string, lessonPk:string, quizId:string, quizData:Quiz) => api.patch(`/subjects/${subjectPk}/lessons/${lessonPk}/quizzes/${quizId}/`, quizData),
  deleteQuiz: (subjectPk:string, lessonPk:string, quizId:string) => api.delete(`/subjects/${subjectPk}/lessons/${lessonPk}/quizzes/${quizId}/`),
  submitQuiz: (submissionData) => api.post('/quizzes/submit/', submissionData),
};

export async function getQuizzes(subjectId: string, lessonId: string): Promise<Quiz[]> {
  const response = await api.get(`/subjects/${subjectId}/lessons/${lessonId}/quizzes/`)
  return response.data;
}

export async function getQuiz(subjectId: string, lessonId: string, quizId: string): Promise<Quiz> {
  const response = await api.get(`/subjects/${subjectId}/lessons/${lessonId}/quizzes/${quizId}/`)
  return response.data;}



  
  // Practice Task APIs
  export const practiceTasks = {
    createPracticeTask: (subjectPk:string, lessonPk:string, taskData:PracticeTask) => api.post(`/subjects/${subjectPk}/lessons/${lessonPk}/tasks/`, taskData),
    getPracticeTask: (subjectPk:string, lessonPk:string, taskId:string) => api.get(`/subjects/${subjectPk}/lessons/${lessonPk}/tasks/${taskId}/`),
    updatePracticeTask: (subjectPk:string, lessonPk:string, taskId:string, taskData:PracticeTask) => api.put(`/subjects/${subjectPk}/lessons/${lessonPk}/tasks/${taskId}/`, taskData),
    patchPracticeTask: (subjectPk:string, lessonPk:string, taskId:string, taskData:PracticeTask) => api.patch(`/subjects/${subjectPk}/lessons/${lessonPk}/tasks/${taskId}/`, taskData),
    deletePracticeTask: (subjectPk:string, lessonPk:string, taskId:string) => api.delete(`/subjects/${subjectPk}/lessons/${lessonPk}/tasks/${taskId}/`),
  };

export async function getPracticeTasks(subjectId: string, lessonId: string): Promise<PracticeTask[]> {
  const response = await api.get(`/subjects/${subjectId}/lessons/${lessonId}/tasks/`)
  return response.data;
}




// Student Profile APIs
export const student = {
  updateProfile: (profileData:{grade_level:number,language:string}) => api.put('/student/profile/', profileData),
  patchProfile: (profileData:{grade_level:number,language:string}) => api.patch('/student/profile/', profileData),
  getQuizAttempts: () => api.get('/quiz-attempts/'),
  getQuizAttempt: (attemptId:string) => api.get(`/quiz-attempts/${attemptId}/`),
};

export async function createStudentProfile(profileData: { language: string; current_grade: string }): Promise<StudentProfile> {
  const response = await api.post('/student/profile/create/', profileData)
  return response.data;
}

export async function getStudentProfile(): Promise<StudentProfile> {
  const response = await api.get('/student/profile/')
  return response.data;
}

// Enrollment APIs
export async function getEnrollments(): Promise<Enrollment[]> {
  const response = await api.get('/student/enrollments/')
  return response.data;
}

// Quiz Submission APIs
export async function submitQuiz(submission: Partial<QuizSubmission>): Promise<{
  attempt: QuizAttempt;
  ai_feedback: string;
  regenerated_quiz?: Quiz;
}> {
  const response = await api.get(`/quiz-attempts/${submission.quiz_id}/`)
  return response.data;
};



// Dashboard APIs

export const dashboard = {
  getStudentDashboard: () => api.get('/dashboard/student/'),
};
export async function getStudentDashboard(): Promise<StudentDashboard> {
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
  const response = await api.get('/dashboard/admin/')
  return response.data;
}

// Language APIs
export async function getLanguages(): Promise<Language[]> {
  console.log("Languages......")

  const response = await api.get('/languages/')
  return response.data;
}

// AI Assistant APIs
export async function getAiAssistance(request: AIAssistRequest): Promise<AIAssistResponse> {
  const response = await api.post('/ai/assist/', request)
  return response.data;
}