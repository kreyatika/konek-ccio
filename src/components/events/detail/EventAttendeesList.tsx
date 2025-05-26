
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/types';

interface EventAttendeesListProps {
  attendees: User[];
}

const EventAttendeesList: React.FC<EventAttendeesListProps> = ({ attendees }) => {
  return (
    <div className="bg-card border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">
        Attendees ({attendees.length})
      </h3>
      {attendees.length > 0 ? (
        <div className="space-y-3">
          {attendees.map((attendee) => (
            <div key={attendee.id} className="flex items-center">
              <Avatar className="h-8 w-8 mr-3">
                <AvatarImage src={attendee.avatar} alt={attendee.name} />
                <AvatarFallback>
                  {attendee.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{attendee.name || 'Anonymous User'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No attendees yet. Be the first to RSVP!</p>
      )}
    </div>
  );
};

export default EventAttendeesList;
