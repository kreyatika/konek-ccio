
import React from "react";
import { motion } from "framer-motion";
import { LogOutIcon } from "lucide-react";
import { itemVariants } from "./animations";
import { useNavigate } from "react-router-dom";

interface FooterLinksProps {
  isCollapsed: boolean;
  onLogout: () => Promise<void>;
}

const FooterLinks = ({ isCollapsed, onLogout }: FooterLinksProps) => {
  const navigate = useNavigate();
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await onLogout();
      // We'll let the onLogout function handle the navigation
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div 
      className="flex h-8 w-full flex-row items-center rounded-md px-2 py-1.5 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer" 
      onClick={handleLogout}
    >
      <LogOutIcon className="h-4 w-4 shrink-0" />
      <motion.li variants={itemVariants}>
        {!isCollapsed && <p className="ml-2 text-sm">Log out</p>}
      </motion.li>
    </div>
  );
};

export default FooterLinks;
