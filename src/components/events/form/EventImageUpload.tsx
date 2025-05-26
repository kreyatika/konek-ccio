
import React, { useState } from 'react';
import { FormItem, FormLabel } from "@/components/ui/form";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, Upload } from 'lucide-react';

interface EventImageUploadProps {
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageRemove: () => void;
}

const EventImageUpload: React.FC<EventImageUploadProps> = ({
  imagePreview,
  onImageChange,
  onImageRemove,
}) => {
  return (
    <FormItem>
      <FormLabel>Event Image (Optional)</FormLabel>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => document.getElementById('event-image')?.click()}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          <Input
            id="event-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
          />
        </div>
        
        {imagePreview && (
          <div className="relative mt-2">
            <div className="relative aspect-video overflow-hidden rounded-md border border-border">
              <img 
                src={imagePreview} 
                alt="Event preview" 
                className="object-cover w-full h-full"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 bg-background/80 hover:bg-background"
              onClick={onImageRemove}
            >
              Remove
            </Button>
          </div>
        )}
        
        {!imagePreview && (
          <div className="border border-dashed border-border rounded-md p-8 text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">
              Add an image to make your event stand out
            </p>
          </div>
        )}
      </div>
    </FormItem>
  );
};

export default EventImageUpload;
