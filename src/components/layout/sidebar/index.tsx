import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth";
import { Menu as MenuIcon } from "lucide-react";
import NavigationSection from "./NavigationSection";
import UserSection from "./UserSection";
import FooterLinks from "./FooterLinks";
import { getMainNavigation, userNavigation } from "./navigationConfig";

const Sidebar = () => {
  const { userProfile, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isSuperAdmin = userProfile?.role === 'superadmin';

  const mainNavigation = getMainNavigation(isSuperAdmin);

  return (
    <>
      <div 
        className={`fixed left-0 z-40 h-full shrink-0 border-r bg-sidebar ${isCollapsed ? 'w-16' : 'w-64'}`}
        onMouseEnter={() => setIsCollapsed(false)} 
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <div 
          className="relative z-40 flex h-full shrink-0 flex-col text-sidebar-foreground transition-all"
        >
          <div className="flex h-full flex-col">
            <div className="flex grow flex-col items-center">
              <div className="flex h-full w-full flex-col">
                <div className="flex grow flex-col gap-4">
                  <ScrollArea className="h-16 grow p-2">
                    <NavigationSection items={mainNavigation} isCollapsed={isCollapsed} />
                    
                    <Separator className="my-2" />
                    
                    <NavigationSection items={userNavigation} isCollapsed={isCollapsed} />
                    
                    <div className="mt-4">
                      <FooterLinks isCollapsed={isCollapsed} onLogout={logout} />
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="flex flex-col p-2">
                  <UserSection userProfile={userProfile} isCollapsed={isCollapsed} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex items-center p-4 md:hidden">
        <Button variant="outline" size="icon">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
