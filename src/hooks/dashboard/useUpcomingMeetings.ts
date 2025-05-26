
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Meeting } from '@/types';

export const useUpcomingMeetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMeetings = async () => {
      if (!user) return;
      
      try {
        // Fetch upcoming meetings
        const { data: meetingsData, error: meetingsError } = await supabase
          .from('meetings')
          .select(`
            id, 
            title, 
            description, 
            committee, 
            location, 
            date,
            end_date,
            created_at,
            updated_at
          `)
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(3);
          
        if (meetingsError) throw meetingsError;
        
        // For each meeting, fetch attendees
        const meetingsWithAttendees = await Promise.all((meetingsData || []).map(async (meeting) => {
          // Fetch attendee IDs
          const { data: attendeeData, error: attendeeError } = await supabase
            .from('meeting_attendees')
            .select('user_id')
            .eq('meeting_id', meeting.id);
            
          if (attendeeError) throw attendeeError;
          
          const attendeeIds = (attendeeData || []).map(a => a.user_id);
          
          // Fetch attendee profiles
          const { data: attendeeProfiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, name, avatar, email, role')
            .in('id', attendeeIds);
            
          if (profilesError) throw profilesError;
          
          return {
            id: meeting.id,
            title: meeting.title,
            description: meeting.description,
            committee: meeting.committee,
            location: meeting.location,
            date: new Date(meeting.date),
            endDate: new Date(meeting.end_date),
            attendees: attendeeProfiles || [],
            createdAt: new Date(meeting.created_at),
            updatedAt: new Date(meeting.updated_at)
          } as Meeting;
        }));
        
        setMeetings(meetingsWithAttendees);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching meetings:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMeetings();
  }, [user]);

  return { meetings, isLoading, error };
};
