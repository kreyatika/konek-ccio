
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/contexts/auth';
import { deleteProject } from '@/utils/projectOperations';

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

const DeleteProjectButton: React.FC<DeleteProjectButtonProps> = ({
  projectId,
  projectTitle
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  
  // Allow any user to delete projects
  // No permission check needed
  
  const handleDeleteProject = async () => {
    setIsDeleting(true);
    console.log('Starting project deletion process for project:', projectId);
    
    try {
      // Only check if user is authenticated
      if (!userProfile) {
        throw new Error('User not authenticated');
      }
      
      console.log('User role:', userProfile?.role || 'unknown');
      
      // Use the enhanced deletion approach
      const success = await deleteProject(projectId);
      
      if (success) {
        toast.success('Project deleted successfully');
        
        // Aggressively clear all queries and cache
        console.log('Clearing all query cache...');
        await queryClient.invalidateQueries();
        await queryClient.resetQueries();
        queryClient.clear(); // Clear the entire cache
        
        // Remove from localStorage if any project data is cached there
        try {
          localStorage.removeItem(`project-${projectId}`);
          localStorage.removeItem('projects-cache');
          console.log('Cleared any localStorage cache');
        } catch (e) {
          console.warn('Error clearing localStorage:', e);
        }
        
        // Force a hard refresh of the page with cache busting
        console.log('Forcing complete page reload...');
        const cacheBuster = new Date().getTime();
        window.location.href = `/projects?refresh=${cacheBuster}`;
      } else {
        throw new Error('Project deletion failed');
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Error in deletion process:', error);
      toast.error(`Error deleting project: ${errorMessage}`);
      setIsConfirmOpen(false); // Close the dialog on error
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsConfirmOpen(true)}
        disabled={isDeleting}
        className="h-9 w-9"
        title="Delete project"
      >
        <Trash2 className="h-5 w-5 text-destructive" />
      </Button>
      
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{projectTitle}"? This action cannot be undone and will remove all related data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteProject}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Deleting...' : 'Delete Project'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DeleteProjectButton;
