
import { useState, useEffect, useRef, useCallback } from 'react';
import { Task, TaskStatus } from '@/types';
import { useKanbanTasksData } from './useKanbanTasksData';
import { useKanbanTasksMutations } from './useKanbanTasksMutations';
import { useKanbanTasksSubscription } from './useKanbanTasksSubscription';

export const useKanbanTasks = () => {
  const { tasks, loading, fetchTasks } = useKanbanTasksData();
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const isUpdatingRef = useRef(false);
  const operationInProgressRef = useRef(false);

  // Sync local tasks with fetched tasks when they change
  useEffect(() => {
    if (tasks.length > 0 && !isUpdatingRef.current) {
      setLocalTasks(tasks);
    }
  }, [tasks]);

  // Controlled fetch function that manages update state
  const handleFetchTasks = useCallback(async () => {
    if (operationInProgressRef.current) {
      console.log("Operation in progress, delaying fetch");
      setTimeout(handleFetchTasks, 500);
      return;
    }
    
    try {
      await fetchTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [fetchTasks]);

  // Set up subscriptions to realtime changes
  useKanbanTasksSubscription(handleFetchTasks);

  // Function to update local tasks state
  const updateLocalTasks = useCallback((updateFn: (prevTasks: Task[]) => Task[]) => {
    isUpdatingRef.current = true;
    setLocalTasks(prev => {
      const updated = updateFn(prev);
      // Reset the updating flag after a short delay
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 500);
      return updated;
    });
  }, []);

  // Wrap operations with operation progress tracking
  const wrapOperation = useCallback(async <T,>(operation: () => Promise<T>): Promise<T> => {
    if (operationInProgressRef.current) {
      // Instead of throwing an error or waiting, we return a rejected promise
      return Promise.reject(new Error("Another operation is in progress"));
    }
    
    operationInProgressRef.current = true;
    try {
      const result = await operation();
      return result;
    } finally {
      // Reset the operation flag after a delay
      setTimeout(() => {
        operationInProgressRef.current = false;
      }, 500); // Increased delay to ensure operations don't overlap
    }
  }, []);

  // Initialize task mutations
  const { 
    addTask: rawAddTask, 
    updateTaskStatus: rawUpdateTaskStatus, 
    updateTask: rawUpdateTask, 
    deleteTask: rawDeleteTask 
  } = useKanbanTasksMutations(handleFetchTasks, updateLocalTasks);

  // Wrap the raw operations with operation tracking
  const addTask = useCallback((status: TaskStatus) => 
    wrapOperation(() => rawAddTask(status)), [wrapOperation, rawAddTask]);
    
  const updateTaskStatus = useCallback((taskId: string, newStatus: TaskStatus) => 
    wrapOperation(() => rawUpdateTaskStatus(taskId, newStatus)), [wrapOperation, rawUpdateTaskStatus]);
    
  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => 
    wrapOperation(() => rawUpdateTask(taskId, updates)), [wrapOperation, rawUpdateTask]);
    
  const deleteTask = useCallback((taskId: string) => 
    wrapOperation(() => rawDeleteTask(taskId)), [wrapOperation, rawDeleteTask]);

  return {
    tasks: localTasks.length > 0 ? localTasks : tasks,
    loading,
    addTask,
    updateTaskStatus,
    updateTask,
    deleteTask
  };
};
