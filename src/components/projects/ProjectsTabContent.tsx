
import React from 'react';
import { TabsContent } from '@/components/ui/tabs';
import ProjectList from './ProjectList';
import { Project, ProjectStatus } from '@/types';

interface ProjectsTabContentProps {
  value: string;
  projects: Project[];
  filter?: ProjectStatus;
  emptyMessage?: string;
}

const ProjectsTabContent: React.FC<ProjectsTabContentProps> = ({ 
  value, 
  projects, 
  filter,
  emptyMessage 
}) => {
  const filteredProjects = filter 
    ? projects.filter(p => p.status === filter)
    : projects;

  return (
    <TabsContent value={value} className="mt-6">
      <ProjectList 
        projects={filteredProjects} 
        emptyMessage={emptyMessage} 
      />
    </TabsContent>
  );
};

export default ProjectsTabContent;
