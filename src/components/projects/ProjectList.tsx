
import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@/types';

interface ProjectListProps {
  projects: Project[];
  emptyMessage?: string;
}

const ProjectList: React.FC<ProjectListProps> = ({ 
  projects, 
  emptyMessage = "No projects found. Create a new project to get started."
}) => {
  if (!projects || projects.length === 0) {
    return (
      <div className="col-span-3 py-10 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
};

export default ProjectList;
