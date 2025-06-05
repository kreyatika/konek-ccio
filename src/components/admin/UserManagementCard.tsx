
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, UserPlus } from 'lucide-react';
import UserRoleSelect from './UserRoleSelect';
import CommitteeSelect from './CommitteeSelect';
import { UserRole } from '@/types';
import { UserProfile } from '@/contexts/auth/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface UserManagementCardProps {
  users: any[];
  isLoading: boolean;
  currentUser: UserProfile;
  onRoleChange: (userId: string, role: UserRole) => void;
  onCommitteeAdd: (userId: string, committee: string) => void;
  onCommitteeRemove: (userId: string, committee: string) => void;
  onUserAdded?: () => void; // Callback when a user is added successfully
}

const UserManagementCard: React.FC<UserManagementCardProps> = ({
  users,
  isLoading,
  currentUser,
  onRoleChange,
  onCommitteeAdd,
  onCommitteeRemove,
  onUserAdded,
}) => {
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('member');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleAddUser = async () => {
    if (!newUserEmail) {
      toast.error('Email is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', newUserEmail)
        .single();
      
      if (existingUser) {
        toast.error('User with this email already exists');
        return;
      }
      
      // Create a new user
      const { data, error } = await supabase.auth.admin.inviteUserByEmail({
        email: newUserEmail,
        options: {
          data: {
            name: newUserName,
            role: newUserRole,
          },
        },
      });
      
      if (error) throw error;
      
      toast.success(`Invitation sent to ${newUserEmail}`);
      setIsAddUserDialogOpen(false);
      setNewUserEmail('');
      setNewUserName('');
      setNewUserRole('member');
      
      // Refresh the user list
      if (onUserAdded) onUserAdded();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(`Failed to add user: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <Button 
            onClick={() => setIsAddUserDialogOpen(true)} 
            size="sm" 
            className="flex items-center gap-1"
          >
            <UserPlus className="h-4 w-4" />
            Add User
          </Button>
        </div>
        <CardDescription>
          Manage all users, their roles, and committee assignments.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-2">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground">No users found.</p>
        ) : (
          <div className="space-y-4">
            {users.map((user) => {
              // We can't use hooks inside a map function, so we'll handle committees directly
              const handleAddCommittee = async (committee: string) => {
                // Call the parent handler to sync state
                onCommitteeAdd(user.id, committee);
              };
              
              const handleRemoveCommittee = async (committee: string) => {
                // Call the parent handler to sync state
                onCommitteeRemove(user.id, committee);
              };
              
              return (
                <div 
                  key={user.id} 
                  className="border rounded-md p-4 bg-card"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{user.name || user.email.split('@')[0]}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground mt-1">ID: {user.id}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <UserRoleSelect
                        value={user.role || 'member'}
                        onValueChange={(value) => onRoleChange(user.id, value)}
                        disabled={user.id === currentUser.id}
                        showDisabledNote={user.id === currentUser.id}
                      />
                      
                      <CommitteeSelect
                        selectedCommittees={user.committees || []}
                        onAdd={handleAddCommittee}
                        onRemove={handleRemoveCommittee}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
      
      {/* Add User Dialog */}
      <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Enter the details of the new user. An invitation email will be sent to them.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <UserRoleSelect
                value={newUserRole}
                onValueChange={(value) => setNewUserRole(value)}
                disabled={isSubmitting}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Adding...</span>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </>
              ) : (
                'Add User'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UserManagementCard;
