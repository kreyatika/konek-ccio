
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CalendarItem } from '@/types/calendar';

export const useUpcomingItems = (staticItems?: CalendarItem[]) => {
  const [items, setItems] = useState<CalendarItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If static items are provided, use those
    if (staticItems) {
      setItems(staticItems);
      return;
    }

    const fetchUpcomingItems = async () => {
      setLoading(true);
      try {
        // Fetch upcoming events
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('id, title, start_date, end_date, committee')
          .gte('start_date', new Date().toISOString())
          .order('start_date', { ascending: true })
          .limit(3);

        if (eventsError) throw eventsError;

        // Fetch upcoming meetings
        const { data: meetings, error: meetingsError } = await supabase
          .from('meetings')
          .select('id, title, date, end_date, committee')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(3);

        if (meetingsError) throw meetingsError;

        // Format events as calendar items
        const eventItems: CalendarItem[] = (events || []).map(event => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start_date),
          end: new Date(event.end_date),
          committee: event.committee,
          color: '#4f46e5', // indigo
          type: 'event'
        }));

        // Format meetings as calendar items
        const meetingItems: CalendarItem[] = (meetings || []).map(meeting => ({
          id: meeting.id,
          title: meeting.title,
          start: new Date(meeting.date),
          end: new Date(meeting.end_date),
          committee: meeting.committee,
          color: '#10b981', // emerald
          type: 'meeting'
        }));

        // Combine and sort all items by start date
        const combinedItems = [...eventItems, ...meetingItems].sort(
          (a, b) => a.start.getTime() - b.start.getTime()
        );

        setItems(combinedItems.slice(0, 5)); // Get the 5 soonest upcoming items
      } catch (error) {
        console.error('Error fetching upcoming items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingItems();
  }, [staticItems]);

  return items;
};
