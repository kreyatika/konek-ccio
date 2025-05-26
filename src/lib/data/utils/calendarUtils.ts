
import type { CalendarItem } from '@/types';

// Function to combine calendar items from different sources
export const combineCalendarItems = (
  meetings: any[] = [], 
  events: any[] = [], 
  projects: any[] = []
): CalendarItem[] => {
  return [
    ...meetings.map(meeting => ({
      id: `meeting-${meeting.id}`,
      title: meeting.title,
      start: new Date(meeting.date),
      end: new Date(meeting.end_date),
      allDay: false,
      type: 'meeting' as const,
      committee: meeting.committee,
      location: meeting.location,
      color: '#10B981', // green
      entityId: meeting.id,
    })),
    ...events.map(event => ({
      id: `event-${event.id}`,
      title: event.title,
      start: new Date(event.start_date),
      end: new Date(event.end_date),
      allDay: false,
      type: 'event' as const,
      committee: event.committee,
      location: event.location,
      color: '#8B5CF6', // purple
      entityId: event.id,
    })),
    ...projects.map(project => ({
      id: `project-${project.id}`,
      title: project.title,
      start: new Date(project.start_date),
      end: new Date(project.end_date),
      allDay: true,
      type: 'project' as const,
      committee: project.committee,
      color: '#F59E0B', // amber
      entityId: project.id,
    }))
  ];
};
