
import React from 'react';
import { format } from 'date-fns';
import { CalendarClock, MapPin, Users, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EventMetadataProps {
  startDate: Date;
  endDate: Date;
  location: string;
  committee?: string;
  rsvpDeadline?: Date;
  iconSize?: number;
  className?: string;
  showLabels?: boolean;
  variant?: 'default' | 'compact';
}

const EventMetadata: React.FC<EventMetadataProps> = ({
  startDate,
  endDate,
  location,
  committee,
  rsvpDeadline,
  iconSize = 5,
  className,
  showLabels = true,
  variant = 'default'
}) => {
  const isCompact = variant === 'compact';
  
  return (
    <div className={cn("space-y-4", isCompact && "space-y-3", className)}>
      {/* Date */}
      <div className="flex items-center">
        <CalendarClock className={`mr-3 h-${iconSize} w-${iconSize}`} />
        <div>
          {showLabels && <p className="font-medium">Date & Time</p>}
          <p className={cn("text-muted-foreground", isCompact && "text-sm")}>
            {format(startDate, 'EEEE, MMMM d, yyyy')}
          </p>
          <p className={cn("text-muted-foreground", isCompact && "text-sm")}>
            {format(startDate, 'h:mm a')} - {format(endDate, 'h:mm a')}
          </p>
        </div>
      </div>
      
      {/* Location */}
      <div className="flex items-center">
        <MapPin className={`mr-3 h-${iconSize} w-${iconSize}`} />
        <div>
          {showLabels && <p className="font-medium">Location</p>}
          <p className={cn("text-muted-foreground", isCompact && "text-sm")}>{location}</p>
        </div>
      </div>
      
      {/* Committee (if provided) */}
      {committee && (
        <div className="flex items-center">
          <Users className={`mr-3 h-${iconSize} w-${iconSize}`} />
          <div>
            {showLabels && <p className="font-medium">Committee</p>}
            <p className={cn("text-muted-foreground", isCompact && "text-sm")}>
              {committee} Committee
            </p>
          </div>
        </div>
      )}
      
      {/* RSVP Deadline (if provided) */}
      {rsvpDeadline && (
        <div className="flex items-center">
          <Calendar className={`mr-3 h-${iconSize} w-${iconSize}`} />
          <div>
            {showLabels && <p className="font-medium">RSVP Deadline</p>}
            <p className={cn("text-muted-foreground", isCompact && "text-sm")}>
              {format(rsvpDeadline, 'MMMM d, yyyy')}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventMetadata;
