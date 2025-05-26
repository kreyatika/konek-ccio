
import React, { useState, useEffect } from 'react';
import { useCalendarData } from '@/hooks/useCalendarData';
import { useAuth } from '@/contexts/auth';
import CalendarView from '@/components/calendar/CalendarView';
import CalendarSidebar from '@/components/calendar/CalendarSidebar';
import { useCalendarStore } from '@/hooks/useCalendarStore';

const CalendarPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("all");
  const { user } = useAuth();
  const { setMonth, setYear } = useCalendarStore();
  
  // Use our custom hook to fetch and organize calendar data
  const { calendarItems, selectedDateItems, isLoading } = useCalendarData(date, activeTab);

  // Sync the zustand store with the current date
  useEffect(() => {
    setMonth(date.getMonth() as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11);
    setYear(date.getFullYear());
  }, [date, setMonth, setYear]);

  return (
    <div className="container py-6 space-y-6">
      <h1 className="text-3xl font-bold">Calendar</h1>

      <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-8">
        <CalendarView 
          date={date}
          setDate={setDate}
          calendarItems={calendarItems}
        />
        
        <CalendarSidebar
          date={date}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDateItems={selectedDateItems}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default CalendarPage;
