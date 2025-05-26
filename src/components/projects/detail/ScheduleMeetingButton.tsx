
import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import CreateMeetingForm from '@/components/meetings/CreateMeetingForm';
import { Meeting } from '@/types';
import { useDialogState } from '@/hooks/use-dialog-state';
import { formatDate } from '@/utils/dateFormatters';

interface ScheduleMeetingButtonProps {
  project: Project;
  onAddMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const ScheduleMeetingButton: React.FC<ScheduleMeetingButtonProps> = ({ 
  project, 
  onAddMeeting 
}) => {
  const { isOpen, setIsOpen } = useDialogState();

  // Pre-populate meeting data based on the project
  const handleSubmit = (data: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    onAddMeeting(data);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Schedule Meeting
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Project Meeting</DialogTitle>
        </DialogHeader>
        <div className="mb-4 p-4 bg-muted/50 rounded-md">
          <p className="text-sm font-medium">For project: {project.title}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDate(project.startDate)} - {formatDate(project.endDate)}
          </p>
        </div>
        <CreateMeetingForm 
          onSubmit={handleSubmit}
          defaultValues={{
            title: `Meeting: ${project.title}`,
            description: `Project discussion for: ${project.title}`,
            committee: project.committee || '',
            agenda: `Discuss project status and next steps for ${project.title}`
          }} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleMeetingButton;
