
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserProfile } from '@/contexts/auth/types';

interface AdminWelcomeCardProps {
  userProfile: UserProfile;
  isUpdating: boolean;
  onSetSuperAdmin: () => void;
}

const AdminWelcomeCard: React.FC<AdminWelcomeCardProps> = ({
  userProfile,
  isUpdating,
  onSetSuperAdmin,
}) => {
  return (
    <div className="bg-muted p-4 rounded-lg mb-6">
      <p>Welcome, {userProfile?.name || 'Admin'}!</p>
      <p className="text-muted-foreground">
        Current Role: <span className="font-medium">{userProfile?.role || 'Not set'}</span>
      </p>
      <p className="text-muted-foreground">This page is restricted to super admins only.</p>
      
      {userProfile?.role !== 'superadmin' && (
        <div className="mt-4">
          <Button 
            onClick={onSetSuperAdmin} 
            disabled={isUpdating}
            size="sm"
            variant="secondary"
          >
            {isUpdating ? 'Updating...' : 'Set as Superadmin'}
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Note: You should not normally see this page unless you're a superadmin.
            If you see this, your role might not be set correctly.
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminWelcomeCard;
