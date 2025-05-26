
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { combineCalendarItems } from '@/lib/data/utils/calendarUtils';
import type { CalendarItem } from '@/types';
import { isSameDay } from 'date-fns';

export function useCalendarData(date: Date, activeTab: string = 'all') {
  // Fetch meetings
  const { data: meetings = [], isLoading: meetingsLoading } = useQuery({
    queryKey: ['meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('meetings')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch projects
  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const isLoading = meetingsLoading || eventsLoading || projectsLoading;

  // Combine all calendar items
  const calendarItems = useMemo(() => 
    combineCalendarItems(meetings, events, projects),
    [meetings, events, projects]
  );

  // Filter items for the selected date and tab
  const selectedDateItems = useMemo(() => {
    return calendarItems.filter(item => {
      if (activeTab !== "all" && item.type !== activeTab) return false;
      return isSameDay(new Date(item.start), date);
    });
  }, [calendarItems, date, activeTab]);

  return {
    calendarItems,
    selectedDateItems,
    isLoading,
    meetings,
    events,
    projects
  };
}
