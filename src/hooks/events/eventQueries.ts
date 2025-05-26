
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types';
import { SupabaseEvent } from './types';
import { v4 as uuidv4 } from 'uuid';

export async function fetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });

  if (error) {
    console.error('Error fetching events:', error);
    throw new Error(error.message);
  }

  // Fetch attendees for each event
  const eventsWithAttendees = await Promise.all(
    data.map(async (event) => {
      const { data: attendeesData, error: attendeesError } = await supabase
        .from('event_attendees')
        .select('user_id')
        .eq('event_id', event.id);

      if (attendeesError) {
        console.error('Error fetching attendees:', attendeesError);
        return convertToEvent(event, []);
      }

      return convertToEvent(event, attendeesData.map(item => ({ 
        id: item.user_id, 
        name: '', 
        email: '', 
        role: 'member' as const 
      })));
    })
  );

  return eventsWithAttendees;
}

export async function fetchEventById(eventId: string): Promise<Event> {
  // Fetch the event
  const { data: eventData, error: eventError } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();

  if (eventError) {
    console.error('Error fetching event:', eventError);
    throw new Error(eventError.message);
  }

  // Fetch event attendees
  const { data: attendeesData, error: attendeesError } = await supabase
    .from('event_attendees')
    .select('user_id')
    .eq('event_id', eventId);

  if (attendeesError) {
    console.error('Error fetching attendees:', attendeesError);
    throw new Error(attendeesError.message);
  }

  // Fetch attendee profiles
  const attendeeIds = attendeesData.map(item => item.user_id);
  
  // If there are no attendees, return the event without attendees
  if (attendeeIds.length === 0) {
    return convertToEvent(eventData, []);
  }

  // Fetch attendee profile details
  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name, email, role, avatar')
    .in('id', attendeeIds);

  if (profilesError) {
    console.error('Error fetching attendee profiles:', profilesError);
    // Continue with basic attendee info
    return convertToEvent(eventData, attendeesData.map(item => ({ 
      id: item.user_id, 
      name: '', 
      email: '', 
      role: 'member' as const 
    })));
  }

  return convertToEvent(eventData, profilesData);
}

function convertToEvent(event: SupabaseEvent, attendees: Event['attendees']): Event {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    committee: event.committee || undefined,
    startDate: new Date(event.start_date),
    endDate: new Date(event.end_date),
    location: event.location,
    rsvpDeadline: event.rsvp_deadline ? new Date(event.rsvp_deadline) : undefined,
    imageUrl: event.image_url,
    attendees,
    comments: [],
    attachments: [],
    createdAt: new Date(event.created_at),
    updatedAt: new Date(event.updated_at),
  };
}

export async function uploadEventImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${uuidv4()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('event-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    throw new Error('Error uploading image');
  }

  const { data: urlData } = await supabase.storage
    .from('event-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
}
