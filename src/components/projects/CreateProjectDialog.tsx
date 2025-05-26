
import React from 'react';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateProjectForm from '@/components/projects/CreateProjectForm';

interface CreateProjectDialogProps {
  onSuccess: () => void;
}

const CreateProjectDialog: React.FC<CreateProjectDialogProps> = ({ onSuccess }) => {
  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>Create New Project</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new chamber project.
        </DialogDescription>
      </DialogHeader>
      
      <CreateProjectForm onSuccess={onSuccess} />
    </DialogContent>
  );
};

export default CreateProjectDialog;
