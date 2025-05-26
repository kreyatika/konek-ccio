import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Log in a user with email and password
 */
export const loginWithEmailPassword = async (email: string, password: string): Promise<any> => {
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    toast.success('Logged in successfully');
    return data.user;
  } catch (error: any) {
    toast.error(error.message || 'Failed to login');
    throw error;
  }
};

/**
 * Sign up a new user with email and password
 */
export const signupWithEmailPassword = async (email: string, password: string): Promise<any> => {
  try {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/email-confirmation`
      }
    });
    
    if (error) throw error;
    
    toast.success('Signup successful! Please check your email to confirm your account.');
    return data.user;
  } catch (error: any) {
    toast.error(error.message || 'Failed to sign up');
    throw error;
  }
};

/**
 * Change the current user's password
 */
export const changePassword = async (newPassword: string): Promise<void> => {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    
    if (error) throw error;
    
    toast.success('Password updated successfully');
  } catch (error: any) {
    toast.error(error.message || 'Failed to update password');
    throw error;
  }
};

/**
 * Log out the current user and redirect to login page
 */
export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Redirect to the login page instead of register
    window.location.href = '/login';
    
    toast.success('Logged out successfully');
  } catch (error: any) {
    toast.error(error.message || 'Error logging out');
    console.error('Logout error:', error);
  }
};
