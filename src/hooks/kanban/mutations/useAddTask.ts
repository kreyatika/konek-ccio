
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task, TaskStatus } from '@/types';

/**
 * Hook for adding a new task to a kanban column
 */
export const useAddTask = (
  onTasksChange: () => void,
) => {
  const addTask = async (columnId: string) => {
    try {
      const { data, error } = await supabase
        .from('kanban_tasks')
        .insert({
          title: 'New Task',
          status: columnId as TaskStatus,
          priority: 'medium',
        })
        .select()
        .single();

      if (error) throw error;
      
      // Success message
      toast.success('Task added successfully');
      
      // Refresh data from server with a delay to prevent UI freezing
      setTimeout(() => {
        onTasksChange();
      }, 300);
      
      return data;
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      return Promise.reject(error);
    }
  };

  return addTask;
};
