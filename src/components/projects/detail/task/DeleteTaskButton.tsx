
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useQueryClient } from '@tanstack/react-query';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { getTaskTableName } from '@/hooks/kanban/utils/taskDbOperations';

interface DeleteTaskButtonProps {
  taskId: string;
  taskTitle: string;
  projectId: string;
}

const DeleteTaskButton: React.FC<DeleteTaskButtonProps> = ({
  taskId,
  taskTitle,
  projectId
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  
  // Only display for SuperAdmin users
  if (userProfile?.role !== 'superadmin') {
    return null;
  }
  
  const handleDeleteTask = async () => {
    setIsDeleting(true);
    
    try {
      console.log('Determining task table for ID:', taskId);
      
      // Determine which table the task belongs to
      const tableName = await getTaskTableName(taskId);
      console.log('Task belongs to table:', tableName);
      
      // Delete the task from the appropriate table
      // Removed .select('count') as it causes "aggregate functions are not allowed in RETURNING" error
      const { error, data } = await supabase
        .from(tableName)
        .delete()
        .eq('id', taskId);
        
      if (error) {
        console.error(`Error deleting task from ${tableName}:`, error);
        throw new Error(`Failed to delete task: ${error.message}`);
      }
      
      // If we reach here without an error, the deletion was successful
      console.log(`Task deleted successfully from ${tableName}, invalidating queries`);
      toast.success('Task deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['project-details', projectId] });
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error(error.message || 'Error deleting task');
    } finally {
      setIsDeleting(false);
      setIsConfirmOpen(false);
    }
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDeleting}
        className="h-8 w-8"
        title="Delete task"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
      
      <AlertDialog 
        open={isConfirmOpen} 
        onOpenChange={(open) => !open && setIsConfirmOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{taskTitle}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteTask} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteTaskButton;
