import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ImageIcon, Users, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { differenceInDays } from 'date-fns';
import { Event } from '@/types';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import EventMetadata from './EventMetadata';

interface EventCardProps {
  event: Event;
  isPast?: boolean;
  hasRsvpd?: boolean;
  onRsvp?: (eventId: string) => void;
  onCancelRsvp?: (eventId: string) => void;
  onEdit?: (eventId: string) => void;
  onDelete?: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  isPast = false,
  hasRsvpd = false,
  onRsvp,
  onCancelRsvp,
  onEdit,
  onDelete
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Function to determine badge status
  const getEventStatusBadge = () => {
    if (isPast) {
      return <Badge variant="secondary">Past</Badge>;
    }
    
    const daysUntilEvent = differenceInDays(event.startDate, new Date());
    
    if (daysUntilEvent <= 0) {
      return <Badge variant="secondary">Today</Badge>;
    } else if (daysUntilEvent <= 7) {
      return <Badge>Coming Soon</Badge>;
    } else if (event.rsvpDeadline && differenceInDays(event.rsvpDeadline, new Date()) <= 3) {
      return <Badge variant="destructive">RSVP Closing Soon</Badge>;
    } else {
      return <Badge variant="outline">Upcoming</Badge>;
    }
  };

  const handleRsvp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to detail page when clicking RSVP
    if (onRsvp) {
      onRsvp(event.id);
    }
  };

  const handleCancelRsvp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent navigating to detail page when clicking Cancel
    if (onCancelRsvp) {
      onCancelRsvp(event.id);
    }
  };

  const handleCardClick = () => {
    navigate(`/events/${event.id}`);
  };

  return (
    <Card 
      className={cn(
        "overflow-hidden flex flex-col cursor-pointer transition-all hover:shadow-md", 
        isPast && "opacity-75"
      )}
      onClick={handleCardClick}
    >
      {/* Event Image */}
      <div className="aspect-video w-full overflow-hidden relative group">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/50 hover:bg-black/70 backdrop-blur-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  if (onEdit) onEdit(event.id);
                }}
              >
                Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onDelete) onDelete(event.id);
                }}
              >
                Delete Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>{event.title}</CardTitle>
            {getEventStatusBadge()}
          </div>
        </div>
        <CardDescription>{event.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <EventMetadata
          startDate={event.startDate}
          endDate={event.endDate}
          location={event.location}
          committee={event.committee}
          rsvpDeadline={event.rsvpDeadline}
          iconSize={4}
          showLabels={false}
          variant="compact"
          className="space-y-3"
        />
      </CardContent>
      
      <CardFooter className="flex flex-col items-start gap-4 border-t bg-muted/50 px-6 py-4 mt-auto">
        <div className="flex w-full items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {event.committee ? `${event.committee} Committee` : 'Chamber-wide Event'}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span className="text-xs text-muted-foreground">
              {event.attendees.length} {event.attendees.length === 1 ? 'attendee' : 'attendees'}
            </span>
          </div>
        </div>
        
        {!isPast && isAuthenticated && (
          hasRsvpd ? (
            <Button 
              className="w-full flex items-center justify-center" 
              variant="outline"
              onClick={handleCancelRsvp}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel RSVP
            </Button>
          ) : (
            <Button 
              className="w-full flex items-center justify-center" 
              onClick={handleRsvp}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              RSVP Now
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  );
};

export default EventCard;
