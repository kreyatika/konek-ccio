
import React from 'react';
import { isSameDay } from 'date-fns';
import type { CalendarItem } from '@/types';

interface DateCellProps {
  date: Date;
  calendarItems: CalendarItem[];
}

const CalendarDateCell = ({ date, calendarItems }: DateCellProps) => {
  const itemsOnThisDay = calendarItems.filter(item => 
    isSameDay(new Date(item.start), date)
  );

  const hasEvent = itemsOnThisDay.some(item => item.type === 'event');
  const hasMeeting = itemsOnThisDay.some(item => item.type === 'meeting');
  const hasProject = itemsOnThisDay.some(item => item.type === 'project');

  return (
    <div className="relative w-full h-full">
      <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-0.5">
        {hasEvent && <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>}
        {hasMeeting && <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>}
        {hasProject && <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>}
      </div>
    </div>
  );
};

export default CalendarDateCell;
