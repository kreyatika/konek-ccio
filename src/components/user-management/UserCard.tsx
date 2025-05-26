
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types';
import { UserProfile } from '@/contexts/auth/types';
import { useUserCommittees } from '@/hooks/useUserCommittees';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';

interface UserCardProps {
  user: UserProfile;
  currentUserId: string;
  committees: string[];
  onRoleChange: (userId: string, role: UserRole) => void;
  onCommitteeAdd: (userId: string, committee: string) => void;
  onCommitteeRemove: (userId: string, committee: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  currentUserId, 
  committees, 
  onRoleChange, 
  onCommitteeAdd,
  onCommitteeRemove
}) => {
  const { committees: userCommittees, isLoading: loadingCommittees } = useUserCommittees(user.id);
  
  // Filter out committees that the user is already part of
  const availableCommittees = committees.filter(committee => 
    !userCommittees.includes(committee)
  );

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border gap-4">
      <div className="flex items-center gap-4">
        <Avatar>
          {user.avatar ? (
            <AvatarImage src={user.avatar} alt={user.name || user.email} />
          ) : null}
          <AvatarFallback>
            {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.name || 'Unnamed User'}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground whitespace-nowrap">Role:</span>
          <Select
            value={user.role}
            onValueChange={(value: string) => 
              onRoleChange(user.id, value as UserRole)
            }
            disabled={user.id === currentUserId}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="superadmin">Superadmin</SelectItem>
              <SelectItem value="board">Board</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
          {user.id === currentUserId && (
            <span className="text-xs italic text-muted-foreground ml-2 hidden sm:inline">
              (You)
            </span>
          )}
        </div>
        
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Committees:</span>
            {loadingCommittees ? (
              <span className="text-xs text-muted-foreground">Loading...</span>
            ) : userCommittees.length === 0 ? (
              <span className="text-xs text-muted-foreground">No committees assigned</span>
            ) : null}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-2">
            {userCommittees.map((committee) => (
              <Badge key={committee} variant="outline" className="flex items-center gap-1 px-2 py-1">
                {committee}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-4 w-4 p-0 ml-1 rounded-full"
                  onClick={() => onCommitteeRemove(user.id, committee)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          
          <div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                  disabled={availableCommittees.length === 0}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Committee
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0" align="start">
                <ScrollArea className="h-[200px] max-h-[50vh]">
                  <div className="p-2">
                    {availableCommittees.length === 0 ? (
                      <p className="text-sm text-muted-foreground p-2">All committees assigned</p>
                    ) : (
                      availableCommittees.map((committee) => (
                        <div
                          key={committee}
                          className="flex items-center space-x-2 p-2 hover:bg-muted rounded-md cursor-pointer"
                          onClick={() => onCommitteeAdd(user.id, committee)}
                        >
                          <span>{committee}</span>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
