
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface NavigationItemProps {
  name: string;
  href: string;
  icon: React.ReactNode;
  isActive: boolean;
  isCollapsed: boolean;
}

const NavigationItem = ({ name, href, icon, isActive, isCollapsed }: NavigationItemProps) => {
  return (
    <Link 
      to={href} 
      className={cn(
        "flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground", 
        isActive && "bg-sidebar-accent text-sidebar-primary font-medium"
      )}
    >
      {icon}
      {!isCollapsed && <p className="ml-2 text-sm">{name}</p>}
    </Link>
  );
};

export default NavigationItem;
