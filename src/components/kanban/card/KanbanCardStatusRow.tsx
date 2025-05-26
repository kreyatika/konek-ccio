
import React from 'react';
import StatusBadge from '@/components/ui/status-badge';
import KanbanCardAssignee from './KanbanCardAssignee';
import { User, TaskStatus } from '@/types';

interface KanbanCardStatusRowProps {
  assignee?: User;
  status: TaskStatus;
}

const KanbanCardStatusRow: React.FC<KanbanCardStatusRowProps> = ({ assignee, status }) => {
  return (
    <div className="flex items-center justify-between gap-1 mb-1">
      {/* Assignee */}
      <KanbanCardAssignee assignee={assignee} />
      
      {/* Status badge */}
      <StatusBadge status={status} className="text-[9px] px-1.5 py-0.5" />
    </div>
  );
};

export default KanbanCardStatusRow;
