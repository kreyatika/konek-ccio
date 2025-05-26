
import React from 'react';
import NewEventDialog from './NewEventDialog';
import { Event } from '@/types';
import { useAuth } from '@/contexts/auth';

interface EventsHeaderProps {
  onCreateEvent: (event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>, eventImage?: File) => void;
}

const EventsHeader: React.FC<EventsHeaderProps> = ({ onCreateEvent }) => {
  const { isAuthenticated, hasPermission } = useAuth();
  const canCreateEvent = isAuthenticated && hasPermission('create');

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Events</h1>
        {canCreateEvent && (
          <NewEventDialog onCreateEvent={onCreateEvent} />
        )}
      </div>
      <p className="text-muted-foreground">
        Discover and register for upcoming chamber events.
      </p>
    </div>
  );
};

export default EventsHeader;
