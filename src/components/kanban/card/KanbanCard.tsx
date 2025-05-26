
import React from 'react';
import { Task } from '@/types';
import DeleteTaskDialog from '../DeleteTaskDialog';
import EditTaskDialog from '../EditTaskDialog';
import { useKanbanCardActions } from '@/hooks/kanban/card/useKanbanCardActions';
import { useKanbanCardDrag } from '@/hooks/kanban/card/useKanbanCardDrag';
import { useNormalizeTaskDate } from '@/hooks/kanban/card/useNormalizeTaskDate';

// Card components
import KanbanCardHeader from './KanbanCardHeader';
import KanbanCardDescription from './KanbanCardDescription';
import KanbanCardStatusRow from './KanbanCardStatusRow';
import KanbanCardFooter from './KanbanCardFooter';

interface KanbanCardProps {
  task: Task;
  onEdit?: (taskId: string, updates: Partial<Task>) => void;
  onDelete?: (taskId: string) => void;
}

const KanbanCard: React.FC<KanbanCardProps> = ({ 
  task, 
  onEdit, 
  onDelete 
}) => {
  // Use our custom hooks to handle card operations
  const {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isSubmitting,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleFormSubmit
  } = useKanbanCardActions(task, onEdit, onDelete);

  // Use drag handling hook
  const { isDragging, handleDragStart, handleDragEnd } = useKanbanCardDrag(task.id, isSubmitting);

  // Get normalized date for display
  const displayDueDate = useNormalizeTaskDate(task);

  // Convert attachments to compatible format for KanbanCardFooter
  const formattedAttachments = task.attachments ? task.attachments.map(attachment => ({
    id: attachment.name
  })) : undefined;

  return (
    <>
      <div 
        className={`kanban-card bg-card p-2 rounded-md shadow-sm border border-border/40 cursor-grab
          transition-all duration-300 ease-in-out 
          ${isDragging ? 'opacity-50 scale-95 rotate-1 shadow-lg border-primary/40' : 'hover:shadow-md hover:-translate-y-1 hover:border-primary/20'}
        `}
        draggable={!isSubmitting}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={(e) => {
          // Prevent click events during drag operations
          if (isDragging || isSubmitting) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        {/* Header with priority indicator and actions */}
        <KanbanCardHeader
          priority={task.priority}
          committee={task.committee}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
        
        {/* Task title */}
        <h4 className="font-medium text-sm line-clamp-2 mb-1">{task.title}</h4>
        
        {/* Task description - collapsible with toggle */}
        <KanbanCardDescription description={task.description} />
        
        {/* Assignee and status in compact row */}
        <KanbanCardStatusRow 
          assignee={task.assignee}
          status={task.status}
        />
        
        {/* Footer with date and indicators */}
        <KanbanCardFooter 
          dueDate={displayDueDate}
          comments={task.comments}
          attachments={formattedAttachments}
        />
      </div>

      {/* Edit Task Dialog */}
      {isEditDialogOpen && (
        <EditTaskDialog 
          isOpen={isEditDialogOpen}
          task={{...task, dueDate: displayDueDate}}
          onClose={() => setIsEditDialogOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteTaskDialog 
        isOpen={isDeleteDialogOpen}
        taskTitle={task.title}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default KanbanCard;
