
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task } from '@/types';
import { getTaskTableName } from '../utils/taskDbOperations';

/**
 * Hook for deleting a task
 */
export const useDeleteTask = (
  onTasksChange: () => void,
  updateLocalTasks: (updateFn: (prevTasks: Task[]) => Task[]) => void
) => {
  const deleteTask = async (taskId: string) => {
    try {
      // Determine which table the task belongs to
      const tableName = await getTaskTableName(taskId);
      
      // Delete the task
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', taskId);

      if (error) throw error;

      toast.success('Task deleted successfully');
      
      // Update local state
      updateLocalTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
      
      // Also refresh from server
      onTasksChange();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  return deleteTask;
};
