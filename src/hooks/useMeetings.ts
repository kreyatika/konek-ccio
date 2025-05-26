import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Meeting, User } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth';

// Type for the meeting data from Supabase
interface SupabaseMeeting {
  id: string;
  title: string;
  description: string;
  committee: string;
  date: string;
  end_date: string;
  location: string;
  agenda: string | null;
  minutes: string | null;
  created_at: string;
  updated_at: string;
  attendees?: User[];
}

// Function to fetch all meetings
export async function fetchMeetings() {
  const { data, error } = await supabase
    .from('meetings')
    .select('*')
    .order('date', { ascending: true });

  if (error) {
    console.error('Error fetching meetings:', error);
    throw new Error(error.message);
  }

  // Fetch attendees for each meeting
  const meetingsWithAttendees = await Promise.all(
    data.map(async (meeting) => {
      const { data: attendeesData, error: attendeesError } = await supabase
        .from('meeting_attendees')
        .select('user_id')
        .eq('meeting_id', meeting.id);

      if (attendeesError) {
        console.error('Error fetching attendees:', attendeesError);
        return { ...meeting, attendees: [] };
      }

      // Convert meeting to our application's Meeting type
      return {
        ...meeting,
        date: new Date(meeting.date),
        endDate: new Date(meeting.end_date),
        attendees: attendeesData.map(item => ({ id: item.user_id, name: '', email: '', role: 'member' as const })),
        createdAt: new Date(meeting.created_at),
        updatedAt: new Date(meeting.updated_at),
      };
    })
  );

  return meetingsWithAttendees as Meeting[];
}

// Function to add a meeting
export async function addMeetingToSupabase(meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) {
  // Insert meeting data
  const { data, error } = await supabase
    .from('meetings')
    .insert({
      title: meeting.title,
      description: meeting.description,
      committee: meeting.committee,
      date: meeting.date.toISOString(),
      end_date: meeting.endDate.toISOString(),
      location: meeting.location,
      agenda: meeting.agenda || null,
      minutes: meeting.minutes || null,
    })
    .select('*')
    .single();

  if (error) {
    console.error('Error adding meeting:', error);
    throw new Error(error.message);
  }

  // Add attendees
  if (meeting.attendees.length > 0) {
    const attendeeInserts = meeting.attendees.map(attendee => ({
      meeting_id: data.id,
      user_id: attendee.id,
    }));

    const { error: attendeesError } = await supabase
      .from('meeting_attendees')
      .insert(attendeeInserts);

    if (attendeesError) {
      console.error('Error adding attendees:', attendeesError);
      throw new Error(attendeesError.message);
    }
  }

  // Return the newly created meeting with proper format
  return {
    ...data,
    id: data.id,
    date: new Date(data.date),
    endDate: new Date(data.end_date),
    attendees: meeting.attendees,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  } as Meeting;
}

export function useMeetings() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  // Query to fetch meetings
  const { data: meetings, isLoading, error } = useQuery({
    queryKey: ['meetings'],
    queryFn: fetchMeetings,
  });

  // Mutation to add a meeting
  const addMeetingMutation = useMutation({
    mutationFn: addMeetingToSupabase,
    onSuccess: (newMeeting) => {
      toast.success('Meeting created successfully');
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
    },
    onError: (error) => {
      toast.error('Failed to create meeting: ' + error.message);
    },
  });

  const addMeeting = (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    addMeetingMutation.mutate(meeting);
  };

  // Filter meetings for the view
  const upcomingMeetings = meetings?.filter(meeting => 
    new Date(meeting.date) >= new Date()
  ) || [];
  
  const pastMeetings = meetings?.filter(meeting => 
    new Date(meeting.date) < new Date()
  ) || [];

  return {
    meetings,
    upcomingMeetings,
    pastMeetings,
    isLoading,
    error,
    addMeeting,
  };
}
