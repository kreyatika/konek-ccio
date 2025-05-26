
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProjectsTabContent from '@/components/projects/ProjectsTabContent';
import { Project } from '@/types';

interface ProjectTabsProps {
  projects: Project[];
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ projects = [] }) => {
  // Ensure projects is an array
  const safeProjects = Array.isArray(projects) ? projects : [];

  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="all">All Projects</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      
      <ProjectsTabContent 
        value="all" 
        projects={safeProjects} 
      />
      
      <ProjectsTabContent 
        value="active" 
        projects={safeProjects} 
        filter="in-progress"
        emptyMessage="No active projects found."
      />
      
      <ProjectsTabContent 
        value="upcoming" 
        projects={safeProjects} 
        filter="planned"
        emptyMessage="No upcoming projects found."
      />
      
      <ProjectsTabContent 
        value="completed" 
        projects={safeProjects} 
        filter="completed"
        emptyMessage="No completed projects found."
      />
    </Tabs>
  );
};

export default ProjectTabs;
