
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task, TaskStatus } from '@/types';
import { getTaskTableName } from '../utils/taskDbOperations';

/**
 * Hook for updating a task's status (used in drag and drop operations)
 */
export const useUpdateTaskStatus = (
  onTasksChange: () => void,
  updateLocalTasks: (updateFn: (prevTasks: Task[]) => Task[]) => void
) => {
  const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
    try {
      console.log(`Updating task ${taskId} to status ${newStatus}`);
      
      // Save original tasks state for rollback if needed
      let originalTasks: Task[] = [];
      
      // Immediately update the UI for better responsiveness
      updateLocalTasks(prevTasks => {
        originalTasks = [...prevTasks];
        return prevTasks.map(task => 
          task.id === taskId ? { ...task, status: newStatus } : task
        );
      });
      
      // Determine which table the task belongs to
      const tableName = await getTaskTableName(taskId);
      
      // Update the task in the database
      const { error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) {
        console.error(`Error updating task status in ${tableName}:`, error);
        // Revert the local state change if there was an error
        updateLocalTasks(() => originalTasks);
        toast.error('Failed to move task');
        return;
      }
      
      toast.success('Task moved successfully');
      
      // Also refresh data from server to ensure consistency, but with a slight delay
      setTimeout(() => {
        onTasksChange();
      }, 300);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to move task');
      // Refresh to ensure UI is in sync with server
      onTasksChange();
    }
  };

  return updateTaskStatus;
};
