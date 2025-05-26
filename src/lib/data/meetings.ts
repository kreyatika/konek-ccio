
import { Meeting } from '@/types';
import { users } from './users';

// Sample meetings
export const meetings: Meeting[] = [
  {
    id: '1',
    title: 'Board of Directors Meeting',
    description: 'Monthly board meeting to discuss chamber operations and strategy',
    committee: 'Board',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours after start
    location: 'Chamber Conference Room',
    attendees: [users[0], users[1]],
    agenda: 'Review budget, discuss upcoming events, committee updates',
    minutes: '',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Marketing Committee Meeting',
    description: 'Discuss promotional strategies for upcoming events',
    committee: 'Marketing',
    date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    endDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours after start
    location: 'Virtual (Zoom)',
    attendees: [users[0], users[2], users[3]],
    agenda: 'Social media campaign, newsletter content, press releases',
    minutes: '',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Membership Committee Meeting',
    description: 'Review new member applications and retention strategies',
    committee: 'Comité d\'Adhésion',
    date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    endDate: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours after start
    location: 'Chamber Meeting Room B',
    attendees: [users[1], users[3]],
    agenda: 'New member review, retention program planning, membership benefits discussion',
    minutes: '',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Function to get all meetings
export const getAllMeetings = () => meetings;

// Function to get meeting by ID
export const getMeetingById = (id: string) => {
  return meetings.find(meeting => meeting.id === id) || null;
};

// Function to add a new meeting
export const addMeeting = (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
  const newMeeting: Meeting = {
    ...meeting,
    id: String(meetings.length + 1),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  meetings.push(newMeeting);
  return newMeeting;
};
