import { useState, useEffect } from "react";
import { AuthForm } from "./auth/AuthForm";
import { ProfileSetupForm } from "./profile/ProfileSetupForm";
import { Dashboard } from "./dashboard/Dashboard";
import { SubjectDetail } from "./subjects/SubjectDetail";
import { LessonDetail } from "./lessons/LessonDetail";
import { AIAssistant } from "./learning/AIAssistant";
import { OfflineProvider } from "./offline/OfflineProvider";
import { AccessibilityProvider } from "./accessibility/AccessibilityProvider";
import { ErrorBoundary } from "./error/ErrorBoundary";
import { useAuthStore } from "@/stores/authStore";
import { useEnrollments } from "@/hooks/useApiQueries";

type AppState = 'auth' | 'profile-setup' | 'dashboard' | 'subject-detail' | 'lesson-detail';
type AuthMode = 'login' | 'register';

export const EducationalApp = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  
  const { user, profile, isAuthenticated } = useAuthStore();
  const { data: enrollments = [] } = useEnrollments();

  // Update app state based on authentication status
  useEffect(() => {
    if (isAuthenticated) {
      if (!profile) {
        setAppState('profile-setup');
      } else {
        setAppState('dashboard');
      }
    } else {
      setAppState('auth');
    }
  }, [isAuthenticated, profile]);

  const handleAuth = (authData: any) => {
    // Authentication is now handled by the AuthForm and useLogin/useRegister hooks
    // The app state will be updated via the useEffect above
  };

  const handleProfileComplete = (profileData: any) => {
    // Profile creation is now handled by the ProfileSetupForm and useCreateProfile hook
    // The app state will be updated via the useEffect above
  };

  const handleSelectSubject = (subject: any) => {
    setSelectedSubject(subject);
    setAppState('subject-detail');
  };

  const handleSelectLesson = (lesson: any) => {
    setSelectedLesson(lesson);
    setAppState('lesson-detail');
  };

  const handleBackToDashboard = () => {
    setSelectedSubject(null);
    setAppState('dashboard');
  };

  const handleBackToSubject = () => {
    setSelectedLesson(null);
    setAppState('subject-detail');
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <OfflineProvider>
          {(() => {
            switch (appState) {
              case 'auth':
                return (
                  <AuthForm 
                    mode={authMode}
                    onToggleMode={toggleAuthMode}
                    onAuth={handleAuth}
                  />
                );

     case 'profile-setup':
       return (
         <ProfileSetupForm 
           onComplete={handleProfileComplete}
         />
       );

    case 'dashboard':
      return (
         <Dashboard 
           user={user}
           enrollments={enrollments}
           onSelectSubject={handleSelectSubject}
         />
      );

    case 'subject-detail':
      return (
        <SubjectDetail 
          subject={selectedSubject}
          onBack={handleBackToDashboard}
          onSelectLesson={handleSelectLesson}
        />
      );

    case 'lesson-detail':
      return (
        <LessonDetail 
          lesson={selectedLesson}
          subject={selectedSubject}
          onBack={handleBackToSubject}
        />
      );

              default:
                return <AuthForm mode={authMode} onToggleMode={toggleAuthMode} onAuth={handleAuth} />;
            }
          })()}
          <AIAssistant 
            subject={selectedSubject?.name} 
            lesson={selectedLesson?.title} 
          />
        </OfflineProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};