
import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';

interface DashboardCardProps {
  title: string;
  children: ReactNode;
  className?: string;
  titleAction?: ReactNode;
  footer?: ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  className,
  titleAction,
  footer,
}) => {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      <div className="flex flex-row items-center justify-between p-6 pb-2">
        <h3 className="text-lg font-medium">{title}</h3>
        {titleAction}
      </div>
      <div className="p-6 pt-0">{children}</div>
      {footer && <div className="p-6 pt-0 border-t">{footer}</div>}
    </div>
  );
};

export default DashboardCard;
