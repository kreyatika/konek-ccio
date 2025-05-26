
import { useState } from 'react';
import { Task, TaskStatus } from '@/types';
import { TaskFormValues } from '@/components/projects/detail/task/TaskForm';

/**
 * Custom hook for handling Kanban card actions (edit, delete, form submission)
 */
export const useKanbanCardActions = (
  task: Task, 
  onEdit?: (taskId: string, updates: Partial<Task>) => void,
  onDelete?: (taskId: string) => void
) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle edit card action
  const handleEdit = () => {
    if (!isSubmitting) {
      setIsEditDialogOpen(true);
    }
  };

  // Handle delete card action
  const handleDeleteClick = () => {
    if (!isSubmitting) {
      setIsDeleteDialogOpen(true);
    }
  };

  // Handle confirming card deletion
  const handleConfirmDelete = async () => {
    if (onDelete && !isSubmitting) {
      setIsSubmitting(true);
      
      // Close dialog before async operation to prevent UI freeze
      setIsDeleteDialogOpen(false);
      
      try {
        await onDelete(task.id);
        // Auto-refresh page after successful deletion
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } catch (error) {
        console.error("Error deleting task:", error);
        setIsSubmitting(false);
      }
    }
  };

  // Handle form submission for edit
  const handleFormSubmit = async (values: TaskFormValues) => {
    if (onEdit && !isSubmitting) {
      // Close dialog immediately before any async operation to prevent UI freeze
      setIsEditDialogOpen(false);
      
      setIsSubmitting(true);
      
      try {
        // Create a clean update object
        const updates: Partial<Task> = {
          title: values.title,
          description: values.description || '',
          status: values.status as TaskStatus,
          priority: values.priority,
          assigneeId: values.assignee !== 'unassigned' ? values.assignee : null,
          dueDate: values.dueDate 
        };
        
        console.log("Sending updates to parent:", updates);
        
        // Wait for the edit operation to complete
        await onEdit(task.id, updates);
        
        // Auto-refresh page after successful edit
        setTimeout(() => {
          window.location.reload();
        }, 300);
      } catch (error) {
        console.error("Error updating task:", error);
        setIsSubmitting(false);
      }
    }
  };

  return {
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isSubmitting,
    handleEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleFormSubmit
  };
};
