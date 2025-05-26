
import React from 'react';
import { TooltipProps } from 'recharts';
import { Button } from '@/components/ui/button';
import { formatMeetingDate } from '@/utils/dateFormatters';
import { ChartData } from './ganttUtils';

interface CustomTooltipProps extends TooltipProps<number, string> {
  onProjectClick: (data: ChartData) => void;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ 
  active, 
  payload, 
  onProjectClick 
}) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload as ChartData;
  
  // Only proceed if data has valid dates
  const startDateStr = data.startDate ? formatMeetingDate(data.startDate) : '';
  const endDateStr = data.endDate ? formatMeetingDate(data.endDate) : '';
  const dateRange = startDateStr && endDateStr ? `${startDateStr} - ${endDateStr}` : '';
  
  return (
    <div className="rounded-lg border bg-background p-3 shadow-md">
      <p className="font-medium text-sm">{data.name}</p>
      {dateRange && (
        <p className="text-xs text-muted-foreground mt-1">
          {dateRange}
        </p>
      )}
      {data.duration !== undefined && (
        <p className="text-xs text-muted-foreground mt-1">
          Duration: {data.duration} days
        </p>
      )}
      <div className="mt-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="h-6 text-xs"
          onClick={() => onProjectClick(data)}
        >
          View Project
        </Button>
      </div>
    </div>
  );
};

export default CustomTooltip;
