
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserProfile } from './types';
import { UserRole } from '@/types';

/**
 * Fetch user profile from Supabase
 */
export const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) throw error;
    
    return data as UserProfile | null;
  } catch (error: any) {
    console.error('Error fetching user profile:', error.message);
    toast.error('Error loading user profile');
    return null;
  }
};

/**
 * Check if any users exist in the system
 */
export const checkIfFirstUser = async (): Promise<boolean> => {
  try {
    const { count, error } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) throw error;
    
    return count === 0;
  } catch (error: any) {
    console.error('Error checking if first user:', error.message);
    return false;
  }
};

/**
 * Create a new user profile in Supabase
 */
export const createUserProfile = async (
  userId: string, 
  email: string, 
  name?: string
): Promise<UserProfile | null> => {
  try {
    console.log('Creating profile for user:', userId, email);
    
    const existingProfile = await fetchUserProfile(userId);
    if (existingProfile) {
      console.log('Profile already exists, returning existing profile');
      return existingProfile;
    }
    
    const isFirstUser = await checkIfFirstUser();
    const defaultRole: UserRole = isFirstUser ? 'superadmin' : 'member';
    
    const newProfile = {
      id: userId,
      email,
      name: name || email.split('@')[0],
      role: defaultRole
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .upsert(newProfile, { onConflict: 'id' })
      .select()
      .single();
      
    if (error) {
      console.error('Supabase error creating profile:', error);
      throw error;
    }
    
    console.log('Profile created successfully:', data);
    return data as UserProfile;
  } catch (error: any) {
    console.error('Error creating user profile:', error.message);
    if (error.message && error.message.includes('policy')) {
      console.log('This appears to be an RLS policy error');
      const maybeProfile = await fetchUserProfile(userId);
      if (maybeProfile) {
        console.log('Profile found after all, returning it');
        return maybeProfile;
      }
    }
    
    toast.error('Error creating user profile');
    return null;
  }
};

/**
 * Update a user's role
 */
export const updateUserRole = async (userId: string, role: UserRole): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) throw error;
    
    toast.success(`User role updated to ${role}`);
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Failed to update user role');
    return false;
  }
};

/**
 * Add a user to a committee
 */
export const addUserToCommittee = async (userId: string, committee: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_committees')
      .insert([{ user_id: userId, committee }]);

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        // User is already in this committee, just notify
        toast.info(`User is already assigned to ${committee}`);
        return true;
      }
      throw error;
    }
    
    toast.success(`User added to ${committee}`);
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Failed to add user to committee');
    return false;
  }
};

/**
 * Remove a user from a committee
 */
export const removeUserFromCommittee = async (userId: string, committee: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('user_committees')
      .delete()
      .eq('user_id', userId)
      .eq('committee', committee);

    if (error) throw error;
    
    toast.success(`User removed from ${committee}`);
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Failed to remove user from committee');
    return false;
  }
};

/**
 * Update a user's committees (legacy method)
 * Now deprecated, use addUserToCommittee and removeUserFromCommittee instead
 */
export const updateUserCommittee = async (userId: string, committee?: string): Promise<boolean> => {
  // For backward compatibility, route to the new functions
  try {
    if (committee) {
      return await addUserToCommittee(userId, committee);
    } else {
      // If no committee is specified, we would need to remove from all committees
      // but since we don't know which committees the user is in, let's inform about the limitation
      toast.warning('Committee removal requires specifying the committee name');
      return false;
    }
  } catch (error: any) {
    toast.error(error.message || 'Failed to update user committee');
    return false;
  }
};

/**
 * Delete a user's avatar
 */
export const deleteAvatar = async (userId: string, avatarPath: string): Promise<boolean> => {
  try {
    // Extract the file name from the URL
    const urlParts = avatarPath.split('/');
    const fileName = urlParts[urlParts.length - 1];
    const filePath = `${userId}/${fileName}`;

    // Delete the file from storage
    const { error: storageError } = await supabase.storage
      .from('avatars')
      .remove([filePath]);

    if (storageError) throw storageError;

    // Update the user profile to remove the avatar reference
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ avatar: null })
      .eq('id', userId);

    if (profileError) throw profileError;
    
    toast.success('Avatar removed successfully');
    return true;
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete avatar');
    return false;
  }
};
