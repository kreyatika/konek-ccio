
import { Project } from '@/types';
import { tasks } from './tasks';
import { users } from './users';

// Sample projects
export const projects: Project[] = [
  {
    id: '1',
    title: 'Annual Business Awards',
    description: 'Organize and execute the annual business awards ceremony honoring local businesses',
    committee: 'Events',
    status: 'in-progress',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    tasks: [tasks[2], tasks[3]],
    members: [users[0], users[1], users[3]],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '2',
    title: 'Community Business Expo',
    description: 'Showcase local businesses and provide networking opportunities',
    committee: 'Development',
    status: 'planned',
    startDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    tasks: [tasks[4]],
    members: [users[0], users[2]],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
  },
  {
    id: '3',
    title: 'Website Redesign',
    description: 'Update the chamber website with modern design and improved functionality',
    committee: 'Marketing',
    status: 'in-progress',
    startDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000), // 40 days from now
    tasks: [tasks[0]],
    members: [users[1], users[2]],
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
];

// Function to get all projects
export const getAllProjects = () => projects;
