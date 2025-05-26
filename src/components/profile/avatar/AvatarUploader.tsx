
import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Camera } from 'lucide-react';
import ImageCropper from './ImageCropper';
import { useCropImage } from '@/hooks/useCropImage';
import { useAvatarUpload } from '@/hooks/useAvatarUpload';

interface AvatarUploaderProps {
  userId: string;
  avatarUrl: string;
  userName: string;
  onAvatarUpdate: (newUrl: string) => void;
}

const AvatarUploader = ({ userId, avatarUrl, userName, onAvatarUpdate }: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cropperOpen, setCropperOpen] = useState(false);
  
  const {
    imageSrc,
    croppedAreaPixels,
    handleFileSelect,
    setCroppedAreaPixels,
    resetCrop
  } = useCropImage();

  const { uploading, uploadCroppedImage } = useAvatarUpload({
    userId,
    onAvatarUpdate
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      return;
    }

    const file = e.target.files[0];
    handleFileSelect(file);
    setCropperOpen(true);
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadCroppedImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    
    setCropperOpen(false);
    await uploadCroppedImage(imageSrc, croppedAreaPixels);
    resetCrop();
  };

  const handleCancelCrop = () => {
    setCropperOpen(false);
    resetCrop();
  };

  return (
    <>
      <div className="relative">
        <Avatar className="h-16 w-16 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleAvatarClick}>
          <AvatarImage src={avatarUrl} alt={userName || ''} />
          <AvatarFallback>{userName ? getInitials(userName) : 'U'}</AvatarFallback>
        </Avatar>
        <div 
          className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1 cursor-pointer hover:bg-primary/80 transition-colors"
          onClick={handleAvatarClick}
        >
          <Camera className="h-3 w-3" />
        </div>
        <Input 
          ref={fileInputRef}
          type="file" 
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
      </div>

      <ImageCropper
        open={cropperOpen}
        onClose={handleCancelCrop}
        imageSrc={imageSrc}
        onCropComplete={setCroppedAreaPixels}
        onCropApply={handleUploadCroppedImage}
        isUploading={uploading}
      />
    </>
  );
};

export default AvatarUploader;
