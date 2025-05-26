
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, UserProfile } from './types';
import { UserRole } from '@/types';
import { toast } from 'sonner';
import { 
  fetchUserProfile, 
  createUserProfile, 
  updateUserRole as updateRole 
} from './profileUtils';
import { 
  loginWithEmailPassword, 
  signupWithEmailPassword, 
  logout as authLogout 
} from './authUtils';
import { checkPermission } from './permissions';

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  login: async () => {},
  logout: async () => {},
  signup: async () => {},
  loading: true,
  userProfile: null,
  updateUserRole: async () => {},
  hasPermission: () => false,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile data when user changes
  useEffect(() => {
    const handleUserChange = async () => {
      if (user) {
        const profile = await fetchUserProfile(user.id);
        
        if (profile) {
          setUserProfile(profile);
        } else {
          // If no profile exists, create one
          const newProfile = await createUserProfile(
            user.id,
            user.email,
            user.user_metadata?.name
          );
          
          if (newProfile) {
            setUserProfile(newProfile);
            console.log('Created new profile for user:', user.id);
          }
        }
      } else {
        setUserProfile(null);
      }
    };

    handleUserChange();
  }, [user]);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await loginWithEmailPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const signup = async (email: string, password: string) => {
    try {
      await signupWithEmailPassword(email, password);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Function to update a user's role (superadmin only)
  const updateUserRole = async (userId: string, role: UserRole) => {
    try {
      await updateRole(userId, role);
    } catch (error) {
      throw error;
    }
  };

  // Function to check if the current user has permission for a specific action
  const hasPermission = (action: 'create' | 'read' | 'update' | 'delete' | 'comment'): boolean => {
    return checkPermission(userProfile, action);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        loading,
        userProfile,
        updateUserRole,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
