
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Activity } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export const useActivities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchActivities = async () => {
      if (!user) return;
      
      try {
        // Fetch activities from Supabase
        const { data: activitiesData, error: activitiesError } = await supabase
          .from('activities')
          .select(`
            id,
            title,
            description,
            type,
            entity_id,
            entity_type,
            created_at,
            users (
              id,
              name,
              avatar_url,
              email,
              role
            )
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (activitiesError) throw activitiesError;

        if (activitiesData) {
          const formattedActivities: Activity[] = activitiesData.map(activity => ({
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            entityId: activity.entity_id,
            entityType: activity.entity_type,
            createdAt: new Date(activity.created_at),
            user: {
              id: activity.users.id,
              name: activity.users.name,
              avatar: activity.users.avatar_url || '',
              email: activity.users.email,
              role: activity.users.role
            }
          }));

          setActivities(formattedActivities);
        }
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError('Failed to fetch activities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, [user]);

  return {
    activities,
    isLoading,
    error
  };
};
