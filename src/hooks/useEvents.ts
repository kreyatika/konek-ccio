
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Event } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';
import { fetchEvents } from './events/eventQueries';
import { addEventToSupabase, rsvpToEvent, cancelRsvp, editEventInSupabase, deleteEventFromSupabase } from './events/eventMutations';

export function useEvents() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: events, isLoading, error } = useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });

  const editEventMutation = useMutation({
    mutationFn: ({ eventId, event, image }: { 
      eventId: string,
      event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>>, 
      image?: File 
    }) => editEventInSupabase(eventId, event, image),
    onSuccess: () => {
      toast.success('Event updated successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error('Failed to update event: ' + error.message);
    },
  });

  const deleteEventMutation = useMutation({
    mutationFn: (eventId: string) => deleteEventFromSupabase(eventId),
    onSuccess: () => {
      toast.success('Event deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error('Failed to delete event: ' + error.message);
    },
  });

  const addEventMutation = useMutation({
    mutationFn: ({ event, image }: { 
      event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>, 
      image?: File 
    }) => addEventToSupabase(event, image),
    onSuccess: () => {
      toast.success('Event created successfully');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error('Failed to create event: ' + error.message);
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) => 
      rsvpToEvent(eventId, userId),
    onSuccess: () => {
      toast.success('RSVP successful');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const cancelRsvpMutation = useMutation({
    mutationFn: ({ eventId, userId }: { eventId: string; userId: string }) => 
      cancelRsvp(eventId, userId),
    onSuccess: () => {
      toast.success('RSVP cancelled');
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
    onError: (error) => {
      toast.error('Failed to cancel RSVP: ' + error.message);
    },
  });

  const addEvent = (
    event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>, 
    eventImage?: File
  ) => {
    addEventMutation.mutate({ event, image: eventImage });
  };

  const rsvpToEventFn = (eventId: string) => {
    if (!user) {
      toast.error('You must be logged in to RSVP');
      return;
    }
    rsvpMutation.mutate({ eventId, userId: user.id });
  };

  const cancelRsvpFn = (eventId: string) => {
    if (!user) return;
    cancelRsvpMutation.mutate({ eventId, userId: user.id });
  };

  const upcomingEvents = events?.filter(event => 
    new Date(event.startDate) >= new Date()
  ) || [];
  
  const pastEvents = events?.filter(event => 
    new Date(event.startDate) < new Date()
  ) || [];

  const hasUserRsvpd = (eventId: string): boolean => {
    if (!user || !events) return false;
    const event = events.find(e => e.id === eventId);
    return event ? event.attendees.some(attendee => attendee.id === user.id) : false;
  };

  const editEvent = (
    eventId: string,
    event: Partial<Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>>, 
    eventImage?: File
  ) => {
    editEventMutation.mutate({ eventId, event, image: eventImage });
  };

  const deleteEvent = (eventId: string) => {
    deleteEventMutation.mutate(eventId);
  };

  return {
    events,
    upcomingEvents,
    pastEvents,
    isLoading,
    error,
    addEvent,
    rsvpToEvent: rsvpToEventFn,
    cancelRsvp: cancelRsvpFn,
    hasUserRsvpd,
    editEvent,
    deleteEvent,
  };
}

