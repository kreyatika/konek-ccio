
import { Task, TaskStatus } from '@/types';
import { users } from './users';

// Sample tasks
export const tasks: Task[] = [
  {
    id: '1',
    title: 'Update chamber website with new board members',
    description: 'Add profiles and photos for all newly elected board members to the website',
    status: 'todo',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    assignee: users[2], // Michael
    committee: 'Marketing',
    priority: 'high',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Prepare annual budget report',
    description: 'Compile financial data and create presentation for board review',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    assignee: users[1], // Sarah
    committee: 'Finance',
    priority: 'high',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Coordinate with venue for annual gala',
    description: 'Finalize menu, seating arrangements, and A/V requirements',
    status: 'review',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    assignee: users[3], // Emily
    committee: 'Events',
    priority: 'medium',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '4',
    title: 'Secure sponsors for business expo',
    description: 'Reach out to potential sponsors and prepare sponsorship packages',
    status: 'done',
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    assignee: users[0], // Alex
    committee: 'Development',
    priority: 'high',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    id: '5',
    title: 'Send newsletter to members',
    description: 'Compile content and send monthly newsletter',
    status: 'todo',
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    assignee: users[2], // Michael
    committee: 'Communication',
    priority: 'medium',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  {
    id: '6',
    title: 'Plan networking event for new members',
    description: 'Organize venue, agenda, and invitations for monthly mixer',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    assignee: users[3], // Emily
    committee: 'Membership',
    priority: 'medium',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
];

// Function to get all tasks (useful for search functionality)
export const getAllTasks = () => tasks;

// Function to get tasks by status
export const getTasksByStatus = (status: TaskStatus) => {
  return tasks.filter(task => task.status === status);
};

// Function to get tasks by assignee
export const getTasksByAssignee = (userId: string) => {
  return tasks.filter(task => task.assignee?.id === userId);
};

// Function to get tasks by committee
export const getTasksByCommittee = (committee: string) => {
  return tasks.filter(task => task.committee === committee);
};
