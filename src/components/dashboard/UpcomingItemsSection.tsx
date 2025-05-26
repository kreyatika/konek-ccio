
import React from 'react';
import DashboardCard from '@/components/dashboard/DashboardCard';
import { Button } from '@/components/ui/button';

interface CalendarItem {
  id: string;
  title: string;
  start: Date;
  end: Date;
  committee?: string;
  color?: string;
  type: string;
}

interface UpcomingItemsSectionProps {
  upcomingItems: CalendarItem[];
}

const UpcomingItemsSection: React.FC<UpcomingItemsSectionProps> = ({ upcomingItems }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };
  
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <DashboardCard
      title="Upcoming"
      className="md:col-span-2"
      titleAction={
        <Button variant="ghost" size="sm" asChild>
          <a href="/calendar">Calendar</a>
        </Button>
      }
    >
      <div className="space-y-4">
        {upcomingItems.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className="rounded bg-primary/10 px-2 py-1 text-xs font-semibold text-primary">
                {formatDate(item.start).split(',')[0]}
              </div>
              <div className="mt-1 text-sm">
                {new Date(item.start).getDate()}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatTime(item.start)} - {formatTime(item.end)}
                  </div>
                </div>
                <div>
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {item.committee}
                {item.type === 'meeting' && ' • Meeting'}
                {item.type === 'event' && ' • Event'}
                {item.type === 'task' && ' • Task'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
};

export default UpcomingItemsSection;
