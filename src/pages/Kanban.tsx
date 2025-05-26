import React, { useState, useCallback } from 'react';
import PageTransition from '@/components/ui/page-transition';
import KanbanColumn from '@/components/kanban/KanbanColumn';
import { KanbanColumn as KanbanColumnType, Task, TaskStatus } from '@/types';
import { useKanbanTasks } from '@/hooks/useKanbanTasks';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

const Kanban = () => {
  const { tasks, loading, addTask, updateTaskStatus, updateTask, deleteTask } = useKanbanTasks();
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingDrop, setIsProcessingDrop] = useState(false);
  const [isProcessingAction, setIsProcessingAction] = useState(false);
  
  // Organize tasks into columns
  const columns: KanbanColumnType[] = [
    {
      id: 'todo',
      title: 'To Do',
      tasks: tasks.filter(task => task.status === 'todo'),
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      tasks: tasks.filter(task => task.status === 'in-progress'),
    },
    {
      id: 'review',
      title: 'Review',
      tasks: tasks.filter(task => task.status === 'review'),
    },
    {
      id: 'done',
      title: 'Done',
      tasks: tasks.filter(task => task.status === 'done'),
    },
  ];

  // Handler for task status updates with debounce
  const handleUpdateTaskStatus = useCallback(async (taskId: string, newStatus: string) => {
    if (isProcessingDrop) return;
    
    setIsProcessingDrop(true);
    try {
      console.log(`Handling task status update: ${taskId} -> ${newStatus}`);
      await updateTaskStatus(taskId, newStatus as TaskStatus);
      toast.success('Task moved successfully');
      
      // Refresh the page after status update
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
      setIsProcessingDrop(false);
    }
  }, [isProcessingDrop, updateTaskStatus]);

  // Handler for editing tasks with improved error handling
  const handleEditTask = useCallback(async (taskId: string, updates: Partial<Task>) => {
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    try {
      await updateTask(taskId, updates);
      // Toast is handled in the hook
    } catch (error) {
      console.error('Error editing task:', error);
      toast.error('Failed to update task');
      setIsProcessingAction(false);
    }
  }, [isProcessingAction, updateTask]);

  // Handler for deleting tasks with improved error handling
  const handleDeleteTask = useCallback(async (taskId: string) => {
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      setIsProcessingAction(false);
    }
  }, [isProcessingAction, deleteTask]);

  // Handler for adding tasks with improved error handling
  const handleAddTask = useCallback(async (status: TaskStatus) => {
    if (isProcessingAction) return;
    
    setIsProcessingAction(true);
    try {
      await addTask(status);
      toast.success('Task added successfully');
      
      // Refresh the page after adding a task
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
      setIsProcessingAction(false);
    }
  }, [isProcessingAction, addTask]);

  if (loading) {
    return (
      <PageTransition>
        <div className="container px-4 py-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-[calc(100vh-18rem)] w-full" />
              </div>
            ))}
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div 
        className="container px-4 py-6 mx-auto"
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          if (!isDragging) setIsDragging(true);
        }}
        onDragEnd={() => {
          setIsDragging(false);
        }}
        onDrop={() => {
          setIsDragging(false);
        }}
      >
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Kanban Board</h1>
            <p className="text-muted-foreground">
              Visualize and manage your tasks with this Kanban board.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                onAddTask={() => handleAddTask(column.id as TaskStatus)}
                onUpdateTaskStatus={handleUpdateTaskStatus}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Kanban;
