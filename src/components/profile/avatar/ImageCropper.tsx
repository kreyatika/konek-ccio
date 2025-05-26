
import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';

interface ImageCropperProps {
  open: boolean;
  onClose: () => void;
  imageSrc: string | null;
  onCropComplete: (croppedAreaPixels: CropArea) => void;
  onCropApply: () => void;
  isUploading: boolean;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const ImageCropper = ({ 
  open, 
  onClose, 
  imageSrc, 
  onCropComplete, 
  onCropApply,
  isUploading 
}: ImageCropperProps) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleCropComplete = (_croppedArea: any, croppedAreaPixels: CropArea) => {
    onCropComplete(croppedAreaPixels);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crop Profile Picture</DialogTitle>
          <DialogDescription>
            Adjust your photo to fit perfectly as your profile picture
          </DialogDescription>
        </DialogHeader>
        {imageSrc && (
          <div className="flex flex-col gap-4">
            <div className="relative h-64">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                cropShape="round"
              />
            </div>
            <div className="flex justify-between px-2">
              <span className="text-sm">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                variant="blue" 
                onClick={onCropApply} 
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Apply & Upload'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;
