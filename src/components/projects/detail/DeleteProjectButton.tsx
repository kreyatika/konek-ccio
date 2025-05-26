
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import DeleteConfirmationDialog from '@/components/admin/DeleteConfirmationDialog';
import { useAuth } from '@/contexts/auth';

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
  
  // Only display for SuperAdmin users
  if (userProfile?.role !== 'superadmin') {
    return null;
  }
  
  const handleDeleteProject = async () => {
    setIsDeleting(true);
    
    try {
      // Delete the project
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
        
      if (error) throw error;
      
      toast.success('Project deleted successfully');
      navigate('/projects');
    } catch (error: any) {
      console.error('Error deleting project:', error);
      toast.error(`Error deleting project: ${error.message}`);
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
      
      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleDeleteProject}
        title="Delete Project"
        description={`Are you sure you want to delete "${projectTitle}"? This action cannot be undone and will remove all related data.`}
        itemName="project"
      />
    </>
  );
};

export default DeleteProjectButton;
