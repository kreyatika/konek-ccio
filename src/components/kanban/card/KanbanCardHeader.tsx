
import React from 'react';
import KanbanCardPriorityIndicator from './KanbanCardPriorityIndicator';
import KanbanCardMenu from './KanbanCardMenu';

interface KanbanCardHeaderProps {
  priority: string;
  committee?: string;
  onEdit: () => void;
  onDelete: () => void;
}

const KanbanCardHeader: React.FC<KanbanCardHeaderProps> = ({ 
  priority, 
  committee, 
  onEdit, 
  onDelete 
}) => {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center gap-1.5">
        <KanbanCardPriorityIndicator priority={priority} />
        
        {committee && (
          <span className="text-[10px] font-medium text-primary px-1.5 py-0.5 bg-primary/10 rounded-sm">
            {committee}
          </span>
        )}
      </div>
      
      <div>
        <KanbanCardMenu 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      </div>
    </div>
  );
};

export default KanbanCardHeader;
