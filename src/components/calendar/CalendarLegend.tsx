
import React from 'react';

const CalendarLegend = () => {
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <div className="flex items-center text-sm">
        <div className="h-3 w-3 rounded-full bg-purple-500 mr-1.5"></div>
        <span>Events</span>
      </div>
      <div className="flex items-center text-sm">
        <div className="h-3 w-3 rounded-full bg-green-500 mr-1.5"></div>
        <span>Meetings</span>
      </div>
      <div className="flex items-center text-sm">
        <div className="h-3 w-3 rounded-full bg-amber-500 mr-1.5"></div>
        <span>Projects</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
