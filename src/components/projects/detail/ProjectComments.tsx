
import React from 'react';
import { useProjectComments } from '@/hooks/useProjectComments';
import CommentSection from './CommentSection';

interface ProjectCommentsProps {
  projectId: string;
  isCommitteeMember: boolean;
}

const ProjectComments: React.FC<ProjectCommentsProps> = ({ projectId, isCommitteeMember }) => {
  const {
    comments,
    isLoading,
    error,
    addComment,
    editComment,
    deleteComment,
    isAddingComment,
    isEditingComment,
    isDeletingComment,
    pagination
  } = useProjectComments(projectId);

  return (
    <CommentSection
      projectId={projectId}
      isCommitteeMember={isCommitteeMember}
      comments={comments}
      isLoading={isLoading}
      error={error}
      addComment={addComment}
      editComment={editComment}
      deleteComment={deleteComment}
      isAddingComment={isAddingComment}
      isEditingComment={isEditingComment}
      isDeletingComment={isDeletingComment}
      pagination={pagination}
    />
  );
};

export default ProjectComments;
