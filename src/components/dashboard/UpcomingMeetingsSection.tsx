
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Meeting } from '@/types';
import { Link } from 'react-router-dom';
import { formatMeetingDate, formatMeetingTime } from '@/hooks/useUpcomingItems';
import { Loader2 } from 'lucide-react';

interface UpcomingMeetingsSectionProps {
  meetings?: Meeting[];
}

const UpcomingMeetingsSection: React.FC<UpcomingMeetingsSectionProps> = ({ meetings }) => {
  const isLoading = !meetings;

  // Filter for upcoming meetings and sort by date
  const upcomingMeetings = meetings || [];

  const getInitials = (name: string) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <DashboardCard
        title="Upcoming Meetings"
        className="md:col-span-3"
        titleAction={
          <Button variant="ghost" size="sm" asChild>
            <Link to="/meetings">All Meetings</Link>
          </Button>
        }
      >
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Upcoming Meetings"
      className="md:col-span-3"
      titleAction={
        <Button variant="ghost" size="sm" asChild>
          <Link to="/meetings">All Meetings</Link>
        </Button>
      }
    >
      <div className="space-y-4">
        {upcomingMeetings.length > 0 ? (
          upcomingMeetings.map((meeting) => (
            <div 
              key={meeting.id} 
              className="flex flex-col space-y-2 rounded-md border p-4"
            >
              <div className="flex justify-between">
                <div className="font-medium">{meeting.title}</div>
                <div className="text-sm text-muted-foreground">
                  {formatMeetingDate(meeting.date)}
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {meeting.committee} • {meeting.location}
              </div>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex -space-x-2">
                  {meeting.attendees && meeting.attendees.slice(0, 3).map((attendee) => (
                    <Avatar 
                      key={attendee.id} 
                      className="h-7 w-7 border-2 border-background"
                    >
                      <AvatarImage src={attendee.avatar} alt={attendee.name || 'Attendee'} />
                      <AvatarFallback>{getInitials(attendee.name || '')}</AvatarFallback>
                    </Avatar>
                  ))}
                  {meeting.attendees && meeting.attendees.length > 3 && (
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                      +{meeting.attendees.length - 3}
                    </div>
                  )}
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatMeetingTime(meeting.date)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center py-6">
            <p className="text-muted-foreground">No upcoming meetings</p>
          </div>
        )}
      </div>
    </DashboardCard>
  );
};

export default UpcomingMeetingsSection;
