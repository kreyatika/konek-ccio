
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { useQueryClient } from '@tanstack/react-query';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';

interface DeleteMeetingButtonProps {
  meetingId: string;
  meetingTitle: string;
  onDeleteSuccess?: () => void; // Optional callback for deletion success
}

const DeleteMeetingButton: React.FC<DeleteMeetingButtonProps> = ({
  meetingId,
  meetingTitle,
  onDeleteSuccess
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { userProfile } = useAuth();
  const queryClient = useQueryClient();
  
  // Only display for SuperAdmin users
  if (userProfile?.role !== 'superadmin') {
    return null;
  }
  
  const handleDeleteMeeting = async () => {
    setIsDeleting(true);
    
    try {
      // First delete the attendees
      const { error: attendeesError } = await supabase
        .from('meeting_attendees')
        .delete()
        .eq('meeting_id', meetingId);
        
      if (attendeesError) {
        console.error('Error deleting meeting attendees:', attendeesError);
        throw new Error(`Failed to delete meeting attendees: ${attendeesError.message}`);
      }
      
      // Then delete the meeting
      const { error } = await supabase
        .from('meetings')
        .delete()
        .eq('id', meetingId);
        
      if (error) {
        console.error('Error deleting meeting:', error);
        throw new Error(`Failed to delete meeting: ${error.message}`);
      }
      
      toast.success('Meeting deleted successfully');
      
      // Call the onDeleteSuccess callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess();
      }
      
      // Invalidate all queries related to meetings
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      queryClient.invalidateQueries({ queryKey: ['project-meetings'] });
    } catch (error: any) {
      console.error('Error deleting meeting:', error);
      toast.error(error.message || 'Error deleting meeting');
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
        title="Delete meeting"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
      
      <AlertDialog 
        open={isConfirmOpen} 
        onOpenChange={(open) => !open && setIsConfirmOpen(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meeting</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{meetingTitle}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteMeeting} 
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

export default DeleteMeetingButton;
