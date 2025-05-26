
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@/types';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter } from '@/components/ui/dialog';
import { TaskAssigneeSelect } from './TaskAssigneeSelect';
import { TaskStatusField } from './TaskStatusField';
import { TaskPriorityField } from './TaskPriorityField';
import TaskDatePickerField from './TaskDatePickerField';
import { TaskSchema, TaskFormValues, defaultTaskValues } from './TaskFormSchema';
import { useTaskForm } from '@/hooks/useTaskForm';

interface TaskFormProps {
  projectId?: string;
  committeeMembers?: User[];
  initialValues?: TaskFormValues;
  onSuccess?: () => void;
  onCancel: () => void;
  onSubmit?: (values: TaskFormValues) => void;
  submitLabel?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  projectId,
  committeeMembers = [],
  initialValues,
  onSuccess,
  onCancel,
  onSubmit,
  submitLabel = 'Create Task'
}) => {
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: initialValues || defaultTaskValues,
  });
  
  const { handleSubmit: hookHandleSubmit, isSubmitting } = useTaskForm(projectId, onSuccess);
  
  const handleFormSubmit = (values: TaskFormValues) => {
    if (onSubmit) {
      onSubmit(values);
      form.reset();
    } else if (projectId) {
      hookHandleSubmit(values);
      form.reset();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Task title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the task..."
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <TaskStatusField form={form} />
          <TaskPriorityField form={form} />
        </div>
        
        <TaskDatePickerField form={form} />
        
        <FormField
          control={form.control}
          name="assignee"
          render={({ field }) => (
            <TaskAssigneeSelect field={field} committeeMembers={committeeMembers} />
          )}
        />
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {submitLabel}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export type { TaskFormValues };
