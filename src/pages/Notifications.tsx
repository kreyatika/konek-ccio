
import React from 'react';
import PageTransition from '@/components/ui/page-transition';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Bell, CheckCircle, AlertTriangle, Info, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNotifications } from '@/hooks/useNotifications';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Notification } from '@/types';

const Notifications = () => {
  const { 
    notifications, 
    unreadCount, 
    isLoading, 
    error, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  // Function to get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-blue-500" />;
    }
  };

  // Handler for clicking on a notification
  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
  };

  // If there's an error
  if (error) {
    return (
      <PageTransition>
        <div className="container px-4 py-6 mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Failed to load notifications. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="container px-4 py-6 mx-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
            <p className="text-muted-foreground">
              Stay up to date with important chamber information and updates.
            </p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <div>
                  <Badge variant="outline" className="mr-2">
                    {unreadCount} Unread
                  </Badge>
                  <Badge variant="outline">
                    {notifications.length} Total
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => markAllAsRead()}
                  disabled={unreadCount === 0}
                >
                  Mark All as Read
                </Button>
              </div>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="unread">Unread</TabsTrigger>
                  <TabsTrigger value="read">Read</TabsTrigger>
                  <TabsTrigger value="important">Important</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>All Notifications</CardTitle>
                      <CardDescription>
                        View all notifications related to your account
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NotificationList 
                        notifications={notifications} 
                        getNotificationIcon={getNotificationIcon}
                        onNotificationClick={handleNotificationClick}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="unread" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Unread Notifications</CardTitle>
                      <CardDescription>
                        View all notifications you haven't read yet
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NotificationList 
                        notifications={notifications.filter(n => !n.read)} 
                        getNotificationIcon={getNotificationIcon}
                        onNotificationClick={handleNotificationClick}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="read" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Read Notifications</CardTitle>
                      <CardDescription>
                        View all notifications you've already read
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NotificationList 
                        notifications={notifications.filter(n => n.read)} 
                        getNotificationIcon={getNotificationIcon}
                        onNotificationClick={handleNotificationClick}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="important" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Important Notifications</CardTitle>
                      <CardDescription>
                        View all high-priority notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <NotificationList 
                        notifications={notifications.filter(n => n.type === 'warning' || n.type === 'error')} 
                        getNotificationIcon={getNotificationIcon}
                        onNotificationClick={handleNotificationClick}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

// Extract the notification list into a separate component
interface NotificationListProps {
  notifications: Notification[];
  getNotificationIcon: (type: string) => JSX.Element;
  onNotificationClick: (notification: Notification) => void;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  getNotificationIcon,
  onNotificationClick
}) => {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        No notifications to display
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <NotificationItem 
          key={notification.id} 
          notification={notification} 
          getNotificationIcon={getNotificationIcon} 
          onClick={() => onNotificationClick(notification)}
        />
      ))}
    </div>
  );
};

// Extract the notification item into a separate component
interface NotificationItemProps {
  notification: Notification;
  getNotificationIcon: (type: string) => JSX.Element;
  onClick: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  getNotificationIcon,
  onClick
}) => {
  return (
    <div
      className={`flex items-start space-x-4 p-4 rounded-lg transition-colors cursor-pointer ${
        notification.read ? 'bg-card' : 'bg-muted'
      }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">
        {getNotificationIcon(notification.type)}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">{notification.title}</p>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{notification.message}</p>
        {notification.link && (
          <Button variant="link" className="h-auto p-0 text-sm text-blue-500">
            View Details
          </Button>
        )}
      </div>
      {!notification.read && (
        <div className="flex-shrink-0">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
        </div>
      )}
    </div>
  );
};

export default Notifications;
