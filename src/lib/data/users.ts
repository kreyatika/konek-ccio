
import { User } from '@/types';

// Sample users
export const users: User[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    email: 'alex@ccioconnect.com',
    role: 'superadmin',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    name: 'Sarah Williams',
    email: 'sarah@ccioconnect.com',
    role: 'board',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    name: 'Michael Davis',
    email: 'michael@ccioconnect.com',
    role: 'staff',
    avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily@ccioconnect.com',
    role: 'member',
    avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
];

// Function to get user by email (for authentication)
export const getUserByEmail = (email: string) => {
  return users.find(user => user.email === email) || null;
};
