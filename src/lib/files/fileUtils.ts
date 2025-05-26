
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ProjectFile } from '@/hooks/useProjectFiles';

// Function to generate signed URLs for image files
export const generateSignedUrl = async (file: ProjectFile): Promise<string | undefined> => {
  if (!file.file_type?.startsWith('image/')) return undefined;
  
  try {
    const { data: urlData } = await supabase.storage
      .from('project-files')
      .createSignedUrl(file.file_path, 60 * 60); // 1 hour expiration
      
    return urlData?.signedUrl;
  } catch (err) {
    console.error('Error generating signed URL:', err);
    return undefined;
  }
};

// Function to download a file
export const downloadFile = async (file: ProjectFile): Promise<void> => {
  try {
    const { data, error } = await supabase.storage
      .from('project-files')
      .download(file.file_path);
      
    if (error) throw error;
    
    // Create download link
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Failed to download file');
  }
};

// Function to upload a file to storage
export const uploadFileToStorage = async (file: File, projectId: string, userId: string): Promise<{path: string} | null> => {
  const fileName = `${Date.now()}-${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('project-files')
    .upload(`${projectId}/${fileName}`, file);
    
  if (uploadError) {
    console.error('Error uploading file to storage:', uploadError);
    throw uploadError;
  }
  
  return uploadData;
};

// Function to create a file record in the database
export const createFileRecord = async (
  projectId: string, 
  userId: string, 
  file: File, 
  path: string
): Promise<any> => {
  const { data: fileRecord, error: dbError } = await supabase
    .from('project_files')
    .insert({
      project_id: projectId,
      user_id: userId,
      name: file.name,
      file_path: path,
      file_type: file.type,
      file_size: file.size
    })
    .select();
    
  if (dbError) {
    console.error('Error creating file record in database:', dbError);
    throw dbError;
  }
  
  return fileRecord;
};

// Function to delete a file from storage
export const deleteFileFromStorage = async (filePath: string): Promise<void> => {
  const { error: storageError } = await supabase.storage
    .from('project-files')
    .remove([filePath]);
    
  if (storageError) {
    console.error('Error deleting file from storage:', storageError);
    throw storageError;
  }
};

// Function to delete a file record from the database
export const deleteFileRecord = async (fileId: string): Promise<void> => {
  const { error: dbError } = await supabase
    .from('project_files')
    .delete()
    .eq('id', fileId);
    
  if (dbError) {
    console.error('Error deleting file record from database:', dbError);
    throw dbError;
  }
};

// Function to format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Function to enrich files with user info
export const enrichFilesWithUserInfo = (
  files: any[], 
  profilesMap: Record<string, any>
): any[] => {
  return files.map((file: any) => {
    const profile = profilesMap[file.user_id] || {};
    return {
      ...file,
      user: {
        name: profile.name || 'Unknown User'
      }
    };
  });
};

// Function to fetch user profiles for file uploaders
export const fetchUserProfiles = async (userIds: string[]): Promise<Record<string, any>> => {
  if (userIds.length === 0) return {};
  
  const { data: profiles, error: profilesError } = await supabase
    .from('profiles')
    .select('id, name')
    .in('id', userIds);
    
  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return {};
  }
  
  // Create a map of user profiles
  return (profiles || []).reduce((acc: Record<string, any>, profile: any) => {
    acc[profile.id] = profile;
    return acc;
  }, {});
};
