
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/auth';
import { useProjectFiles } from '@/hooks/useProjectFiles';
import FileUploadForm from './FileUploadForm';
import FileList from './FileList';

interface ProjectFilesContainerProps {
  projectId: string;
  isCommitteeMember: boolean;
}

const ProjectFilesContainer: React.FC<ProjectFilesContainerProps> = ({ projectId, isCommitteeMember }) => {
  const { user } = useAuth();
  const {
    files,
    isLoading,
    uploadFile,
    downloadFile,
    deleteFile,
    isUploading,
    isDeleting
  } = useProjectFiles(projectId);
  
  const handleDelete = (file: any) => {
    if (confirm('Are you sure you want to delete this file?')) {
      deleteFile(file);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Files & Documents</CardTitle>
      </CardHeader>
      <CardContent>
        {isCommitteeMember && (
          <>
            <FileUploadForm
              onUpload={uploadFile}
              isUploading={isUploading}
            />
            <Separator className="my-4" />
          </>
        )}
        
        <FileList
          files={files}
          isLoading={isLoading}
          currentUserId={user?.id}
          onDownload={downloadFile}
          onDelete={handleDelete}
          isDeleting={isDeleting}
        />
      </CardContent>
    </Card>
  );
};

export default ProjectFilesContainer;
