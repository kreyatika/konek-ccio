
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CommentItem from './CommentItem';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  isOptimistic?: boolean;
}

interface CommentListProps {
  comments: Comment[];
  isLoading: boolean;
  currentUserId: string | undefined;
  onDeleteComment: (commentId: string) => void;
  onEditComment: (commentId: string, content: string) => void;
  isDeletingComment: boolean;
  isEditingComment: boolean;
  pagination: {
    page: number;
    setPage: (page: number) => void;
    totalPages: number;
    totalComments: number;
  };
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  isLoading,
  currentUserId,
  onDeleteComment,
  onEditComment,
  isDeletingComment,
  isEditingComment,
  pagination
}) => {
  const { page, setPage, totalPages } = pagination;

  if (isLoading && comments.length === 0) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-24 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No comments yet
      </div>
    );
  }

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Generate page numbers for pagination
  const pageNumbers = [];
  const maxVisiblePages = 5;
  let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  
  // Adjust startPage if we're near the end
  if (endPage - startPage < maxVisiblePages - 1) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            id={comment.id}
            content={comment.content}
            created_at={comment.created_at}
            user={comment.user}
            user_id={comment.user_id}
            currentUserId={currentUserId}
            onDelete={onDeleteComment}
            onEdit={onEditComment}
            isDeleting={isDeletingComment}
            isEditing={isEditingComment}
            isOptimistic={comment.isOptimistic}
          />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => handlePageChange(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            
            {startPage > 1 && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(1)}>
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            
            {startPage > 2 && (
              <PaginationItem>
                <PaginationLink className="cursor-default">...</PaginationLink>
              </PaginationItem>
            )}
            
            {pageNumbers.map((num) => (
              <PaginationItem key={num}>
                <PaginationLink 
                  isActive={page === num}
                  onClick={() => handlePageChange(num)}
                >
                  {num}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationLink className="cursor-default">...</PaginationLink>
              </PaginationItem>
            )}
            
            {endPage < totalPages && (
              <PaginationItem>
                <PaginationLink onClick={() => handlePageChange(totalPages)}>
                  {totalPages}
                </PaginationLink>
              </PaginationItem>
            )}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => handlePageChange(page + 1)}
                className={page === totalPages ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default CommentList;
