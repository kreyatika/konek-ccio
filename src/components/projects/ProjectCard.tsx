
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Users } from 'lucide-react';
import { format } from 'date-fns';
import { Project } from '@/types';
import StatusBadge from '@/components/ui/status-badge';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const formatDate = (date: Date) => {
    return format(new Date(date), 'MMM d, yyyy');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Ensure members array exists
  const members = project.members || [];

  return (
    <Card className="h-full hover:shadow-md transition-shadow">
      <Link to={`/projects/${project.id}`} className="block h-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-semibold line-clamp-2">
              {project.title}
            </CardTitle>
            <StatusBadge status={project.status} />
          </div>
          <div className="text-sm text-muted-foreground">{project.committee}</div>
        </CardHeader>
        <CardContent>
          <div className="text-sm mb-4 line-clamp-2">
            {project.description}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              <span>
                {formatDate(project.startDate)} - {formatDate(project.endDate)}
              </span>
            </div>
            
            <div className="flex items-center">
              <Users className="h-3 w-3 mr-1" />
              <span>{members.length}</span>
            </div>
          </div>
          
          <div className="mt-4 flex">
            <div className="flex -space-x-2 overflow-hidden">
              {members.slice(0, 3).map((member, index) => (
                <Avatar key={index} className="h-6 w-6 border-2 border-background">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{getInitials(member.name)}</AvatarFallback>
                </Avatar>
              ))}
              {members.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                  +{members.length - 3}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProjectCard;
