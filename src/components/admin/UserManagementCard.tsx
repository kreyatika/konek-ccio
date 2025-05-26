
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import UserRoleSelect from './UserRoleSelect';
import CommitteeSelect from './CommitteeSelect';
import { UserRole } from '@/types';
import { UserProfile } from '@/contexts/auth/types';
import { useUserCommittees } from '@/hooks/useUserCommittees';

interface UserManagementCardProps {
  users: any[];
  isLoading: boolean;
  currentUser: UserProfile;
  onRoleChange: (userId: string, role: UserRole) => void;
  onCommitteeAdd: (userId: string, committee: string) => void;
  onCommitteeRemove: (userId: string, committee: string) => void;
}

const UserManagementCard: React.FC<UserManagementCardProps> = ({
  users,
  isLoading,
  currentUser,
  onRoleChange,
  onCommitteeAdd,
  onCommitteeRemove,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          User Management
        </CardTitle>
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
              // Use the useUserCommittees hook to get committees for this user
              const { 
                committees, 
                isLoading: loadingCommittees,
                addToCommittee, 
                removeFromCommittee 
              } = useUserCommittees(user.id);
              
              const handleAddCommittee = async (committee: string) => {
                await addToCommittee.mutateAsync({ userId: user.id, committee });
                // Also call the parent handler to sync state
                onCommitteeAdd(user.id, committee);
              };
              
              const handleRemoveCommittee = async (committee: string) => {
                await removeFromCommittee.mutateAsync({ userId: user.id, committee });
                // Also call the parent handler to sync state
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
                        selectedCommittees={committees || []}
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
    </Card>
  );
};

export default UserManagementCard;
