
import React from 'react';
import MeetingCard from './MeetingCard';
import { Meeting } from '@/types';

interface MeetingsListProps {
  meetings: Meeting[];
  isPast?: boolean;
  title: string;
}

const MeetingsList: React.FC<MeetingsListProps> = ({ meetings, isPast = false, title }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {meetings.length > 0 ? (
          meetings.map((meeting) => (
            <MeetingCard 
              key={meeting.id} 
              meeting={meeting} 
              isPast={isPast}
            />
          ))
        ) : (
          <div className="col-span-full flex justify-center py-8">
            <p className="text-muted-foreground">No {isPast ? "past" : "upcoming"} meetings found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingsList;
