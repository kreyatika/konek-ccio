
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Event } from '@/types';
import CreateEventForm from './CreateEventForm';
import { useDialogState } from '@/hooks/use-dialog-state';

interface NewEventDialogProps {
  onCreateEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>, eventImage?: File) => void;
}

const NewEventDialog: React.FC<NewEventDialogProps> = ({ onCreateEvent }) => {
  const { isOpen, setIsOpen } = useDialogState();

  const handleSubmit = (
    data: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>, 
    eventImage?: File
  ) => {
    onCreateEvent(data, eventImage);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="blue">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Event
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Fill out the form below to create a new event. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <CreateEventForm onSubmit={handleSubmit} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  );
};

export default NewEventDialog;
