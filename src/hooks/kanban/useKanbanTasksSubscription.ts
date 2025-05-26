
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useKanbanTasksSubscription = (onTasksChange: () => void) => {
  useEffect(() => {
    // Subscribe to kanban_tasks changes
    const kanbanChannel = supabase
      .channel('kanban_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'kanban_tasks' },
        (payload) => {
          console.log('Kanban task change received:', payload);
          onTasksChange(); // Refresh tasks when changes occur
        }
      )
      .subscribe();

    // Subscribe to project_tasks changes
    const projectTasksChannel = supabase
      .channel('project_tasks_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'project_tasks' },
        (payload) => {
          console.log('Project task change received:', payload);
          onTasksChange(); // Refresh tasks when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(kanbanChannel);
      supabase.removeChannel(projectTasksChannel);
    };
  }, [onTasksChange]);
};
