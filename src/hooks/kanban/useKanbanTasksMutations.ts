
import { Task, TaskStatus } from '@/types';
import { useAddTask } from './mutations/useAddTask';
import { useUpdateTaskStatus } from './mutations/useUpdateTaskStatus';
import { useUpdateTask } from './mutations/useUpdateTask';
import { useDeleteTask } from './mutations/useDeleteTask';

/**
 * Combined hook for all kanban task mutations
 */
export const useKanbanTasksMutations = (
  onTasksChange: () => void,
  updateLocalTasks: (updateFn: (prevTasks: Task[]) => Task[]) => void
) => {
  // Initialize individual mutation hooks
  const addTask = useAddTask(onTasksChange);
  const updateTaskStatus = useUpdateTaskStatus(onTasksChange, updateLocalTasks);
  const updateTask = useUpdateTask(onTasksChange, updateLocalTasks);
  const deleteTask = useDeleteTask(onTasksChange, updateLocalTasks);

  return {
    addTask,
    updateTaskStatus,
    updateTask,
    deleteTask
  };
};
