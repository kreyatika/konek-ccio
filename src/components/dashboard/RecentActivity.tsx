
import { Activity } from '@/types';
import React from 'react';
import { Calendar, CheckSquare, MessageSquare, FileText, PlusSquare } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  activities: Activity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  // Function to format date relative to now (e.g., "2 days ago")
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
    }
    
    // For older activities, just return the date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  // Get icon based on activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'task':
        return <CheckSquare className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'meeting':
      case 'event':
        return <Calendar className="h-4 w-4" />;
      case 'project':
        return <FileText className="h-4 w-4" />;
      default:
        return <PlusSquare className="h-4 w-4" />;
    }
  };
  
  // Get color based on activity type
  const getActivityColor = (type: string) => {
    switch (type) {
      case 'task':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400';
      case 'comment':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400';
      case 'meeting':
        return 'bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400';
      case 'event':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400';
      case 'project':
        return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      {activities.map((activity) => (
        <div key={activity.id} className="flex gap-4">
          <div className={cn(
            'flex h-9 w-9 items-center justify-center rounded-full',
            getActivityColor(activity.type)
          )}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">{formatRelativeTime(activity.createdAt)}</p>
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <div className="flex items-center pt-1">
              <Avatar className="h-6 w-6">
                <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                <AvatarFallback>{getInitials(activity.user.name)}</AvatarFallback>
              </Avatar>
              <span className="ml-2 text-xs text-muted-foreground">{activity.user.name}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivity;
