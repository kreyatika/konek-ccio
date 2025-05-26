
import { Event, User } from '@/types';

export interface SupabaseEvent {
  id: string;
  title: string;
  description: string;
  committee: string | null;
  start_date: string;
  end_date: string;
  location: string;
  rsvp_deadline: string | null;
  created_at: string;
  updated_at: string;
  image_url: string | null;
}

export interface EventWithAttendees extends Event {
  attendees: User[];
}

