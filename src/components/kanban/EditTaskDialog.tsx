
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { TaskForm, TaskFormValues } from '../projects/detail/task/TaskForm';
import { Task } from '@/types';

interface EditTaskDialogProps {
  isOpen: boolean;
  task: Task;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => void;
}

const EditTaskDialog: React.FC<EditTaskDialogProps> = ({
  isOpen,
  task,
  onClose,
  onSubmit
}) => {
  const handleFormSubmit = (values: TaskFormValues) => {
    // Pass the values directly to parent component
    // The parent component will handle date normalization
    console.log("Task form submitted with values:", values);
    onSubmit(values);
  };

  // Ensure the dueDate is properly formatted for the form
  let initialDueDate = null;
  
  if (task.dueDate) {
    try {
      if (task.dueDate instanceof Date) {
        initialDueDate = task.dueDate;
      } else if (typeof task.dueDate === 'object' && '_type' in task.dueDate) {
        // Handle complex date object
        const dateObj = task.dueDate as any;
        initialDueDate = dateObj;
      } else if (typeof task.dueDate === 'string') {
        // Handle string date
        initialDueDate = new Date(task.dueDate);
      }
      console.log("Initialized due date for form:", initialDueDate);
    } catch (error) {
      console.error("Error creating date object:", error);
      initialDueDate = null;
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Make changes to your task here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        
        <TaskForm
          initialValues={{
            title: task.title,
            description: task.description || '',
            status: task.status,
            priority: task.priority,
            assignee: task.assigneeId || 'unassigned',
            dueDate: initialDueDate
          }}
          onSubmit={handleFormSubmit}
          onCancel={onClose}
          submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
