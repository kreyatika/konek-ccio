
import { useState } from 'react';
import { CropArea } from '@/components/profile/avatar/ImageCropper';

interface UseCropImageReturn {
  imageSrc: string | null;
  croppedAreaPixels: CropArea | null;
  setImageSrc: (src: string | null) => void;
  setCroppedAreaPixels: (pixels: CropArea) => void;
  handleFileSelect: (file: File) => void;
  resetCrop: () => void;
}

export const useCropImage = (): UseCropImageReturn => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const resetCrop = () => {
    setImageSrc(null);
    setCroppedAreaPixels(null);
  };

  return {
    imageSrc,
    croppedAreaPixels,
    setImageSrc,
    setCroppedAreaPixels,
    handleFileSelect,
    resetCrop,
  };
};
