
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatMeetingDate, formatMeetingTime } from '@/utils/dateFormatters';
import { Meeting } from '@/types';
import DeleteMeetingButton from './DeleteMeetingButton';
import { useAuth } from '@/contexts/auth';

interface MeetingCardProps {
  meeting: Meeting;
  isPast?: boolean;
}

const MeetingCard: React.FC<MeetingCardProps> = ({ meeting, isPast = false }) => {
  const { userProfile } = useAuth();
  const isSuperAdmin = userProfile?.role === 'superadmin';
  
  const formattedDate = formatMeetingDate(meeting.date);
  const formattedTime = formatMeetingTime(meeting.date);
  const attendeesToShow = meeting.attendees.slice(0, 3);
  const additionalAttendees = meeting.attendees.length > 3 ? meeting.attendees.length - 3 : 0;

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase().substring(0, 2);
  };

  return (
    <Card className={`${isPast ? 'bg-muted/50' : ''}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{meeting.title}</h3>
            <p className="text-muted-foreground text-sm">{meeting.committee}</p>
          </div>
          {isSuperAdmin && (
            <DeleteMeetingButton
              meetingId={meeting.id}
              meetingTitle={meeting.title}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm mb-4">{meeting.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="sr-only">Date</span>
            {formattedDate}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="sr-only">Time</span>
            {formattedTime}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <span className="sr-only">Location</span>
            {meeting.location}
          </Badge>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-between items-center">
          <div className="flex -space-x-2">
            {attendeesToShow.map((attendee) => (
              <Avatar key={attendee.id} className="border-2 border-background h-8 w-8">
                <AvatarImage src={attendee.avatar} alt={attendee.name} />
                <AvatarFallback>{getInitials(attendee.name)}</AvatarFallback>
              </Avatar>
            ))}
            {additionalAttendees > 0 && (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs border-2 border-background">
                +{additionalAttendees}
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MeetingCard;
