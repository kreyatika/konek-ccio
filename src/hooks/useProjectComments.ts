
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
}

export const useProjectComments = (projectId: string) => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const commentsPerPage = 5; // Number of comments to show per page

  const { data: comments = [], isLoading, error } = useQuery({
    queryKey: ['project-comments', projectId, page],
    queryFn: async () => {
      // First, get the count of total comments for pagination
      const { count, error: countError } = await supabase
        .from('project_comments')
        .select('id', { count: 'exact', head: true })
        .eq('project_id', projectId);
        
      if (countError) {
        console.error('Error fetching comment count:', countError);
      } else {
        setTotalComments(count || 0);
      }
      
      // Then fetch the actual comments with pagination
      const { data, error } = await supabase
        .from('project_comments')
        .select(`
          id,
          content,
          created_at,
          user_id
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false })
        .range((page - 1) * commentsPerPage, page * commentsPerPage - 1);
        
      if (error) {
        console.error('Error fetching comments:', error);
        throw new Error('Failed to fetch comments');
      }
      
      // If no comments, return empty array
      if (data.length === 0) return [];
      
      // Fetch user profiles for all commenters
      const userIds = [...new Set(data.map((comment: any) => comment.user_id))];
      
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, name, avatar, role')
        .in('id', userIds);
        
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
      }
      
      // Create a map of user profiles
      const profilesMap = (profiles || []).reduce((acc: Record<string, any>, profile: any) => {
        acc[profile.id] = profile;
        return acc;
      }, {});
      
      // Add user info to comments
      return data.map((comment: any) => {
        const profile = profilesMap[comment.user_id] || {};
        return {
          ...comment,
          user: {
            name: profile.name || 'Unknown User',
            avatar: profile.avatar || '',
            role: profile.role || 'member'
          }
        };
      });
    },
    enabled: !!projectId
  });

  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('You must be logged in to comment');
      if (!projectId) throw new Error('Project ID is required');
      
      const { data, error } = await supabase
        .from('project_comments')
        .insert({
          project_id: projectId,
          user_id: userData.user.id,
          content
        })
        .select();
        
      if (error) throw error;
      return data;
    },
    onMutate: async (content) => {
      // Cancel any outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['project-comments', projectId, page] });
      
      // Get current user data for the optimistic update
      const { data: userData } = await supabase.auth.getUser();
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('name, avatar, role')
        .eq('id', userData.user?.id)
        .single();
        
      // Generate optimistic comment
      const optimisticComment = {
        id: `temp-${uuidv4()}`,
        content,
        created_at: new Date().toISOString(),
        user_id: userData.user?.id || '',
        user: {
          name: userProfile?.name || 'You',
          avatar: userProfile?.avatar || '',
          role: userProfile?.role || 'member'
        },
        isOptimistic: true
      };
      
      // Snapshot the current comments
      const previousComments = queryClient.getQueryData(['project-comments', projectId, page]);
      
      // Optimistically update the comments list
      // If we're on page 1, add to beginning; otherwise don't show optimistic update
      if (page === 1) {
        queryClient.setQueryData(
          ['project-comments', projectId, page], 
          (old: any) => [optimisticComment, ...(old || [])]
        );
      }
      
      // Increment total comment count
      setTotalComments((prevCount) => prevCount + 1);
      
      return { previousComments };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-comments', projectId] });
      // When adding a new comment, we don't need to change page anymore since
      // we're using optimistic updates
    },
    onError: (error, _, context) => {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');
      // Restore comment list from snapshot
      if (context?.previousComments) {
        queryClient.setQueryData(['project-comments', projectId, page], context.previousComments);
      }
      // Restore count
      setTotalComments((prevCount) => Math.max(0, prevCount - 1));
    }
  });
  
  const editCommentMutation = useMutation({
    mutationFn: async ({ commentId, content }: { commentId: string; content: string }) => {
      const { error } = await supabase
        .from('project_comments')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', commentId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-comments', projectId] });
      toast.success('Comment updated successfully');
    },
    onError: (error) => {
      console.error('Error updating comment:', error);
      toast.error('Failed to update comment');
    }
  });
  
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase
        .from('project_comments')
        .delete()
        .eq('id', commentId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-comments', projectId] });
      toast.success('Comment deleted');
      
      // Decrement total comments count
      setTotalComments((prevCount) => Math.max(0, prevCount - 1));
      
      // If we're on a page that might now be empty, go back one page
      if (comments.length === 1 && page > 1) {
        setPage(page - 1);
      }
    },
    onError: (error) => {
      console.error('Error deleting comment:', error);
      toast.error('Failed to delete comment');
    }
  });

  return {
    comments,
    isLoading,
    error,
    addComment: (content: string) => addCommentMutation.mutate(content),
    editComment: (commentId: string, content: string) => 
      editCommentMutation.mutate({ commentId, content }),
    deleteComment: (commentId: string) => deleteCommentMutation.mutate(commentId),
    isAddingComment: addCommentMutation.isPending,
    isEditingComment: editCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    pagination: {
      page,
      setPage,
      totalPages: Math.ceil(totalComments / commentsPerPage),
      totalComments
    }
  };
};
