
import React from 'react';
import { Calendar, Flag, MessageSquare, Paperclip } from 'lucide-react';
import { format, isPast, isToday, isTomorrow } from 'date-fns';

interface KanbanCardFooterProps {
  dueDate?: Date;
  comments?: { id: string }[];
  attachments?: Array<{ id: string }>;
}

const KanbanCardFooter: React.FC<KanbanCardFooterProps> = ({
  dueDate,
  comments,
  attachments
}) => {
  const formatDueDate = (date: Date | undefined) => {
    if (!date) return null;
    
    // Ensure date is a valid Date object
    const dateObj = date instanceof Date && !isNaN(date.getTime()) ? date : null;
    if (!dateObj) return null;
    
    // Format the date
    const formattedDate = format(dateObj, 'MMM d');
    
    // Check if the date is in the past, today, or tomorrow
    const isPastDue = isPast(dateObj) && !isToday(dateObj);
    const isTodays = isToday(dateObj);
    const isTomorrows = isTomorrow(dateObj);
    
    // Determine text and style based on date status
    let dateText = formattedDate;
    let textColorClass = 'text-muted-foreground';
    
    if (isPastDue) {
      dateText = `${formattedDate}`;
      textColorClass = 'text-destructive font-medium';
    } else if (isTodays) {
      dateText = 'Today';
      textColorClass = 'text-amber-500 font-medium';
    } else if (isTomorrows) {
      dateText = 'Tomorrow';
      textColorClass = 'text-amber-400 font-medium';
    }
    
    return (
      <div className={`flex items-center ${textColorClass}`}>
        {isPastDue ? (
          <Flag className="mr-0.5 h-2.5 w-2.5" />
        ) : (
          <Calendar className="mr-0.5 h-2.5 w-2.5" />
        )}
        {dateText}
      </div>
    );
  };

  return (
    <div className="flex items-center justify-between text-[9px]">
      <div className="flex items-center space-x-2">
        {comments?.length ? (
          <div className="flex items-center text-muted-foreground">
            <MessageSquare className="mr-0.5 h-2.5 w-2.5" />
            {comments.length}
          </div>
        ) : null}
        
        {attachments?.length ? (
          <div className="flex items-center text-muted-foreground">
            <Paperclip className="mr-0.5 h-2.5 w-2.5" />
            {attachments.length}
          </div>
        ) : null}
      </div>
      
      {dueDate && formatDueDate(dueDate)}
    </div>
  );
};

export default KanbanCardFooter;
