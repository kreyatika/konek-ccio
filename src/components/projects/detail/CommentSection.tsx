
import React from 'react';
import { useAuth } from '@/contexts/auth';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

interface CommentSectionProps {
  projectId: string;
  isCommitteeMember: boolean;
  comments: any[];
  isLoading: boolean;
  error: Error | null;
  addComment: (content: string) => void;
  editComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
  isAddingComment: boolean;
  isEditingComment: boolean;
  isDeletingComment: boolean;
  pagination: any;
}

const CommentSection: React.FC<CommentSectionProps> = ({
  projectId,
  isCommitteeMember,
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
}) => {
  const { user } = useAuth();
  
  const handleSubmitComment = (content: string) => {
    addComment(content);
  };
  
  const handleEditComment = (commentId: string, content: string) => {
    editComment(commentId, content);
  };
  
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment(commentId);
    }
  };
  
  if (error) {
    return <div className="text-destructive">Failed to load comments</div>;
  }
  
  return (
    <div className="space-y-4">
      {isCommitteeMember && (
        <CommentForm
          onSubmit={handleSubmitComment}
          isSubmitting={isAddingComment}
        />
      )}
      
      <div className="space-y-4 mt-6">
        <CommentList
          comments={comments}
          isLoading={isLoading}
          currentUserId={user?.id}
          onDeleteComment={handleDeleteComment}
          onEditComment={handleEditComment}
          isDeletingComment={isDeletingComment}
          isEditingComment={isEditingComment}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default CommentSection;
