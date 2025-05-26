
import { cn } from '@/lib/utils';
import React from 'react';

interface StatusBadgeProps {
  status: 'todo' | 'in-progress' | 'review' | 'done' | 'planned' | 'completed';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const statusConfig = {
    todo: {
      label: 'To Do',
      className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    'in-progress': {
      label: 'In Progress',
      className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300',
    },
    review: {
      label: 'Review',
      className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300',
    },
    done: {
      label: 'Done',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    },
    planned: {
      label: 'Planned',
      className: 'bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300',
    },
    completed: {
      label: 'Completed',
      className: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300',
    },
  };

  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;
