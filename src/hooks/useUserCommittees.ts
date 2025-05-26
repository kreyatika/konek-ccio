
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserCommittee } from '@/types/supabase-types';

export const useUserCommittees = (userId: string) => {
  const queryClient = useQueryClient();
  
  // Fetch committees assigned to a specific user
  const { data: committees = [], isLoading, error } = useQuery({
    queryKey: ['user-committees', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_committees')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error fetching user committees:', error);
        throw new Error('Failed to load user committees');
      }
      
      // Extract just the committee names from the results
      return (data as UserCommittee[] || []).map((item) => item.committee);
    },
    enabled: !!userId,
    staleTime: 10000, // Keep data fresh for 10 seconds
  });

  // Add a user to a committee
  const addToCommittee = useMutation({
    mutationFn: async ({ userId, committee }: { userId: string; committee: string }) => {
      const { data, error } = await supabase
        .from('user_committees')
        .insert([{ user_id: userId, committee }])
        .select()
        .single();
        
      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          console.log('User is already in this committee');
          return null; // User already in committee, not really an error
        }
        console.error('Error adding user to committee:', error);
        throw error;
      }
      
      return data;
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['user-committees', userId] });
      
      // Snapshot the previous value
      const previousCommittees = queryClient.getQueryData<string[]>(['user-committees', userId]);
      
      // Optimistically update the cache
      if (previousCommittees && !previousCommittees.includes(variables.committee)) {
        queryClient.setQueryData(['user-committees', userId], [...previousCommittees, variables.committee]);
      }
      
      return { previousCommittees };
    },
    onSuccess: () => {
      // We don't need to do anything here as the optimistic update is already applied
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCommittees) {
        queryClient.setQueryData(['user-committees', userId], context.previousCommittees);
      }
      toast.error(`Failed to add user to committee: ${error.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is up to date
      queryClient.invalidateQueries({ queryKey: ['user-committees', userId] });
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  // Remove a user from a committee
  const removeFromCommittee = useMutation({
    mutationFn: async ({ userId, committee }: { userId: string; committee: string }) => {
      const { error } = await supabase
        .from('user_committees')
        .delete()
        .eq('user_id', userId)
        .eq('committee', committee);
        
      if (error) {
        console.error('Error removing user from committee:', error);
        throw error;
      }
      
      return { userId, committee };
    },
    onMutate: async (variables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['user-committees', userId] });
      
      // Snapshot the previous value
      const previousCommittees = queryClient.getQueryData<string[]>(['user-committees', userId]);
      
      // Optimistically update the cache by removing the committee
      if (previousCommittees) {
        queryClient.setQueryData(
          ['user-committees', userId],
          previousCommittees.filter(c => c !== variables.committee)
        );
      }
      
      return { previousCommittees };
    },
    onSuccess: () => {
      // We don't need to do anything here as the optimistic update is already applied
    },
    onError: (error, variables, context) => {
      // Rollback on error
      if (context?.previousCommittees) {
        queryClient.setQueryData(['user-committees', userId], context.previousCommittees);
      }
      toast.error(`Failed to remove user from committee: ${error.message}`);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is up to date
      queryClient.invalidateQueries({ queryKey: ['user-committees', userId] });
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });
  
  return {
    committees,
    isLoading,
    error,
    addToCommittee,
    removeFromCommittee
  };
};
