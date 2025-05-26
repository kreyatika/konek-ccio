
import React from 'react';
import { useProjectMeetings } from '@/hooks/useProjectMeetings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarClock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/dateFormatters';
import { format } from 'date-fns';
import { Meeting } from '@/types';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth';
import { useQueryClient } from '@tanstack/react-query';
import DeleteMeetingButton from '@/components/meetings/DeleteMeetingButton';

interface ProjectMeetingsProps {
  projectId: string;
  projectTitle: string;
}

const ProjectMeetings: React.FC<ProjectMeetingsProps> = ({ projectId, projectTitle }) => {
  const queryClient = useQueryClient();
  const { data: meetings = [], isLoading, error } = useProjectMeetings(projectId, projectTitle);
  const { userProfile } = useAuth();
  
  // Filter for only upcoming meetings
  const upcomingMeetings = meetings.filter(meeting => new Date(meeting.date) >= new Date());
  
  // If there are no upcoming meetings but we have meetings data, show past meetings as fallback
  const displayMeetings = upcomingMeetings.length > 0 
    ? upcomingMeetings 
    : meetings.filter(meeting => new Date(meeting.date) < new Date()).slice(0, 3);
  
  const handleDeleteSuccess = () => {
    // Explicitly invalidate project-meetings query for this specific project
    queryClient.invalidateQueries({ queryKey: ['project-meetings', projectId] });
  };
  
  const renderMeetingItem = (meeting: Meeting) => {
    const startTime = format(new Date(meeting.date), 'h:mm a');
    const endTime = format(new Date(meeting.endDate), 'h:mm a');
    const isSuperAdmin = userProfile?.role === 'superadmin';
    
    return (
      <div key={meeting.id} className="mb-4 last:mb-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium">{meeting.title}</div>
            <div className="text-sm text-muted-foreground">{formatDate(meeting.date)}</div>
            <div className="text-sm text-muted-foreground">{startTime} - {endTime}</div>
            <div className="text-sm mt-1">{meeting.location}</div>
          </div>
          
          {isSuperAdmin && (
            <DeleteMeetingButton
              meetingId={meeting.id}
              meetingTitle={meeting.title}
              onDeleteSuccess={handleDeleteSuccess}
            />
          )}
        </div>
        
        {meetings.length > 1 && <Separator className="mt-4" />}
      </div>
    );
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center">
          <CalendarClock className="h-5 w-5 mr-2 text-muted-foreground" />
          Scheduled Meetings ({upcomingMeetings.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-4 text-destructive">
            Error loading project meetings
          </div>
        ) : displayMeetings.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            No scheduled meetings for this project
          </div>
        ) : (
          <div>
            {displayMeetings.map(renderMeetingItem)}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectMeetings;
