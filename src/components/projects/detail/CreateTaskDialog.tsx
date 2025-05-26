
import React from 'react';
import { ListPlus } from 'lucide-react';
import { User } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TaskForm } from './task/TaskForm';
import { toast } from 'sonner';

interface CreateTaskDialogProps {
  projectId: string;
  committeeMembers: User[];
  onSuccess?: () => void;
  isCommitteeMember: boolean;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
  projectId,
  committeeMembers,
  onSuccess,
  isCommitteeMember,
}) => {
  const [open, setOpen] = React.useState(false);
  
  const handleSuccess = () => {
    setOpen(false);
    if (onSuccess) {
      onSuccess();
    }
  };
  
  const handleClick = () => {
    if (!isCommitteeMember) {
      toast.error('You must be a committee member to create tasks');
      return;
    }
    setOpen(true);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          disabled={!isCommitteeMember} 
          size="sm" 
          onClick={handleClick}
        >
          <ListPlus className="mr-2 h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Add a new task to this project. Fill out the details below.
          </DialogDescription>
        </DialogHeader>
        
        <TaskForm 
          projectId={projectId}
          committeeMembers={committeeMembers}
          onSuccess={handleSuccess}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTaskDialog;
