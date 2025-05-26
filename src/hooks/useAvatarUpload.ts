
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { CropArea } from '@/components/profile/avatar/ImageCropper';

interface UseAvatarUploadParams {
  userId: string;
  onAvatarUpdate: (newUrl: string) => void;
}

interface UseAvatarUploadReturn {
  uploading: boolean;
  uploadCroppedImage: (imageSrc: string, croppedAreaPixels: CropArea) => Promise<void>;
}

export const useAvatarUpload = ({ userId, onAvatarUpdate }: UseAvatarUploadParams): UseAvatarUploadReturn => {
  const [uploading, setUploading] = useState(false);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (blob) resolve(blob);
        else throw new Error('Canvas is empty');
      }, 'image/jpeg');
    });
  };

  const uploadCroppedImage = async (imageSrc: string, croppedAreaPixels: CropArea): Promise<void> => {
    if (!imageSrc || !croppedAreaPixels || !userId) return;
    
    try {
      setUploading(true);
      
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const fileName = `avatar-${Date.now()}.jpg`;
      const croppedImageFile = new File([croppedImageBlob], fileName, { type: 'image/jpeg' });
      const filePath = `${userId}/${Date.now()}.jpg`;
      
      // Upload new image
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('avatars')
        .upload(filePath, croppedImageFile);

      if (uploadError) throw uploadError;

      console.log('Upload successful:', uploadData);

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      console.log('Got public URL:', urlData.publicUrl);

      // Update the profile record with the new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar: urlData.publicUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      // Call the callback with the new URL
      onAvatarUpdate(urlData.publicUrl);
      toast.success('Avatar updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload avatar');
      console.error('Error uploading avatar:', error);
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadCroppedImage
  };
};
