
import { cn } from '@/lib/utils';
import React from 'react';
import { ArrowDown, ArrowUp, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number | string;
  change?: number;
  changeType?: 'increase' | 'decrease' | 'neutral';
  changeText?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  changeText,
  icon,
  className,
}) => {
  const renderChangeIndicator = () => {
    if (change === undefined) return null;
    
    const changeClass = 
      changeType === 'increase' 
        ? 'text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400' 
        : changeType === 'decrease' 
          ? 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400'
          : 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    
    const iconMap = {
      increase: <ArrowUp className="h-3 w-3" />,
      decrease: <ArrowDown className="h-3 w-3" />,
      neutral: <Minus className="h-3 w-3" />,
    };
    
    const changeTextContent = changeText || (changeType === 'increase' ? 'from last period' : changeType === 'decrease' ? 'from last period' : 'no change');
    
    return (
      <div className="mt-1 flex items-center text-xs font-medium">
        <div className={cn("flex items-center rounded-full px-1.5 py-0.5", changeClass)}>
          {iconMap[changeType]}
          <span className="ml-1">{change}%</span>
        </div>
        <span className="ml-1.5 text-muted-foreground">{changeTextContent}</span>
      </div>
    );
  };

  return (
    <div className={cn('rounded-lg bg-card p-4 shadow-sm', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div className="mt-2">
        <div className="text-2xl font-bold">{value}</div>
        {renderChangeIndicator()}
      </div>
    </div>
  );
};

export default StatCard;
