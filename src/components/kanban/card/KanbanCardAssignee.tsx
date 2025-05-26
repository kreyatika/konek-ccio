
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UserRound } from 'lucide-react';
import { User } from '@/types';

interface KanbanCardAssigneeProps {
  assignee?: User;
}

const KanbanCardAssignee: React.FC<KanbanCardAssigneeProps> = ({ assignee }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (!assignee) {
    return (
      <span className="text-[10px] text-muted-foreground flex items-center">
        <UserRound className="h-3 w-3 mr-0.5" />
        Unassigned
      </span>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Avatar className="h-4 w-4">
        <AvatarImage src={assignee.avatar} alt={assignee.name} />
        <AvatarFallback className="text-[8px]">{getInitials(assignee.name)}</AvatarFallback>
      </Avatar>
      <span className="text-[10px] truncate max-w-[80px]">{assignee.name}</span>
    </div>
  );
};

export default KanbanCardAssignee;
