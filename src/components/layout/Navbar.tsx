
import { useAuth } from '@/contexts/auth';
import { Bell, ChevronDown, Search, Settings, LogOut, User, Shield } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNotifications } from '@/hooks/useNotifications';

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

const Navbar = () => {
  const { user, logout, userProfile } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent form submission if search is closed
    if (!isSearchOpen) {
      setIsSearchOpen(true);
      return;
    }
  };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full shrink-0 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex items-center">
          <Logo className="mr-6" />
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search */}
          <form 
            onSubmit={handleSearch} 
            className={cn(
              "relative flex items-center transition-all duration-300 ease-in-out",
              isSearchOpen ? "w-64" : "w-9"
            )}
          >
            <input
              type="search"
              placeholder="Search..."
              className={cn(
                "h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors",
                "file:border-0 file:bg-transparent file:text-sm file:font-medium",
                "placeholder:text-muted-foreground",
                "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "pr-9", // Make room for the button
                isSearchOpen ? "opacity-100" : "opacity-0"
              )}
            />
            <Button 
              type="submit"
              variant="ghost" 
              size="icon" 
              className="absolute right-0"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
          </form>
          
          {/* Notifications - New Design */}
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
          
          {/* Settings */}
          <Button variant="ghost" size="icon" asChild>
            <Link to="/settings">
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1 pl-1">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={userProfile?.avatar} alt={userProfile?.name || ''} />
                  <AvatarFallback>{userProfile?.name ? getInitials(userProfile.name) : 'U'}</AvatarFallback>
                </Avatar>
                <span className="text-xs hidden md:inline-block">{userProfile?.name}</span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{userProfile?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
