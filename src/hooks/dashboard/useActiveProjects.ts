
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Project } from '@/types';

export const useActiveProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) return;
      
      try {
        // Fetch active projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select(`
            id, 
            title, 
            description, 
            committee, 
            status, 
            start_date, 
            end_date,
            created_at,
            updated_at,
            project_members(id, user_id)
          `)
          .eq('status', 'in-progress')
          .limit(3);
          
        if (projectsError) throw projectsError;
        
        // For each project, fetch member details from profiles
        const projectsWithMembers = await Promise.all((projectsData || []).map(async (project) => {
          const memberIds = project.project_members.map((member: any) => member.user_id);
          
          // Fetch member profiles
          const { data: memberProfiles, error: membersError } = await supabase
            .from('profiles')
            .select('id, name, avatar, email, role')
            .in('id', memberIds);
            
          if (membersError) throw membersError;
          
          // Fetch project tasks count
          const { count: tasksCount, error: tasksError } = await supabase
            .from('project_tasks')
            .select('*', { count: 'exact', head: true })
            .eq('project_id', project.id);
            
          if (tasksError) throw tasksError;
          
          return {
            id: project.id,
            title: project.title,
            description: project.description,
            committee: project.committee,
            status: project.status,
            startDate: new Date(project.start_date),
            endDate: new Date(project.end_date),
            members: memberProfiles || [],
            tasks: Array(tasksCount || 0).fill({}), // Just need the length
            createdAt: new Date(project.created_at),
            updatedAt: new Date(project.updated_at)
          } as Project;
        }));
        
        setProjects(projectsWithMembers);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching projects:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [user]);

  return { projects, isLoading, error };
};
