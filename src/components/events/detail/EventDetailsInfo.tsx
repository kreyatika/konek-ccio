
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Event } from '@/types';
import EventMetadata from '@/components/events/EventMetadata';

interface EventDetailsInfoProps {
  event: Event;
}

const EventDetailsInfo: React.FC<EventDetailsInfoProps> = ({ event }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-3">About This Event</h2>
        <p className="text-muted-foreground">{event.description}</p>
      </div>
      
      <Separator />
      
      <EventMetadata
        startDate={event.startDate}
        endDate={event.endDate}
        location={event.location}
        committee={event.committee}
        rsvpDeadline={event.rsvpDeadline}
        iconSize={5}
        showLabels={true}
        variant="default"
      />
    </div>
  );
};

export default EventDetailsInfo;
