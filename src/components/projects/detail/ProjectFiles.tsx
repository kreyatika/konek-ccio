
import React from 'react';
import ProjectFilesContainer from './ProjectFilesContainer';

interface ProjectFilesProps {
  projectId: string;
  isCommitteeMember: boolean;
}

const ProjectFiles: React.FC<ProjectFilesProps> = ({ projectId, isCommitteeMember }) => {
  return <ProjectFilesContainer projectId={projectId} isCommitteeMember={isCommitteeMember} />;
};

export default ProjectFiles;
