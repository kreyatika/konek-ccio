
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

export const useStats = () => {
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      
      try {
        // Fetch active projects count
        const { count: activeProjectsCount, error: projectsCountError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'in-progress');
          
        if (projectsCountError) throw projectsCountError;
        
        // Fetch upcoming events count
        const { count: eventsCount, error: eventsCountError } = await supabase
          .from('events')
          .select('*', { count: 'exact', head: true })
          .gte('start_date', new Date().toISOString());
          
        if (eventsCountError) throw eventsCountError;
        
        // Fetch tasks due this week
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);
        
        const { count: tasksCount, error: tasksCountError } = await supabase
          .from('project_tasks')
          .select('*', { count: 'exact', head: true })
          .lt('due_date', nextWeek.toISOString())
          .gt('due_date', new Date().toISOString());
          
        if (tasksCountError) throw tasksCountError;
        
        // Fetch board members count
        const { count: boardMembersCount, error: boardMembersError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })
          .in('role', ['board', 'superadmin']);
          
        if (boardMembersError) throw boardMembersError;
        
        // Set stats
        setStats([
          {
            title: 'Active Projects',
            value: activeProjectsCount || 0,
            change: 0,
            changeType: 'neutral' as const,
          },
          {
            title: 'Upcoming Events',
            value: eventsCount || 0,
            change: 0,
            changeType: 'neutral' as const,
          },
          {
            title: 'Tasks Due This Week',
            value: tasksCount || 0,
            change: 0,
            changeType: 'neutral' as const,
          },
          {
            title: 'Board Members',
            value: boardMembersCount || 0,
            change: 0,
            changeType: 'neutral' as const,
          },
        ]);
        
        setError(null);
      } catch (err: any) {
        console.error('Error fetching stats:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [user]);

  return { stats, isLoading, error };
};
