
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Task } from '@/types';

export const useKanbanTasksData = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // First get all kanban tasks
      const { data: kanbanTasks, error: kanbanError } = await supabase
        .from('kanban_tasks')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (kanbanError) throw kanbanError;
      
      // Then get all project tasks
      const { data: projectTasks, error: projectError } = await supabase
        .from('project_tasks')
        .select('*, projects(committee)')
        .order('created_at', { ascending: false });
        
      if (projectError) throw projectError;
      
      // Get all the user profiles we need
      const allTasks = [...kanbanTasks, ...projectTasks];
      const assigneeIds = allTasks
        .map(task => task.assignee_id)
        .filter(id => id !== null && id !== undefined);
        
      if (assigneeIds.length === 0) {
        // No assignees, return tasks without user data
        const formattedTasks = formatTasksWithoutUsers(kanbanTasks, projectTasks);
        setTasks(formattedTasks);
        setLoading(false);
        return;
      }
      
      // Get user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, email, role, avatar')
        .in('id', assigneeIds);
        
      if (profilesError) throw profilesError;
      
      // Create a map of user profiles for easy lookup
      const profilesMap = (profiles || []).reduce((acc: Record<string, any>, profile) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
      
      // Format tasks with user data
      const formattedTasks = formatTasks(kanbanTasks, projectTasks, profilesMap);
      setTasks(formattedTasks);
      
    } catch (error) {
      console.error('Error fetching kanban tasks:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const formatTasksWithoutUsers = (
    kanbanTasks: any[], 
    projectTasks: any[]
  ): Task[] => {
    const formatted = [
      ...kanbanTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        assigneeId: null,
        assignee: undefined,
        committee: undefined,
        // Properly handle date conversion
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at || task.created_at),
      })),
      ...projectTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        assigneeId: null,
        assignee: undefined,
        committee: task.projects?.committee,
        projectId: task.project_id,
        // Properly handle date conversion
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at || task.created_at),
      }))
    ];
    
    return formatted;
  };
  
  const formatTasks = (
    kanbanTasks: any[], 
    projectTasks: any[], 
    profilesMap: Record<string, any>
  ): Task[] => {
    const formatted = [
      ...kanbanTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        assigneeId: task.assignee_id,
        assignee: task.assignee_id ? {
          id: task.assignee_id,
          name: profilesMap[task.assignee_id]?.name || 'Unknown User',
          email: profilesMap[task.assignee_id]?.email || '',
          role: profilesMap[task.assignee_id]?.role || 'member',
          avatar: profilesMap[task.assignee_id]?.avatar || '',
        } : undefined,
        committee: undefined,
        // Properly handle date conversion
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at || task.created_at),
      })),
      ...projectTasks.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority || 'medium',
        assigneeId: task.assignee_id,
        assignee: task.assignee_id ? {
          id: task.assignee_id,
          name: profilesMap[task.assignee_id]?.name || 'Unknown User',
          email: profilesMap[task.assignee_id]?.email || '',
          role: profilesMap[task.assignee_id]?.role || 'member',
          avatar: profilesMap[task.assignee_id]?.avatar || '',
        } : undefined,
        committee: task.projects?.committee,
        projectId: task.project_id,
        // Properly handle date conversion
        dueDate: task.due_date ? new Date(task.due_date) : undefined,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at || task.created_at),
      }))
    ];
    
    console.log('Formatted tasks with dates:', formatted.map(t => ({
      id: t.id, 
      title: t.title, 
      dueDate: t.dueDate
    })));
    
    return formatted;
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  
  return {
    tasks,
    loading,
    fetchTasks,
  };
};
