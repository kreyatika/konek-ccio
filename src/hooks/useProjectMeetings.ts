
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Meeting } from '@/types';

export const useProjectMeetings = (projectId: string, projectTitle?: string) => {
  return useQuery({
    queryKey: ['project-meetings', projectId],
    queryFn: async () => {
      // Filter meetings related to this project by checking if the title contains the project title
      // This works because when scheduling from a project, the meeting title is prefixed with: "Meeting: Project Title"
      if (!projectTitle) {
        console.log('No project title provided, returning empty array');
        return [];
      }
      
      // Log the project title we're searching for to help with debugging
      console.log('Searching for meetings related to project:', projectTitle);
      
      // Use a more flexible query to catch all meetings related to this project
      // We'll match any part of the project title in the meeting title
      const { data, error } = await supabase
        .from('meetings')
        .select(`
          *,
          meeting_attendees(user_id)
        `)
        .ilike('title', `%${projectTitle}%`) // Using ilike for case-insensitive contains matching
        .order('date', { ascending: true });
        
      if (error) {
        console.error('Error fetching project meetings:', error);
        throw new Error(`Failed to load project meetings: ${error.message}`);
      }
      
      console.log('Meetings data from Supabase:', data);
      
      // Transform meetings to our app format
      const meetings: Meeting[] = (data || []).map(meeting => ({
        id: meeting.id,
        title: meeting.title,
        description: meeting.description,
        committee: meeting.committee,
        date: new Date(meeting.date),
        endDate: new Date(meeting.end_date),
        location: meeting.location,
        attendees: meeting.meeting_attendees.map((attendee: any) => ({ 
          id: attendee.user_id,
          name: '', // We don't need these fields for this view
          email: '',
          role: 'member' as const
        })),
        agenda: meeting.agenda || undefined,
        minutes: meeting.minutes || undefined,
        createdAt: new Date(meeting.created_at),
        updatedAt: new Date(meeting.updated_at),
      }));
      
      console.log('Transformed meetings:', meetings);
      return meetings;
    },
    enabled: !!projectId && !!projectTitle,
    staleTime: 5000 // 5 seconds, lowered to ensure fresher data
  });
};
