
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { itemVariants } from "./animations";
import { UserProfile } from "@/contexts/auth/types";

interface UserSectionProps {
  userProfile: UserProfile | null;
  isCollapsed: boolean;
}

const UserSection = ({ userProfile, isCollapsed }: UserSectionProps) => {
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(userProfile?.avatar);

  // Update avatar URL when userProfile changes
  useEffect(() => {
    if (userProfile?.avatar) {
      setAvatarUrl(userProfile.avatar);
    }
  }, [userProfile]);

  return (
    <div className="mt-2 border-t pt-2">
      <div className="flex h-8 w-full flex-row items-center gap-2 rounded-md px-2 py-1.5">
        <Avatar className="h-5 w-5">
          <AvatarImage src={avatarUrl} alt={userProfile?.name || ''} />
          <AvatarFallback>
            {userProfile?.name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <motion.li variants={itemVariants} className="flex w-full items-center">
          {!isCollapsed && (
            <p className="text-xs text-sidebar-foreground/80 truncate">
              {userProfile?.name || 'User'}
            </p>
          )}
        </motion.li>
      </div>
    </div>
  );
};

export default UserSection;
