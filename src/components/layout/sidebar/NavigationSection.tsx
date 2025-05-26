
import React from "react";
import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import NavigationItem from "./NavigationItem";

interface NavigationSectionProps {
  items: {
    name: string;
    href: string;
    icon: React.ReactNode;
  }[];
  isCollapsed: boolean;
}

const NavigationSection = ({ items, isCollapsed }: NavigationSectionProps) => {
  const location = useLocation();
  
  return (
    <div className="flex w-full flex-col gap-1">
      {items.map(item => (
        <NavigationItem
          key={item.name}
          name={item.name}
          href={item.href}
          icon={item.icon}
          isActive={location.pathname === item.href}
          isCollapsed={isCollapsed}
        />
      ))}
    </div>
  );
};

export default NavigationSection;
