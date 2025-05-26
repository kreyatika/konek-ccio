
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface EventDetailSkeletonProps {
  handleBack: () => void;
}

const EventDetailSkeleton: React.FC<EventDetailSkeletonProps> = ({ handleBack }) => {
  return (
    <div className="container px-4 py-6 mx-auto">
      <Button variant="ghost" onClick={handleBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Events
      </Button>

      {/* Hero Image Section */}
      <div className="relative rounded-lg overflow-hidden bg-muted mb-8">
        <Skeleton className="w-full h-[400px]" />
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-background/90 to-transparent p-6">
          <Skeleton className="h-10 w-1/3" />
        </div>
      </div>

      {/* Event Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Event Details */}
        <div className="md:col-span-2 space-y-6">
          <div className="space-y-4">
            <Skeleton className="h-7 w-1/4 mb-3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          
          <Skeleton className="h-1 w-full" /> {/* Separator */}
          
          {/* Event metadata with icons */}
          <div className="space-y-4">
            {/* Date & Time */}
            <div className="flex items-start">
              <Skeleton className="h-5 w-5 mr-3" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            
            {/* Location */}
            <div className="flex items-start">
              <Skeleton className="h-5 w-5 mr-3" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            
            {/* Committee */}
            <div className="flex items-start">
              <Skeleton className="h-5 w-5 mr-3" />
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Column - RSVP & Attendees */}
        <div className="space-y-6">
          {/* RSVP Section */}
          <Card className="p-6">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-10 w-full" />
          </Card>
          
          {/* Attendees Section */}
          <Card className="p-6">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center">
                  <Skeleton className="h-8 w-8 rounded-full mr-3" />
                  <Skeleton className="h-4 w-32" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSkeleton;
