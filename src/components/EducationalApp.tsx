import { useState } from "react";
import { AuthForm } from "./auth/AuthForm";
import { ProfileSetup } from "./profile/ProfileSetup";
import { Dashboard } from "./dashboard/Dashboard";
import { SubjectDetail } from "./subjects/SubjectDetail";
import { LessonDetail } from "./lessons/LessonDetail";
import { AIAssistant } from "./learning/AIAssistant";
import { OfflineProvider } from "./offline/OfflineProvider";
import { AccessibilityProvider } from "./accessibility/AccessibilityProvider";
import { ErrorBoundary } from "./error/ErrorBoundary";

type AppState = 'auth' | 'profile-setup' | 'dashboard' | 'subject-detail' | 'lesson-detail';
type AuthMode = 'login' | 'register';

export const EducationalApp = () => {
  const [appState, setAppState] = useState<AppState>('auth');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  const handleAuth = (authData: any) => {
    setUser(authData.user);
    setAppState('profile-setup');
  };

  const handleProfileComplete = (profileData: any) => {
    setProfile(profileData);
    setAppState('dashboard');
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
        <ProfileSetup 
          onComplete={handleProfileComplete}
        />
      );

    case 'dashboard':
      return (
        <Dashboard 
          user={user}
          enrollments={profile?.enrollments || []}
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