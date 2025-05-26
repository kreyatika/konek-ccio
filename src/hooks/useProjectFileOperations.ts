
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  uploadFileToStorage,
  createFileRecord,
  deleteFileFromStorage,
  deleteFileRecord
} from '@/lib/files/fileUtils';
import { ProjectFile } from './useProjectFiles';

/**
 * Hook for file upload operations
 */
export const useFileUpload = (projectId: string) => {
  const queryClient = useQueryClient();

  const uploadFileMutation = useMutation({
    mutationFn: async (file: File) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('You must be logged in to upload files');
      
      // Upload file to storage
      const uploadData = await uploadFileToStorage(file, projectId, userData.user.id);
      if (!uploadData) throw new Error('Failed to upload file');
      
      // Create file record in database
      return await createFileRecord(projectId, userData.user.id, file, uploadData.path);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
    }
  });

  return {
    uploadFile: (file: File) => uploadFileMutation.mutate(file),
    isUploading: uploadFileMutation.isPending
  };
};

/**
 * Hook for file deletion operations
 */
export const useFileDelete = (projectId: string) => {
  const queryClient = useQueryClient();

  const deleteFileMutation = useMutation({
    mutationFn: async (file: ProjectFile) => {
      // Delete from storage
      await deleteFileFromStorage(file.file_path);
      
      // Delete record from database
      await deleteFileRecord(file.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-files', projectId] });
      toast.success('File deleted');
    },
    onError: (error) => {
      console.error('Error deleting file:', error);
      toast.error('Failed to delete file');
    }
  });

  return {
    deleteFile: (file: ProjectFile) => deleteFileMutation.mutate(file),
    isDeleting: deleteFileMutation.isPending
  };
};
