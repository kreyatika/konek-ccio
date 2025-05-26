
import React from 'react';
import { Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EventImageSectionProps {
  imageUrl?: string | null;
  title: string;
  isPast: boolean;
}

const EventImageSection: React.FC<EventImageSectionProps> = ({ imageUrl, title, isPast }) => {
  return (
    <div className="space-y-4">
      {/* Image Container */}
      <div className="rounded-lg overflow-hidden bg-muted">
        {imageUrl ? (
          <div className="w-full max-h-[500px] flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={title}
              className="object-contain max-h-[500px] w-auto max-w-full"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center w-full h-[300px] md:h-[400px] bg-muted">
            <Calendar className="h-24 w-24 text-muted-foreground opacity-20" />
          </div>
        )}
      </div>
      
      {/* Title and status below the image */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">{title}</h1>
        {isPast ? (
          <Badge variant="secondary">Past Event</Badge>
        ) : (
          <Badge variant="default">Upcoming</Badge>
        )}
      </div>
    </div>
  );
};

export default EventImageSection;
