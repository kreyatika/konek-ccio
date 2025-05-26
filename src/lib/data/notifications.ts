
import { Notification } from '@/types';

// Sample notifications
export const notifications: Notification[] = [
  {
    id: '1',
    user_id: 'sample-user-id', // Added the required user_id field
    title: 'New Task Assignment',
    message: 'You have been assigned to "Update chamber website with new board members"',
    type: 'info',
    read: false,
    link: '/projects',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    id: '2',
    user_id: 'sample-user-id', // Added the required user_id field
    title: 'Meeting Reminder',
    message: 'Board of Directors Meeting tomorrow at 10:00 AM',
    type: 'info',
    read: true,
    link: '/meetings',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
  },
  {
    id: '3',
    user_id: 'sample-user-id', // Added the required user_id field
    title: 'Task Due Soon',
    message: 'Task "Coordinate with venue for annual gala" is due in 3 days',
    type: 'warning',
    read: false,
    link: '/projects',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 - 30 * 60 * 1000), // 1 day and 30 mins ago
  },
  {
    id: '4',
    user_id: 'sample-user-id', // Added the required user_id field
    title: 'Event Update',
    message: 'Location for Business After Hours Mixer has been changed',
    type: 'info',
    read: false,
    link: '/events',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
  },
  {
    id: '5',
    user_id: 'sample-user-id', // Added the required user_id field
    title: 'Task Completed',
    message: 'Task "Secure sponsors for business expo" has been marked as complete',
    type: 'success',
    read: true,
    link: '/projects',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
  },
];

// Function to get all notifications
export const getAllNotifications = () => notifications;
