
import React from 'react';
import FileItem from './FileItem';
import type { ProjectFile } from '@/hooks/useProjectFiles';

interface FileListProps {
  files: ProjectFile[];
  isLoading: boolean;
  currentUserId?: string;
  onDownload: (file: ProjectFile) => void;
  onDelete: (file: ProjectFile) => void;
  isDeleting: boolean;
}

const FileList: React.FC<FileListProps> = ({
  files,
  isLoading,
  currentUserId,
  onDownload,
  onDelete,
  isDeleting
}) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-muted rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No files uploaded yet
      </div>
    );
  }

  return (
    <div className="space-y-2 overflow-hidden">
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          currentUserId={currentUserId}
          onDownload={onDownload}
          onDelete={onDelete}
          isDeleting={isDeleting}
        />
      ))}
    </div>
  );
};

export default FileList;
