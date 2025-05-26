
import React from 'react';
import { Project, User } from '@/types';
import TasksContainer from './task/TasksContainer';
import ScheduleMeetingButton from './ScheduleMeetingButton';

interface ProjectDetailContentProps {
  project: Project;
  isCommitteeMember: boolean;
  committeeMembers: User[];
  onAddMeeting: (meetingData: any) => void;
}

const ProjectDetailContent: React.FC<ProjectDetailContentProps> = ({ 
  project, 
  isCommitteeMember, 
  committeeMembers,
  onAddMeeting
}) => {
  // Combine all members for assignee lookup
  const allMembers = React.useMemo(() => {
    const memberIds = new Set(project.members.map(member => member.id));
    const allMembers = [...project.members];
    
    committeeMembers.forEach(member => {
      if (!memberIds.has(member.id)) {
        allMembers.push(member);
      }
    });
    
    return allMembers;
  }, [project.members, committeeMembers]);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-2">
        <ScheduleMeetingButton 
          project={project}
          onAddMeeting={onAddMeeting}
        />
      </div>
      <TasksContainer 
        tasks={project.tasks} 
        projectId={project.id}
        isCommitteeMember={isCommitteeMember} 
        committeeMembers={committeeMembers}
        allMembers={allMembers}
      />
    </div>
  );
};

export default ProjectDetailContent;
