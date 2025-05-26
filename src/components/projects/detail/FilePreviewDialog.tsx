
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import type { ProjectFile } from '@/hooks/useProjectFiles';
import { downloadFile } from '@/lib/files/fileUtils';

interface FilePreviewDialogProps {
  file: ProjectFile;
  isOpen: boolean;
  onClose: () => void;
}

const FilePreviewDialog: React.FC<FilePreviewDialogProps> = ({ file, isOpen, onClose }) => {
  const isImage = file.file_type && file.file_type.startsWith('image/');
  const isPdf = file.file_type === 'application/pdf';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold truncate flex-1">{file.name}</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadFile(file)}
              title="Download file"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto min-h-0 bg-gray-50 dark:bg-gray-900 rounded-md p-2">
          {isImage && file.url && (
            <div className="flex items-center justify-center h-full">
              <img 
                src={file.url} 
                alt={file.name} 
                className="max-w-full max-h-full object-contain"
              />
            </div>
          )}
          
          {isPdf && file.url && (
            <iframe 
              src={`${file.url}#toolbar=0`} 
              className="w-full h-full min-h-[60vh]" 
              title={file.name}
            />
          )}
          
          {(!isImage && !isPdf) && (
            <div className="flex items-center justify-center h-full p-8 text-center">
              <p className="text-muted-foreground">
                Preview not available for this file type.<br />
                Please download the file to view its contents.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FilePreviewDialog;
