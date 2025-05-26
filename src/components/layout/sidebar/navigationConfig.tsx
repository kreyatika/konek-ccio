
import React from "react";
import { 
  LayoutDashboardIcon, 
  CalendarIcon, 
  KanbanSquareIcon, 
  FolderKanbanIcon, 
  CalendarClockIcon, 
  CalendarDaysIcon, 
  BellIcon, 
  UserCogIcon, 
  UserIcon, 
  SettingsIcon 
} from "lucide-react";

export const getMainNavigation = (isSuperAdmin: boolean) => {
  const mainNavigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboardIcon className="h-4 w-4" />
    }, 
    {
      name: "Calendar",
      href: "/calendar",
      icon: <CalendarIcon className="h-4 w-4" />
    }, 
    {
      name: "Kanban",
      href: "/kanban",
      icon: <KanbanSquareIcon className="h-4 w-4" />
    }, 
    {
      name: "Projects",
      href: "/projects",
      icon: <FolderKanbanIcon className="h-4 w-4" />
    }, 
    {
      name: "Meetings",
      href: "/meetings",
      icon: <CalendarClockIcon className="h-4 w-4" />
    }, 
    {
      name: "Events",
      href: "/events",
      icon: <CalendarDaysIcon className="h-4 w-4" />
    }, 
    {
      name: "Notifications",
      href: "/notifications",
      icon: <BellIcon className="h-4 w-4" />
    }
  ];

  if (isSuperAdmin) {
    mainNavigation.push({
      name: "User Management",
      href: "/admin",
      icon: <UserCogIcon className="h-4 w-4" />
    });
  }

  return mainNavigation;
};

export const userNavigation = [
  {
    name: "Profile",
    href: "/profile",
    icon: <UserIcon className="h-4 w-4" />
  }, 
  {
    name: "Settings",
    href: "/settings",
    icon: <SettingsIcon className="h-4 w-4" />
  }
];
