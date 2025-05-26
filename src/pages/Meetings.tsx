import React, { useState } from 'react';
import PageTransition from '@/components/ui/page-transition';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMeetings } from '@/hooks/useMeetings';
import MeetingsList from '@/components/meetings/MeetingsList';
import MeetingsHeader from '@/components/meetings/MeetingsHeader';
import { Meeting } from '@/types';

const Meetings = () => {
  const { upcomingMeetings, pastMeetings, isLoading, error, addMeeting } = useMeetings();
  const [filter, setFilter] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const filteredUpcomingMeetings = filter 
    ? upcomingMeetings.filter(meeting => meeting.committee === filter)
    : upcomingMeetings;
  
  const filteredPastMeetings = filter 
    ? pastMeetings.filter(meeting => meeting.committee === filter)
    : pastMeetings;

  const handleAddMeeting = (newMeeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => {
    addMeeting(newMeeting);
    setShowCreateDialog(false);
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="container px-4 py-6 mx-auto flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading meetings...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (error) {
    return (
      <PageTransition>
        <div className="container px-4 py-6 mx-auto">
          <div className="bg-destructive/10 p-6 rounded-lg">
            <h2 className="text-lg font-medium text-destructive mb-2">Error loading meetings</h2>
            <p className="text-muted-foreground">
              {error instanceof Error ? error.message : 'Unknown error occurred'}
            </p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col space-y-6">
          <MeetingsHeader 
            filter={filter}
            setFilter={setFilter}
            showCreateDialog={showCreateDialog}
            setShowCreateDialog={setShowCreateDialog}
            onAddMeeting={handleAddMeeting}
          />
          
          <div className="space-y-6">
            <MeetingsList 
              meetings={filteredUpcomingMeetings} 
              title="Upcoming Meetings" 
              isPast={false}
            />
            
            <MeetingsList 
              meetings={filteredPastMeetings} 
              title="Past Meetings" 
              isPast={true}
            />
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Meetings;
