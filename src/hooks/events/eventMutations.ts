
import { Event } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { uploadEventImage } from './eventQueries';

export async function addEventToSupabase(
  event: Omit<Event, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'attachments'>,
  eventImage?: File
) {
  let imageUrl = null;

  if (eventImage) {
    imageUrl = await uploadEventImage(eventImage);
  }

  const { data, error } = await supabase
    .from('events')
    .insert({
      title: event.title,
      description: event.description,
      committee: event.committee || null,
      start_date: event.startDate.toISOString(),
      end_date: event.endDate.toISOString(),
      location: event.location,
      rsvp_deadline: event.rsvpDeadline ? event.rsvpDeadline.toISOString() : null,
      image_url: imageUrl
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error adding event:', error);
    throw new Error(error.message);
  }

  if (event.attendees && event.attendees.length > 0) {
    const attendeeInserts = event.attendees.map(attendee => ({
      event_id: data.id,
      user_id: attendee.id,
    }));

    const { error: attendeesError } = await supabase
      .from('event_attendees')
      .insert(attendeeInserts);

    if (attendeesError) {
      console.error('Error adding attendees:', attendeesError);
      throw new Error(attendeesError.message);
    }
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    committee: data.committee || undefined,
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    location: data.location,
    imageUrl: data.image_url,
    rsvpDeadline: data.rsvp_deadline ? new Date(data.rsvp_deadline) : undefined,
    attendees: event.attendees || [],
    comments: [],
    attachments: [],
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  } as Event;
}

export async function rsvpToEvent(eventId: string, userId: string) {
  const { error } = await supabase
    .from('event_attendees')
    .insert({
      event_id: eventId,
      user_id: userId,
    });

  if (error) {
    if (error.code === '23505') {
      throw new Error('You have already RSVP\'d to this event');
    }
    throw new Error(error.message);
  }

  return true;
}

export async function cancelRsvp(eventId: string, userId: string) {
  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .match({ event_id: eventId, user_id: userId });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

