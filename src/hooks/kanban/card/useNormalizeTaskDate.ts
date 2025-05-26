
import { Task } from '@/types';

/**
 * Hook to normalize task due date for UI display
 */
export const useNormalizeTaskDate = (task: Task) => {
  // Normalize dueDate for the UI display
  let displayDueDate = null;
  
  try {
    if (task.dueDate instanceof Date) {
      displayDueDate = task.dueDate;
    } else if (task.dueDate && typeof task.dueDate === 'object' && '_type' in task.dueDate) {
      displayDueDate = task.dueDate;
    } else if (task.dueDate && typeof task.dueDate === 'string') {
      displayDueDate = new Date(task.dueDate);
    }
  } catch (error) {
    console.error("Error processing date for display:", error);
  }

  return displayDueDate;
};
