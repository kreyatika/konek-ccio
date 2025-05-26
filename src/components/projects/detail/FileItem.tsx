
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { File, Download, Trash2, FileImage, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/hooks/useProjectFiles';
import type { ProjectFile } from '@/hooks/useProjectFiles';
import { Skeleton } from '@/components/ui/skeleton';
import FilePreviewDialog from './FilePreviewDialog';

interface FileItemProps {
  file: ProjectFile;
  currentUserId?: string;
  onDownload: (file: ProjectFile) => void;
  onDelete: (file: ProjectFile) => void;
  isDeleting: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  file,
  currentUserId,
  onDownload,
  onDelete,
  isDeleting
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [showPreview, setShowPreview] = useState<boolean>(false);
  
  // Check if the file is an image type
  const isImage = file.file_type && file.file_type.startsWith('image/');
  const isPdf = file.file_type === 'application/pdf';
  const isPreviewable = isImage || isPdf;
  
  useEffect(() => {
    // Load image preview if it's an image file
    if (isImage && file.url) {
      setIsImageLoading(true);
      setImageError(false);
      
      const imgElement = new window.Image();
      imgElement.onload = () => {
        setImageUrl(file.url || null);
        setIsImageLoading(false);
      };
      imgElement.onerror = () => {
        setImageError(true);
        setIsImageLoading(false);
      };
      imgElement.src = file.url;
    }
  }, [isImage, file.url]);

  const renderFileIcon = () => {
    if (isImage) {
      if (isImageLoading) {
        return <Skeleton className="h-12 w-12 rounded" />;
      } else if (imageError || !imageUrl) {
        return <FileImage className="h-6 w-6 text-muted-foreground" />;
      } else {
        return (
          <div className="h-12 w-12 rounded overflow-hidden flex-shrink-0 border">
            <img 
              src={imageUrl} 
              alt={file.name} 
              className="h-full w-full object-cover transition-all hover:scale-110"
            />
          </div>
        );
      }
    } else {
      return <File className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const handleFileClick = () => {
    if (isPreviewable) {
      setShowPreview(true);
    }
  };

  return (
    <>
      <div 
        className={`flex items-center p-3 rounded-lg border hover:bg-muted/50 transition-colors ${isPreviewable ? 'cursor-pointer' : ''}`}
        onClick={isPreviewable ? handleFileClick : undefined}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="flex-shrink-0">
            {renderFileIcon()}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span className="truncate">{formatFileSize(file.file_size)}</span>
              <span className="mx-1 flex-shrink-0">•</span>
              <span className="truncate">Uploaded by {file.user.name}</span>
              <span className="mx-1 flex-shrink-0">•</span>
              <span className="truncate">{format(new Date(file.created_at), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-1 ml-2" onClick={(e) => e.stopPropagation()}>
          {isPreviewable && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFileClick}
              title="Preview file"
              className="h-8 w-8"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDownload(file)}
            title="Download file"
            className="h-8 w-8"
          >
            <Download className="h-4 w-4" />
          </Button>
          {currentUserId && currentUserId === file.user_id && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(file)}
              disabled={isDeleting}
              title="Delete file"
              className="h-8 w-8"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>
      
      <FilePreviewDialog 
        file={file}
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
    </>
  );
};

export default FileItem;
