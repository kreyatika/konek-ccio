
import { Event } from '@/types';

// Sample events
export const events: Event[] = [
  {
    id: '1',
    title: 'Business After Hours Mixer',
    description: 'Networking event hosted at Central Bank headquarters',
    committee: 'Events',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 hours later
    location: 'Central Bank, 123 Main St',
    attendees: [],
    rsvpDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Annual Business Awards Gala',
    description: 'Ceremony honoring excellence in local business',
    committee: 'Events',
    startDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 5 hours later
    location: 'Grand Hotel Ballroom',
    attendees: [],
    rsvpDeadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000), // 50 days from now
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

// Function to get all events
export const getAllEvents = () => events;
