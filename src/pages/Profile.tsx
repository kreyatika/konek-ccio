
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProfileInfoCard from '@/components/profile/ProfileInfoCard';
import SecurityCard from '@/components/profile/SecurityCard';
import PasswordChangeDialog from '@/components/profile/PasswordChangeDialog';

const ProfilePage = () => {
  const { userProfile, user } = useAuth();
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileInfoCard userProfile={userProfile} user={user} />
        <SecurityCard onChangePassword={() => setIsPasswordDialogOpen(true)} />
      </div>

      <PasswordChangeDialog 
        isOpen={isPasswordDialogOpen}
        onOpenChange={setIsPasswordDialogOpen}
      />
    </div>
  );
};

export default ProfilePage;
