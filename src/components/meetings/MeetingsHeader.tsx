
import React from 'react';
import FilterDropdown from './header/FilterDropdown';
import NewMeetingDialog from './header/NewMeetingDialog';
import { Meeting } from '@/types';

interface MeetingsHeaderProps {
  filter: string | null;
  setFilter: (filter: string | null) => void;
  showCreateDialog: boolean;
  setShowCreateDialog: (show: boolean) => void;
  onAddMeeting: (meeting: Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const MeetingsHeader: React.FC<MeetingsHeaderProps> = ({ 
  filter, 
  setFilter, 
  showCreateDialog, 
  setShowCreateDialog, 
  onAddMeeting 
}) => {
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
        <p className="text-muted-foreground">
          View and manage all chamber meetings.
        </p>
      </div>
      <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
        <FilterDropdown 
          filter={filter} 
          setFilter={setFilter} 
        />
        
        <NewMeetingDialog 
          showCreateDialog={showCreateDialog}
          setShowCreateDialog={setShowCreateDialog}
          onAddMeeting={onAddMeeting}
        />
      </div>
    </div>
  );
};

export default MeetingsHeader;
