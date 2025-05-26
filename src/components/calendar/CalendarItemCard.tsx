
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin } from 'lucide-react';
import type { CalendarItem } from '@/types';

interface ItemCardProps {
  item: CalendarItem;
}

const CalendarItemCard = ({ item }: ItemCardProps) => {
  return (
    <Card 
      key={item.id} 
      className="mb-3 hover:shadow-md transition-shadow overflow-hidden"
    >
      <div 
        className="w-1 h-full absolute left-0 top-0 bottom-0" 
        style={{ backgroundColor: item.color }}
      ></div>
      <CardContent className="p-3 pl-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-medium truncate">{item.title}</h3>
          <Badge variant="outline" className="capitalize">{item.type}</Badge>
        </div>
        
        {!item.allDay && (
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{format(new Date(item.start), 'h:mm a')} - {format(new Date(item.end), 'h:mm a')}</span>
          </div>
        )}
        
        {item.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span className="truncate">{item.location}</span>
          </div>
        )}
        
        {item.committee && (
          <p className="text-xs text-muted-foreground mt-1">
            {item.committee}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default CalendarItemCard;
