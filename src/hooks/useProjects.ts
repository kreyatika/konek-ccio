
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Project, ProjectStatus, Task, TaskStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

// Map status from database to ProjectStatus type
const mapStatusToProjectStatus = (status: string): ProjectStatus => {
  switch (status) {
    case 'planned':
      return 'planned';
    case 'in-progress':
      return 'in-progress';
    case 'review':
      return 'review';
    case 'completed':
      return 'completed';
    default:
      console.warn(`Unknown project status: ${status}, defaulting to 'planned'`);
      return 'planned';
  }
};

// Map database task status to TaskStatus type
const mapToTaskStatus = (status: string): TaskStatus => {
  switch (status) {
    case 'todo':
      return 'todo';
    case 'in-progress':
      return 'in-progress';
    case 'review':
      return 'review';
    case 'done':
      return 'done';
    default:
      console.warn(`Unknown task status: ${status}, defaulting to 'todo'`);
      return 'todo';
  }
};

// Transform database tasks to Task type
const transformTasks = (tasks: any[], committee: string = ''): Task[] => {
  return (tasks || []).map((task: any) => {
    return {
      id: task.id,
      title: task.title,
      description: task.description || '',
      status: mapToTaskStatus(task.status),
      priority: task.priority as 'low' | 'medium' | 'high' || 'medium',
      committee: committee || '',
      createdAt: new Date(task.created_at || Date.now()),
      updatedAt: new Date(task.updated_at || Date.now()),
    };
  });
};

// Transform database users to User type with profiles
const transformMembers = (members: any[], userProfiles: Record<string, any>) => {
  if (!members || members.length === 0) {
    return [];
  }

  return members.map((member: any) => {
    const profile = userProfiles[member.user_id] || {};
    return {
      id: member.user_id,
      name: profile.name || 'Unknown User',
      email: profile.email || '',
      role: profile.role || 'member',
      avatar: profile.avatar || ''
    };
  });
};

// Fetch user profiles for project members
const fetchUserProfiles = async (userIds: string[]) => {
  // Remove duplicates
  const uniqueUserIds = [...new Set(userIds)];
  
  if (uniqueUserIds.length === 0) {
    return {};
  }
  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', uniqueUserIds);
  
  if (profilesError) {
    console.error('Error fetching user profiles:', profilesError);
    return {};
  }
  
  // Create a lookup object for quick access
  return profiles.reduce((acc: Record<string, any>, profile) => {
    acc[profile.id] = profile;
    return acc;
  }, {});
};

// Transform database projects to Project type
const transformProjects = (
  projects: any[], 
  userProfiles: Record<string, any>
): Project[] => {
  return projects.map(project => {
    // Ensure project_tasks and project_members exist
    const projectTasks = project.project_tasks || [];
    const projectMembers = project.project_members || [];
    
    const transformedTasks = transformTasks(projectTasks, project.committee);
    const transformedMembers = transformMembers(projectMembers, userProfiles);

    return {
      id: project.id,
      title: project.title,
      description: project.description || '',
      committee: project.committee || '',
      status: mapStatusToProjectStatus(project.status),
      startDate: new Date(project.start_date),
      endDate: new Date(project.end_date),
      tasks: transformedTasks,
      members: transformedMembers,
      createdAt: new Date(project.created_at),
      updatedAt: new Date(project.updated_at),
    };
  });
};

// Fetch projects from database
const fetchProjects = async (): Promise<Project[]> => {
  // Fetch projects with their tasks and members
  const { data, error } = await supabase
    .from('projects')
    .select(`
      *,
      project_members(*),
      project_tasks(*)
    `)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
  
  // Handle case where data is null or empty
  if (!data || data.length === 0) {
    return [];
  }
  
  // Extract user IDs from project members
  const userIds = data.flatMap(project => 
    project.project_members ? project.project_members.map((member: any) => member.user_id) : []
  );
  
  // Fetch user profiles
  const userProfiles = await fetchUserProfiles(userIds);
  
  // Transform projects
  return transformProjects(data, userProfiles);
};

export const useProjects = () => {
  const { toast } = useToast();
  
  // Fetch projects query
  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  });

  const handleRefresh = () => {
    projectsQuery.refetch();
    toast({
      title: "Refreshing",
      description: "Refreshing project list...",
    });
  };

  return {
    projects: projectsQuery.data || [],
    isLoading: projectsQuery.isLoading,
    error: projectsQuery.error,
    refetch: projectsQuery.refetch,
    handleRefresh
  };
};
