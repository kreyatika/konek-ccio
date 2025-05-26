
import { Activity } from '@/types';
import { users } from './users';

// Sample activities for dashboard
export const activities: Activity[] = [
  {
    id: '1',
    type: 'task',
    title: 'Task Updated',
    description: 'Sarah Williams updated task "Prepare annual budget report"',
    user: users[1],
    entityId: '2',
    entityType: 'task',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '2',
    type: 'meeting',
    title: 'Meeting Created',
    description: 'Alex Johnson scheduled "Board of Directors Meeting"',
    user: users[0],
    entityId: '1',
    entityType: 'meeting',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: '3',
    type: 'event',
    title: 'Event Updated',
    description: 'Emily Brown updated details for "Business After Hours Mixer"',
    user: users[3],
    entityId: '1',
    entityType: 'event',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
  },
  {
    id: '4',
    type: 'project',
    title: 'Project Started',
    description: 'Website Redesign project has been initiated',
    user: users[0],
    entityId: '3',
    entityType: 'project',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
  },
  {
    id: '5',
    type: 'task',
    title: 'Task Completed',
    description: 'Alex Johnson completed "Secure sponsors for business expo"',
    user: users[0],
    entityId: '4',
    entityType: 'task',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
  {
    id: '6',
    type: 'comment',
    title: 'New Comment',
    description: 'Michael Davis commented on "Update chamber website with new board members"',
    user: users[2],
    entityId: '1',
    entityType: 'task',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 2 * 60 * 60 * 1000), // 1 day and 2 hours ago
  },
];

// Function to get activities for a specific user
export const getActivitiesByUser = (userId: string) => {
  return activities.filter(activity => activity.user.id === userId);
};
