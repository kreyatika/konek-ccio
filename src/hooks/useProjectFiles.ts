
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import {
  generateSignedUrl,
  downloadFile as downloadFileUtil,
  fetchUserProfiles,
  enrichFilesWithUserInfo
} from '@/lib/files/fileUtils';
import { useFileUpload, useFileDelete } from './useProjectFileOperations';

export interface ProjectFile {
  id: string;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  user_id: string;
  url?: string;
  user: {
    name: string;
  };
}

export const useProjectFiles = (projectId: string) => {
  // Query for fetching project files
  const filesQuery = useQuery({
    queryKey: ['project-files', projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_files')
        .select(`
          id,
          name,
          file_path,
          file_type,
          file_size,
          created_at,
          user_id
        `)
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching files:', error);
        throw new Error('Failed to fetch files');
      }
      
      // If no files, return empty array
      if (data.length === 0) return [];
      
      // Fetch user profiles for all uploaders
      const userIds = [...new Set(data.map((file: any) => file.user_id))];
      const profilesMap = await fetchUserProfiles(userIds);
      
      // Add user info to files
      const filesWithUserInfo = enrichFilesWithUserInfo(data, profilesMap);
      
      // Generate signed URLs for image files
      const filesWithUrls = await Promise.all(
        filesWithUserInfo.map(async (file: ProjectFile) => {
          const signedUrl = await generateSignedUrl(file);
          return signedUrl ? { ...file, url: signedUrl } : file;
        })
      );
      
      return filesWithUrls;
    },
    enabled: !!projectId
  });

  // Get file operations from separate hooks
  const { uploadFile, isUploading } = useFileUpload(projectId);
  const { deleteFile, isDeleting } = useFileDelete(projectId);

  return {
    files: filesQuery.data || [],
    isLoading: filesQuery.isLoading,
    error: filesQuery.error,
    uploadFile,
    deleteFile,
    downloadFile: downloadFileUtil,
    isUploading,
    isDeleting
  };
};

// Re-export formatFileSize for use elsewhere
export { formatFileSize } from '@/lib/files/fileUtils';
