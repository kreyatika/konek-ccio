
import React from 'react';
import { UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EventRsvpSectionProps {
  isEventPast: boolean;
  hasRsvpd: boolean;
  handleRsvp: () => void;
  handleCancelRsvp: () => void;
  isUserLoggedIn: boolean;
}

const EventRsvpSection: React.FC<EventRsvpSectionProps> = ({ 
  isEventPast, 
  hasRsvpd, 
  handleRsvp, 
  handleCancelRsvp,
  isUserLoggedIn
}) => {
  if (isEventPast || !isUserLoggedIn) {
    return null;
  }

  return (
    <div className="bg-muted p-6 rounded-lg">
      <h3 className="text-lg font-medium mb-4">RSVP to This Event</h3>
      {hasRsvpd ? (
        <div className="space-y-3">
          <div className="flex items-center text-green-600">
            <UserCheck className="mr-2 h-5 w-5" />
            <span className="font-medium">You're attending</span>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleCancelRsvp}
          >
            Cancel RSVP
          </Button>
        </div>
      ) : (
        <Button className="w-full" onClick={handleRsvp}>
          RSVP Now
        </Button>
      )}
    </div>
  );
};

export default EventRsvpSection;
