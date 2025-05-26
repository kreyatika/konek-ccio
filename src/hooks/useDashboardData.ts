
import { useState, useEffect } from 'react';
import { useStats } from './dashboard/useStats';
import { useActivities } from './dashboard/useActivities';
import { useActiveProjects } from './dashboard/useActiveProjects';
import { useUpcomingMeetings } from './dashboard/useUpcomingMeetings';

export const useDashboardData = () => {
  const statsHook = useStats();
  const activitiesHook = useActivities();
  const projectsHook = useActiveProjects();
  const meetingsHook = useUpcomingMeetings();

  // Check if any of the hooks are still loading
  const isLoading = 
    statsHook.isLoading || 
    activitiesHook.isLoading || 
    projectsHook.isLoading || 
    meetingsHook.isLoading;

  // Combine all errors (if any)
  const error = 
    statsHook.error || 
    activitiesHook.error || 
    projectsHook.error || 
    meetingsHook.error;

  return {
    stats: statsHook.stats,
    activities: activitiesHook.activities,
    projects: projectsHook.projects,
    meetings: meetingsHook.meetings,
    isLoading,
    error
  };
};
