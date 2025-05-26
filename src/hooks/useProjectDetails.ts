
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus } from '@/types';

export const useProjectDetails = (projectId: string) => {
  return useQuery({
    queryKey: ['project-details', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          project_members(*, user_id),
          project_tasks(*)
        `)
        .eq('id', projectId)
        .maybeSingle();
        
      if (error) {
        console.error('Error fetching project details:', error);
        throw new Error('Failed to load project details');
      }

      if (!data) {
        throw new Error('Project not found');
      }
      
      // Fetch profiles for project members
      const memberIds = data.project_members.map((member: any) => member.user_id);
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', memberIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }
      
      const profilesMap = (profiles || []).reduce((acc: Record<string, any>, profile: any) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
      
      // Transform project members with profile data
      const members = data.project_members.map((member: any) => {
        const profile = profilesMap[member.user_id] || {};
        return {
          id: member.user_id,
          name: profile.name || 'Unknown User',
          email: profile.email || '',
          role: profile.role || 'member',
          avatar: profile.avatar || ''
        };
      });
      
      // Transform tasks
      const tasks = data.project_tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status as any,
        priority: task.priority || 'medium',
        committee: data.committee || '',
        assigneeId: task.assignee_id || null,
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at || task.created_at),
      }));
      
      // Ensure status is a valid ProjectStatus
      const validStatuses: ProjectStatus[] = ['planned', 'in-progress', 'review', 'completed'];
      const status = validStatuses.includes(data.status as ProjectStatus) 
        ? (data.status as ProjectStatus) 
        : 'planned';
      
      // Build the project object
      const project: Project = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        committee: data.committee || '',
        status: status,
        startDate: new Date(data.start_date),
        endDate: new Date(data.end_date),
        tasks,
        members,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at || data.created_at),
      };
      
      return project;
    },
    enabled: !!projectId
  });
};
