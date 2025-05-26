
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/contexts/AuthContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

function Dot({ className }: { className?: string }) {
  return (
    <svg
      width="6"
      height="6"
      fill="currentColor"
      viewBox="0 0 6 6"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <circle cx="3" cy="3" r="3" />
    </svg>
  );
}

const DashboardHeader: React.FC = () => {
  const navigate = useNavigate();
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const { userProfile } = useAuth();

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back {userProfile?.name || 'User'}. Here's what's happening.
        </p>
      </div>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button size="icon" variant="outline" className="relative" aria-label="Open notifications">
              <Bell size={16} strokeWidth={2} aria-hidden="true" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-2 left-full min-w-5 -translate-x-1/2 px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-1">
            <div className="flex items-baseline justify-between gap-4 px-3 py-2">
              <div className="text-sm font-semibold">Notifications</div>
              {unreadCount > 0 && (
                <button 
                  className="text-xs font-medium hover:underline" 
                  onClick={() => markAllAsRead()}
                >
                  Mark all as read
                </button>
              )}
            </div>
            <div
              role="separator"
              aria-orientation="horizontal"
              className="-mx-1 my-1 h-px bg-border"
            ></div>
            {notifications.length > 0 ? (
              notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className="rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <div className="relative flex items-start gap-3 pe-3">
                    <div className="flex-shrink-0">
                      {notification.type === 'info' && <Bell className="h-5 w-5 text-blue-500" />}
                      {notification.type === 'warning' && <Bell className="h-5 w-5 text-amber-500" />}
                      {notification.type === 'success' && <Bell className="h-5 w-5 text-green-500" />}
                      {notification.type === 'error' && <Bell className="h-5 w-5 text-red-500" />}
                    </div>
                    <div className="flex-1 space-y-1">
                      <button
                        className="text-left text-foreground/80 after:absolute after:inset-0"
                        onClick={() => handleNotificationClick(notification.id)}
                      >
                        <span className="font-medium text-foreground hover:underline">
                          {notification.title}
                        </span>
                      </button>
                      <div className="text-xs text-muted-foreground">
                        {notification.message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    {!notification.read && (
                      <div className="absolute end-0 self-center">
                        <Dot />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-muted-foreground">
                No notifications
              </div>
            )}
            {notifications.length > 0 && (
              <>
                <div
                  role="separator"
                  aria-orientation="horizontal"
                  className="-mx-1 my-1 h-px bg-border"
                ></div>
                <div className="p-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-center text-xs"
                    onClick={() => navigate('/notifications')}
                  >
                    View all notifications
                  </Button>
                </div>
              </>
            )}
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default DashboardHeader;
