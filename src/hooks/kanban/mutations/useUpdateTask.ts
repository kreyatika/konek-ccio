
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task } from '@/types';
import { getTaskTableName, createDbUpdatesObject } from '../utils/taskDbOperations';

/**
 * Hook for updating task details
 */
export const useUpdateTask = (
  onTasksChange: () => void,
  updateLocalTasks: (updateFn: (prevTasks: Task[]) => Task[]) => void
) => {
  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      console.log('Updating task:', taskId, 'with updates:', updates);
      
      // First update local state for immediate feedback
      updateLocalTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
      
      // Create database compatible updates object
      const dbUpdates = createDbUpdatesObject(updates);
      console.log('Converted database updates:', dbUpdates);

      // Determine which table the task belongs to
      const tableName = await getTaskTableName(taskId);
      
      // Update the task
      const { error } = await supabase
        .from(tableName)
        .update(dbUpdates)
        .eq('id', taskId);

      if (error) {
        console.error(`Supabase error updating ${tableName}:`, error);
        toast.error('Failed to update task');
        
        // Refresh data from server on error to restore correct state
        setTimeout(() => {
          onTasksChange();
        }, 300);
        
        return Promise.reject(error);
      }
      
      toast.success('Task updated successfully');
      
      // Refresh data from server with a slight delay
      setTimeout(() => {
        onTasksChange();
      }, 300);
      
      return Promise.resolve(true);
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      
      // Refresh data to revert any incorrect local state
      setTimeout(() => {
        onTasksChange();
      }, 300);
      
      return Promise.reject(error);
    }
  };

  return updateTask;
};
