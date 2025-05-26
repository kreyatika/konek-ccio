
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import CalendarItemCard from './CalendarItemCard';
import type { CalendarItem } from '@/types';

interface SidebarProps {
  date: Date;
  activeTab: string;
  setActiveTab: (value: string) => void;
  selectedDateItems: CalendarItem[];
  isLoading: boolean;
}

const CalendarSidebar = ({ date, activeTab, setActiveTab, selectedDateItems, isLoading }: SidebarProps) => {
  return (
    <div className="bg-card rounded-lg shadow p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">
          {format(date, 'MMMM d, yyyy')}
        </h2>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="grid grid-cols-4 h-8">
            <TabsTrigger value="all" className="text-xs px-2">All</TabsTrigger>
            <TabsTrigger value="event" className="text-xs px-2">Events</TabsTrigger>
            <TabsTrigger value="meeting" className="text-xs px-2">Meetings</TabsTrigger>
            <TabsTrigger value="project" className="text-xs px-2">Projects</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <Separator />
      
      <div className="space-y-1 max-h-[500px] overflow-y-auto pr-2">
        {isLoading ? (
          <div className="flex items-center justify-center h-20">
            <p className="text-muted-foreground">Loading calendar items...</p>
          </div>
        ) : selectedDateItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-20 text-center">
            <CalendarIcon className="h-8 w-8 text-muted-foreground/50 mb-2" />
            <p className="text-muted-foreground">No {activeTab === 'all' ? 'items' : activeTab + 's'} scheduled for this day</p>
          </div>
        ) : (
          selectedDateItems.map((item) => (
            <CalendarItemCard key={item.id} item={item} />
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarSidebar;
