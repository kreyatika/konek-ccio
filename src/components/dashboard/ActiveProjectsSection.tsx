
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import StatusBadge from '@/components/ui/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Project } from '@/types';

interface ActiveProjectsSectionProps {
  projects: Project[];
}

const ActiveProjectsSection: React.FC<ActiveProjectsSectionProps> = ({ projects }) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <DashboardCard
      title="Active Projects"
      className="md:col-span-3"
      titleAction={
        <Button variant="ghost" size="sm" asChild>
          <a href="/projects">All Projects</a>
        </Button>
      }
    >
      <div className="space-y-4">
        {projects.slice(0, 3).map((project) => (
          <div 
            key={project.id} 
            className="flex flex-col space-y-2 rounded-md border p-4"
          >
            <div className="flex justify-between">
              <div className="font-medium">{project.title}</div>
              <StatusBadge status={project.status} />
            </div>
            <div className="text-sm text-muted-foreground">
              {project.committee} • {project.tasks.length} tasks
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.members.slice(0, 3).map((member) => (
                  <Avatar 
                    key={member.id} 
                    className="h-7 w-7 border-2 border-background"
                  >
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                ))}
                {project.members.length > 3 && (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +{project.members.length - 3}
                  </div>
                )}
              </div>
              <div className="text-xs text-muted-foreground">
                Due {new Date(project.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default ActiveProjectsSection;
