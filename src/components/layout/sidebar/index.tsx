
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth";
import { MenuIcon } from "lucide-react";
import NavigationSection from "./NavigationSection";
import UserSection from "./UserSection";
import FooterLinks from "./FooterLinks";
import { 
  sidebarVariants, 
  contentVariants, 
  staggerVariants, 
  transitionProps 
} from "./animations";
import { getMainNavigation, userNavigation } from "./navigationConfig";

const Sidebar = () => {
  const { userProfile, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const isSuperAdmin = userProfile?.role === 'superadmin';

  const mainNavigation = getMainNavigation(isSuperAdmin);

  return (
    <>
      <motion.div 
        className="fixed left-0 z-40 h-full shrink-0 border-r bg-sidebar" 
        initial={isCollapsed ? "closed" : "open"} 
        animate={isCollapsed ? "closed" : "open"} 
        variants={sidebarVariants} 
        transition={transitionProps} 
        onMouseEnter={() => setIsCollapsed(false)} 
        onMouseLeave={() => setIsCollapsed(true)}
      >
        <motion.div 
          className="relative z-40 flex h-full shrink-0 flex-col text-sidebar-foreground transition-all" 
          variants={contentVariants}
        >
          <motion.ul variants={staggerVariants} className="flex h-full flex-col">
            <div className="flex grow flex-col items-center">
              <div className="flex h-[54px] w-full shrink-0 border-b p-2">
                <div className="flex w-full items-center justify-center py-[81px] my-0">
                  {/* Logo space intentionally left empty */}
                </div>
              </div>
              
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
          </motion.ul>
        </motion.div>
      </motion.div>
      
      <div className="flex items-center p-4 md:hidden">
        <Button variant="outline" size="icon">
          <MenuIcon className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default Sidebar;
