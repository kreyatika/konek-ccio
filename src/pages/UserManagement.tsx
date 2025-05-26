import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types';
import { updateUserRole, addUserToCommittee, removeUserFromCommittee } from '@/contexts/auth/profileUtils';
import { COMMITTEES } from '@/lib/data';

// Import refactored components
import UserAccessDenied from '@/components/user-management/UserAccessDenied';
import UserLoadingState from '@/components/user-management/UserLoadingState';
import UserErrorState from '@/components/user-management/UserErrorState';
import EmptyUserList from '@/components/user-management/EmptyUserList';
import UserList from '@/components/user-management/UserList';
import UserHeader from '@/components/user-management/UserHeader';

const UserManagement = () => {
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  
  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      console.log('Fetching all users from profiles table');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Fetched users:', data);
      return data;
    },
  });

  const updateRoleMutation = useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: UserRole }) => {
      const success = await updateUserRole(userId, role);
      if (!success) {
        throw new Error('Failed to update user role');
      }
      return { userId, role };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      toast.error(`Failed to update role: ${error.message}`);
    },
  });

  const addToCommitteeMutation = useMutation({
    mutationFn: async ({ userId, committee }: { userId: string; committee: string }) => {
      const success = await addUserToCommittee(userId, committee);
      if (!success) {
        throw new Error(`Failed to add user to committee: ${committee}`);
      }
      return { userId, committee };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      queryClient.invalidateQueries({ queryKey: ['user-committees'] });
    },
    onError: (error) => {
      toast.error(`Failed to add to committee: ${error.message}`);
    },
  });

  const removeFromCommitteeMutation = useMutation({
    mutationFn: async ({ userId, committee }: { userId: string; committee: string }) => {
      const success = await removeUserFromCommittee(userId, committee);
      if (!success) {
        throw new Error(`Failed to remove user from committee: ${committee}`);
      }
      return { userId, committee };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.invalidateQueries({ queryKey: ['committee-members'] });
      queryClient.invalidateQueries({ queryKey: ['user-committees'] });
    },
    onError: (error) => {
      toast.error(`Failed to remove from committee: ${error.message}`);
    },
  });

  const handleRoleChange = (userId: string, role: UserRole) => {
    updateRoleMutation.mutate({ userId, role });
  };

  const handleCommitteeAdd = (userId: string, committee: string) => {
    addToCommitteeMutation.mutate({ userId, committee });
  };

  const handleCommitteeRemove = (userId: string, committee: string) => {
    removeFromCommitteeMutation.mutate({ userId, committee });
  };

  const handleRefresh = () => {
    refetch();
    toast.success('Refreshing user list...');
  };

  if (userProfile?.role !== 'superadmin') {
    return <UserAccessDenied />;
  }

  if (isLoading) {
    return <UserLoadingState />;
  }

  if (error) {
    return <UserErrorState error={error as Error} onRefresh={handleRefresh} />;
  }

  if (!users || users.length === 0) {
    return <EmptyUserList onRefresh={handleRefresh} />;
  }

  return (
    <div className="container mx-auto py-10">
      <UserHeader onRefresh={handleRefresh} />
      <UserList
        users={users}
        currentUserId={userProfile.id}
        committees={COMMITTEES}
        onRoleChange={handleRoleChange}
        onCommitteeAdd={handleCommitteeAdd}
        onCommitteeRemove={handleCommitteeRemove}
      />
    </div>
  );
};

export default UserManagement;
