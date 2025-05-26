
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { isAfter } from 'date-fns';
import { useAuth } from '@/contexts/auth';
import { fetchEventById } from '@/hooks/events/eventQueries';
import PageTransition from '@/components/ui/page-transition';
import { useEvents } from '@/hooks/useEvents';

// Import refactored components
import EventDetailSkeleton from '@/components/events/detail/EventDetailSkeleton';
import EventDetailError from '@/components/events/detail/EventDetailError';
import EventImageSection from '@/components/events/detail/EventImageSection';
import EventDetailsInfo from '@/components/events/detail/EventDetailsInfo';
import EventRsvpSection from '@/components/events/detail/EventRsvpSection';
import EventAttendeesList from '@/components/events/detail/EventAttendeesList';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { rsvpToEvent, cancelRsvp, hasUserRsvpd } = useEvents();
  
  const { data: event, isLoading, error } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEventById(id as string),
    enabled: !!id
  });

  const handleBack = () => {
    navigate('/events');
  };

  const handleRsvp = () => {
    if (id) {
      rsvpToEvent(id);
    }
  };

  const handleCancelRsvp = () => {
    if (id) {
      cancelRsvp(id);
    }
  };

  // Display states
  if (isLoading) {
    return (
      <PageTransition>
        <EventDetailSkeleton handleBack={handleBack} />
      </PageTransition>
    );
  }

  if (error || !event) {
    return (
      <PageTransition>
        <EventDetailError handleBack={handleBack} />
      </PageTransition>
    );
  }

  const isEventPast = event ? isAfter(new Date(), new Date(event.endDate)) : false;
  const hasRsvpd = id ? hasUserRsvpd(id) : false;

  return (
    <PageTransition>
      <div className="container px-4 py-6 mx-auto">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>
        
        <div className="space-y-8">
          {/* Hero Section with Image */}
          <EventImageSection 
            imageUrl={event.imageUrl} 
            title={event.title} 
            isPast={isEventPast} 
          />
          
          {/* Event Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Details */}
            <div className="md:col-span-2">
              <EventDetailsInfo event={event} />
            </div>
            
            {/* Right Column - RSVP & Attendees */}
            <div className="space-y-6">
              <EventRsvpSection 
                isEventPast={isEventPast}
                hasRsvpd={hasRsvpd}
                handleRsvp={handleRsvp}
                handleCancelRsvp={handleCancelRsvp}
                isUserLoggedIn={!!user}
              />
              
              <EventAttendeesList attendees={event.attendees} />
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default EventDetail;
