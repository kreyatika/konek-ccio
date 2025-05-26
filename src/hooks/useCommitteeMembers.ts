
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types';
import { UserCommittee } from '@/types/supabase-types';

export const useCommitteeMembers = (committeeName: string) => {
  return useQuery({
    queryKey: ['committee-members', committeeName],
    queryFn: async () => {
      if (!committeeName) {
        return [];
      }
      
      // Query the user_committees table to get all users assigned to this committee
      const { data, error } = await supabase
        .from('user_committees')
        .select('*')
        .eq('committee', committeeName);
      
      if (error) {
        console.error('Error fetching committee members:', error);
        throw new Error('Failed to load committee members');
      }
      
      if (data.length === 0) {
        return [];
      }
      
      // Get the user IDs for this committee
      const userIds = (data as UserCommittee[]).map(row => row.user_id);
      
      // Fetch the profile information for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', userIds);
      
      if (profilesError) {
        console.error('Error fetching member profiles:', profilesError);
        throw new Error('Failed to load member profiles');
      }
      
      // Map profiles to User objects
      const committeeMembers: User[] = (profiles || []).map(profile => ({
        id: profile.id,
        name: profile.name || 'Unknown User',
        email: profile.email || '',
        role: profile.role || 'member',
        avatar: profile.avatar || '',
        committee: committeeName // Set the committee name for context
      }));
      
      return committeeMembers;
    },
    enabled: !!committeeName
  });
};
