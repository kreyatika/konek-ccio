
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Task, TaskStatus } from '@/types';

/**
 * Checks if a task exists in the kanban_tasks table
 */
export const checkIfKanbanTask = async (taskId: string) => {
  const { data, error } = await supabase
    .from('kanban_tasks')
    .select('id')
    .eq('id', taskId)
    .maybeSingle();
    
  if (error) {
    console.error('Error checking task type:', error);
    throw error;
  }
  
  return !!data;
};

/**
 * Determines the table name for a task based on its ID
 */
export const getTaskTableName = async (taskId: string): Promise<'kanban_tasks' | 'project_tasks'> => {
  const isKanbanTask = await checkIfKanbanTask(taskId);
  return isKanbanTask ? 'kanban_tasks' : 'project_tasks';
};

/**
 * Converts a Task object to a database-compatible format
 */
export const createDbUpdatesObject = (updates: Partial<Task>) => {
  const dbUpdates: any = {};
  
  // Add basic fields if present in updates
  if (updates.title !== undefined) dbUpdates.title = updates.title;
  if (updates.description !== undefined) dbUpdates.description = updates.description;
  if (updates.status !== undefined) dbUpdates.status = updates.status;
  if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
  if (updates.assigneeId !== undefined) dbUpdates.assignee_id = updates.assigneeId;
  
  // Handle due date conversion for database
  if ('dueDate' in updates) {
    const dueDate = updates.dueDate;
    
    if (dueDate === null) {
      // Handle null due date (clearing the date)
      dbUpdates.due_date = null;
      console.log("Clearing date in database (null)");
    } 
    else if (dueDate instanceof Date) {
      // Handle standard Date object
      dbUpdates.due_date = dueDate.toISOString();
      console.log("Saving ISO date to database:", dbUpdates.due_date);
    } 
    else if (typeof dueDate === 'object' && '_type' in dueDate) {
      // Handle special date object format from the form
      try {
        const isoDate = (dueDate as any).value.iso;
        dbUpdates.due_date = isoDate;
        console.log("Saving complex date to database:", dbUpdates.due_date);
      } catch (error) {
        console.error("Error extracting ISO date from complex object:", error);
        // Don't update the due date if we can't extract a valid date
      }
    }
    else if (typeof dueDate === 'string') {
      // Handle string date
      dbUpdates.due_date = dueDate;
      console.log("Saving string date to database:", dbUpdates.due_date);
    }
  }

  return dbUpdates;
};
