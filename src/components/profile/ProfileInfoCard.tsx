
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/contexts/auth/types';
import { Pencil } from 'lucide-react';
import AvatarUploader from './avatar/AvatarUploader';
import ProfileEditForm from './ProfileEditForm';

interface ProfileInfoCardProps {
  userProfile: UserProfile | null;
  user: any; // Supabase user
}

const ProfileInfoCard = ({ userProfile, user }: ProfileInfoCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(userProfile?.avatar || '');
  
  // Update avatarUrl when userProfile changes
  React.useEffect(() => {
    if (userProfile?.avatar) {
      setAvatarUrl(userProfile.avatar);
    }
  }, [userProfile]);

  const handleAvatarUpdate = (newUrl: string) => {
    setAvatarUrl(newUrl);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Manage your account details
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          {user && (
            <AvatarUploader 
              userId={user.id} 
              avatarUrl={avatarUrl} 
              userName={userProfile?.name || ''} 
              onAvatarUpdate={handleAvatarUpdate} 
            />
          )}
          <div>
            <h3 className="font-medium">{userProfile?.name || 'User'}</h3>
            <p className="text-sm text-muted-foreground">{userProfile?.email}</p>
            <p className="text-sm text-muted-foreground">Role: {userProfile?.role}</p>
          </div>
        </div>

        {isEditing ? (
          <ProfileEditForm 
            userId={user?.id} 
            initialName={userProfile?.name || ''} 
            onCancel={() => setIsEditing(false)} 
          />
        ) : (
          <Button 
            onClick={() => setIsEditing(true)} 
            variant="blue"
            className="flex gap-2"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProfileInfoCard;
