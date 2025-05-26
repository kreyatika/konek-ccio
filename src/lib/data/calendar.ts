
import { CalendarItem } from '@/types';
import { tasks } from './tasks';
import { meetings } from './meetings';
import { events } from './events';

// Calendar items (combined from tasks, meetings, and events)
export const calendarItems: CalendarItem[] = [
  // Task due dates
  ...tasks.map(task => ({
    id: `task-${task.id}`,
    title: task.title,
    start: task.dueDate || new Date(),
    end: task.dueDate || new Date(),
    allDay: true,
    type: 'task' as const,
    committee: task.committee,
    color: '#3B82F6', // blue
    entityId: task.id,
  })),
  
  // Meetings
  ...meetings.map(meeting => ({
    id: `meeting-${meeting.id}`,
    title: meeting.title,
    start: meeting.date,
    end: new Date(meeting.date.getTime() + 2 * 60 * 60 * 1000), // 2 hours after start
    allDay: false,
    type: 'meeting' as const,
    committee: meeting.committee,
    color: '#10B981', // green
    entityId: meeting.id,
  })),
  
  // Events
  ...events.map(event => ({
    id: `event-${event.id}`,
    title: event.title,
    start: event.startDate,
    end: event.endDate,
    allDay: false,
    type: 'event' as const,
    committee: event.committee,
    color: '#8B5CF6', // purple
    entityId: event.id,
  })),
];

// Function to get calendar items for a specific date range
export const getCalendarItemsByRange = (start: Date, end: Date) => {
  return calendarItems.filter(item => 
    (item.start >= start && item.start <= end) || 
    (item.end >= start && item.end <= end) ||
    (item.start <= start && item.end >= end)
  );
};
