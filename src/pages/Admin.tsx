
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { UserRole } from '@/types';
import { Card } from '@/components/ui/card';
import AdminWelcomeCard from '@/components/admin/AdminWelcomeCard';
import UserManagementCard from '@/components/admin/UserManagementCard';

const Admin = () => {
  const { userProfile, updateUserRole } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Function to fetch all users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const setSuperAdminRole = async () => {
    if (!userProfile) return;
    
    try {
      setIsUpdating(true);
      await updateUserRole(userProfile.id, 'superadmin');
      toast.success('Role updated to superadmin. Please refresh the page.');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRoleChange = async (userId: string, role: UserRole) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (error) throw error;
      
      setUsers(users.map(user => user.id === userId ? { ...user, role } : user));
      toast.success(`User role updated to ${role}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };

  const handleCommitteeAdd = async (userId: string, committee: string) => {
    try {
      const { error } = await supabase
        .from('user_committees')
        .insert([{ user_id: userId, committee }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.info(`User is already assigned to ${committee}`);
          return;
        }
        throw error;
      }
      
      toast.success(`User added to ${committee}`);
      // Force a refresh after adding committee to ensure UI is in sync
      await fetchUsers();
    } catch (error) {
      console.error('Error adding user to committee:', error);
      toast.error('Failed to add user to committee');
    }
  };

  const handleCommitteeRemove = async (userId: string, committee: string) => {
    try {
      const { error } = await supabase
        .from('user_committees')
        .delete()
        .eq('user_id', userId)
        .eq('committee', committee);

      if (error) throw error;
      
      toast.success(`User removed from ${committee}`);
      // Force a refresh after removing committee to ensure UI is in sync
      await fetchUsers();
    } catch (error) {
      console.error('Error removing user from committee:', error);
      toast.error('Failed to remove user from committee');
    }
  };

  if (!userProfile) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <AdminWelcomeCard
        userProfile={userProfile}
        isUpdating={isUpdating}
        onSetSuperAdmin={setSuperAdminRole}
      />
      
      <UserManagementCard
        users={users}
        isLoading={isLoading}
        currentUser={userProfile}
        onRoleChange={handleRoleChange}
        onCommitteeAdd={handleCommitteeAdd}
        onCommitteeRemove={handleCommitteeRemove}
      />
      
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">System Settings</h2>
        <p className="text-muted-foreground mb-4">Configure application settings.</p>
        <div className="text-sm bg-muted p-3 rounded">
          This is a placeholder for admin functionality.
        </div>
      </Card>
    </div>
  );
};

export default Admin;
