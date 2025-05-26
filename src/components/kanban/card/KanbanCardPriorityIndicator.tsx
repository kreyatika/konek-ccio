
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, ArrowDown, ArrowUp } from 'lucide-react';

interface KanbanCardPriorityIndicatorProps {
  priority: string;
}

const KanbanCardPriorityIndicator: React.FC<KanbanCardPriorityIndicatorProps> = ({ 
  priority 
}) => {
  // Get the appropriate priority icon and color
  const getPriorityData = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          icon: <AlertTriangle className="h-3 w-3" />,
          bgColor: 'bg-red-500/10',
          textColor: 'text-red-500'
        };
      case 'medium':
        return {
          icon: <ArrowUp className="h-3 w-3" />,
          bgColor: 'bg-yellow-500/10',
          textColor: 'text-yellow-500'
        };
      case 'low':
        return {
          icon: <ArrowDown className="h-3 w-3" />,
          bgColor: 'bg-green-500/10',
          textColor: 'text-green-500'
        };
      default:
        return {
          icon: <ArrowDown className="h-3 w-3" />,
          bgColor: 'bg-blue-500/10',
          textColor: 'text-blue-500'
        };
    }
  };

  const { icon, bgColor, textColor } = getPriorityData(priority);

  return (
    <div className={cn(
      "flex items-center justify-center rounded-sm w-5 h-5",
      bgColor,
      textColor
    )}>
      {icon}
    </div>
  );
};

export default KanbanCardPriorityIndicator;
