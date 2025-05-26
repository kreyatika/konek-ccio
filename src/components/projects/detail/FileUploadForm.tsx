
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface FileUploadFormProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onUpload, isUploading }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    onUpload(selectedFile);
    setSelectedFile(null);
    // Reset the input
    const fileInput = document.getElementById('file-upload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="flex items-center gap-2 mb-4">
      <Input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        className="flex-1"
      />
      <Button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
      >
        <Upload className="h-4 w-4 mr-2" />
        Upload
      </Button>
    </div>
  );
};

export default FileUploadForm;
