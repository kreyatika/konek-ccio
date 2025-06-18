
import React, { useState } from 'react';
import { Event } from '@/types';
import PageTransition from '@/components/ui/page-transition';
import { useEvents } from '@/hooks/useEvents';
import EventCard from '@/components/events/EventCard';
import EventsHeader from '@/components/events/EventsHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import EditEventModal from '@/components/events/EditEventModal';

const Events = () => {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const {
    upcomingEvents,
    pastEvents,
    isLoading,
    error,
    addEvent,
    rsvpToEvent,
    cancelRsvp,
    hasUserRsvpd,
    editEvent,
    deleteEvent
  } = useEvents();
  
  if (isLoading) {
    return (
      <PageTransition>
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col space-y-6">
            <EventsHeader onCreateEvent={addEvent} />
            
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Upcoming Events</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-[200px] w-full rounded-lg" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </PageTransition>
    );
  }
  
  if (error) {
    return (
      <PageTransition>
        <div className="container px-4 py-6 mx-auto">
          <div className="flex flex-col space-y-6">
            <EventsHeader onCreateEvent={addEvent} />
            
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load events. Please try again later.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col space-y-6">
          <EventsHeader onCreateEvent={addEvent} />
          
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Upcoming Events</h2>
            {upcomingEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event}
                    hasRsvpd={hasUserRsvpd(event.id)}
                    onRsvp={rsvpToEvent}
                    onCancelRsvp={cancelRsvp}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={deleteEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No upcoming events scheduled.
              </div>
            )}
            
            <h2 className="text-xl font-semibold mt-8">Past Events</h2>
            {pastEvents.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    isPast={true}
                    onEdit={() => setEditingEvent(event)}
                    onDelete={deleteEvent}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No past events to display.
              </div>
            )}
          </div>
        </div>
      </div>

      <EditEventModal
        event={editingEvent}
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        onSave={editEvent}
      />
    </PageTransition>
  );
};

export default Events;
