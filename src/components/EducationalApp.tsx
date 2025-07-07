import { useState, useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ProfileSetupForm } from "@/components/profile/ProfileSetupForm";
import { OfflineProvider } from "@/components/offline/OfflineProvider";
import { AccessibilityProvider } from "@/components/accessibility/AccessibilityProvider";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { useAuth } from "@/providers/AuthProvider";

export const EducationalApp = () => {
  const [currentView, setCurrentView] = useState<'auth' | 'profile' | 'dashboard'>('auth');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, profile, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      if (profile) {
        setCurrentView('dashboard');
      } else {
        setCurrentView('profile');
      }
    } else {
      setCurrentView('auth');
    }
  }, [isAuthenticated, profile]);

  const handleAuth = (data: any) => {
    // Auth state is managed by Zustand store, view will update via useEffect
  };

  const handleProfileSetup = () => {
    setCurrentView('dashboard');
  };

  const toggleAuthMode = () => {
    setAuthMode(prev => prev === 'login' ? 'register' : 'login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/20">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mb-4 mx-auto">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <p className="text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <OfflineProvider>
          {currentView === 'auth' && (
            <AuthForm 
              mode={authMode}
              onToggleMode={toggleAuthMode}
              onAuth={handleAuth}
            />
          )}
          
          {currentView === 'profile' && (
            <ProfileSetupForm onComplete={handleProfileSetup} />
          )}
          
          {currentView === 'dashboard' && (
            <Dashboard />
          )}
        </OfflineProvider>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};