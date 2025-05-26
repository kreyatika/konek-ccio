
import React from 'react';
import { format } from 'date-fns';
import { CalendarClock, ListChecks, Users } from 'lucide-react';
import { Project, User } from '@/types';
import StatusBadge from '@/components/ui/status-badge';
import { Separator } from '@/components/ui/separator';

interface ProjectDetailHeaderProps {
  project: Project;
  allMembers?: User[];
  committeeMembersCount?: number;
}

const ProjectDetailHeader: React.FC<ProjectDetailHeaderProps> = ({ 
  project, 
  allMembers = project.members,
  committeeMembersCount 
}) => {
  // Use allMembers for display if provided, otherwise fall back to project.members
  const displayMembers = allMembers || project.members;
  const totalMembersCount = committeeMembersCount !== undefined ? 
    committeeMembersCount : 
    displayMembers.length;
    
  // Calculate the correct member text (singular or plural)
  const memberText = totalMembersCount === 1 ? 'member' : 'members';
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{project.title}</h1>
          <p className="text-muted-foreground">{project.committee} Committee</p>
        </div>
        <StatusBadge status={project.status} className="h-7 text-sm" />
      </div>
      
      <p className="text-base">{project.description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
        <div className="flex items-center">
          <CalendarClock className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Timeline</p>
            <p className="text-sm font-medium">
              {format(new Date(project.startDate), 'MMM d, yyyy')} - {format(new Date(project.endDate), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <ListChecks className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Tasks</p>
            <p className="text-sm font-medium">{project.tasks.length} tasks</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Users className="h-5 w-5 mr-2 text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Members</p>
            <p className="text-sm font-medium">
              {totalMembersCount} {memberText}
            </p>
          </div>
        </div>
      </div>
      
      <Separator />
    </div>
  );
};

export default ProjectDetailHeader;
