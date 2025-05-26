
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { TaskFormValues } from '@/components/projects/detail/task/TaskFormSchema';

export const useTaskForm = (projectId: string, onSuccess?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (values: TaskFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Creating task with values:', values);
      
      const { data, error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          title: values.title,
          description: values.description,
          status: values.status,
          priority: values.priority,
          assignee_id: values.assignee === 'unassigned' ? null : values.assignee,
          due_date: values.dueDate ? values.dueDate.toISOString() : null,
        })
        .select();
        
      if (error) {
        console.error('Error creating task:', error);
        toast.error(`Failed to create task: ${error.message}`);
        return;
      }
      
      console.log('Task created successfully:', data);
      toast.success('Task created successfully');
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['project-details', projectId] });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error creating task:', error);
      toast.error(`An unexpected error occurred: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
