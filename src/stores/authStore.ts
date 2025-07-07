import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, StudentProfile } from '@/types/api';
import * as api from '@/services/api';
import { toast } from 'sonner';

interface AuthState {
  user: User | null;
  profile: StudentProfile | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  setProfile: (profile: StudentProfile) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      loading: false,

      login: async (email: string, password: string) => {
        try {
          set({ loading: true });
          
          const authResponse = await api.loginUser(email, password);
          const userData = await api.getCurrentUser();
          
          set({
            user: userData,
            isAuthenticated: true,
            accessToken: authResponse.access,
            refreshToken: authResponse.refresh,
            loading: false
          });

          // Try to fetch profile
          try {
            const profileData = await api.getStudentProfile();
            set({ profile: profileData });
          } catch (error) {
            // Profile might not exist yet, that's okay
            console.log('Profile not found, will need to create one');
          }

          toast.success('Successfully logged in!');
        } catch (error) {
          set({ loading: false });
          const errorMessage = error instanceof Error ? error.message : 'Login failed';
          toast.error(errorMessage);
          throw error;
        }
      },

      register: async (userData: Partial<User>) => {
        try {
          set({ loading: true });
          
          const newUser = await api.registerUser(userData);
          toast.success('Account created successfully! Please log in.');
          
          set({ loading: false });
        } catch (error) {
          set({ loading: false });
          const errorMessage = error instanceof Error ? error.message : 'Registration failed';
          toast.error(errorMessage);
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          profile: null,
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null
        });
        toast.success('Successfully logged out!');
      },

      refreshAuth: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await api.refreshToken(refreshToken);
          set({ accessToken: response.access });
        } catch (error) {
          // Refresh failed, logout user
          get().logout();
          throw error;
        }
      },

      setProfile: (profile: StudentProfile) => {
        set({ profile });
      },

      initializeAuth: async () => {
        const { accessToken, isAuthenticated } = get();
        
        if (isAuthenticated && accessToken) {
          try {
            // Verify token is still valid by fetching current user
            const userData = await api.getCurrentUser();
            set({ user: userData });
            
            // Try to fetch profile
            try {
              const profileData = await api.getStudentProfile();
              set({ profile: profileData });
            } catch (error) {
              console.log('Profile not found');
            }
          } catch (error) {
            // Token is invalid, logout
            get().logout();
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken
      })
    }
  )
);