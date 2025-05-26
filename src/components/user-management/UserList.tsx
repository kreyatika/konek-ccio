
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { UserRole } from '@/types';
import UserCard from './UserCard';
import { UserProfile } from '@/contexts/auth/types';

interface UserListProps {
  users: UserProfile[];
  currentUserId: string;
  committees: string[];
  onRoleChange: (userId: string, role: UserRole) => void;
  onCommitteeAdd: (userId: string, committee: string) => void;
  onCommitteeRemove: (userId: string, committee: string) => void;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  currentUserId, 
  committees,
  onRoleChange, 
  onCommitteeAdd,
  onCommitteeRemove
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage User Roles & Committees</CardTitle>
        <CardDescription>
          As a superadmin, you can change the roles and committee assignments of any user in the system.
          <div className="mt-2 text-sm text-muted-foreground">
            Total users: {users.length}
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              currentUserId={currentUserId}
              committees={committees}
              onRoleChange={onRoleChange}
              onCommitteeAdd={onCommitteeAdd}
              onCommitteeRemove={onCommitteeRemove}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserList;
