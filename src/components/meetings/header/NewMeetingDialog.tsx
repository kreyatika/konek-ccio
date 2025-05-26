
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateMeetingForm from '../CreateMeetingForm';
import { Meeting } from '@/types';

interface NewMeetingDialogProps {
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
  onAddMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const NewMeetingDialog: React.FC<NewMeetingDialogProps> = ({ 
  showCreateDialog, 
  setShowCreateDialog, 
  onAddMeeting 
}) => {
  return (
    <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
      <DialogTrigger asChild>
        <Button size="sm" variant="blue">
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Meeting</DialogTitle>
        </DialogHeader>
        <CreateMeetingForm onSubmit={onAddMeeting} />
      </DialogContent>
    </Dialog>
  );
};

export default NewMeetingDialog;
