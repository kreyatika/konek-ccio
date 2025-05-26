
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Check, X } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { formatDistanceToNow } from 'date-fns';

interface CommentItemProps {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    avatar: string;
    role: string;
  };
  user_id: string;
  currentUserId?: string;
  onDelete: (commentId: string) => void;
  onEdit: (commentId: string, content: string) => void;
  isDeleting: boolean;
  isEditing: boolean;
  isOptimistic?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  content,
  created_at,
  user,
  user_id,
  currentUserId,
  onDelete,
  onEdit,
  isDeleting,
  isEditing,
  isOptimistic
}) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  
  const isOwner = currentUserId === user_id;
  
  const handleEditClick = () => {
    setIsEditable(true);
    setEditedContent(content);
  };
  
  const handleCancelEdit = () => {
    setIsEditable(false);
    setEditedContent(content);
  };
  
  const handleSaveEdit = () => {
    if (editedContent.trim() && editedContent !== content) {
      onEdit(id, editedContent);
    }
    setIsEditable(false);
  };
  
  const formattedDate = created_at 
    ? formatDistanceToNow(new Date(created_at), { addSuffix: true })
    : 'just now';

  // Different style for optimistic comments
  const cardClassName = isOptimistic 
    ? "border border-primary/20 bg-primary/5 transition-opacity duration-500"
    : "border";
    
  return (
    <Card className={cardClassName}>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-muted-foreground">
                {user.role} • {formattedDate}
                {isOptimistic && " (posting...)"}
              </div>
            </div>
          </div>
          
          {isOwner && !isOptimistic && (
            <div className="space-x-1">
              {isEditable ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleSaveEdit}
                    disabled={isEditing}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleEditClick}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onDelete(id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="mt-2">
          {isEditable ? (
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="min-h-[80px]"
            />
          ) : (
            <div className="text-sm whitespace-pre-wrap">{content}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentItem;
