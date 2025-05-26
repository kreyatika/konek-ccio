
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Activity } from '@/types';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      
      try {
        // Mock activities for now - in a real app, these would come from the database
        const mockActivities: Activity[] = [
          {
            id: '1',
            title: 'Project created',
            description: 'New project "Website Redesign" was created',
            type: 'project',
            entityId: 'project-1',
            entityType: 'project',
            createdAt: new Date(Date.now() - 3600000), // 1 hour ago
            user: {
              id: '1',
              name: 'John Doe',
              avatar: '',
              email: 'john@example.com',
              role: 'board'
            }
          },
          {
            id: '2',
            title: 'Meeting scheduled',
            description: 'Board meeting scheduled for next week',
            type: 'meeting',
            entityId: 'meeting-1',
            entityType: 'meeting',
            createdAt: new Date(Date.now() - 86400000), // 1 day ago
            user: {
              id: '2',
              name: 'Jane Smith',
              avatar: '',
              email: 'jane@example.com',
              role: 'staff'
            }
          },
          {
            id: '3',
            title: 'Task completed',
            description: 'Task "Create wireframes" marked as complete',
            type: 'task',
            entityId: 'task-1',
            entityType: 'task',
            createdAt: new Date(Date.now() - 172800000), // 2 days ago
            user: {
              id: '3',
              name: 'Alex Johnson',
              avatar: '',
              email: 'alex@example.com',
              role: 'member'
            }
          }
        ];
        
        setActivities(mockActivities);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching activities:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  return { activities, isLoading, error };
};
