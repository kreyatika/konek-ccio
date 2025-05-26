
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, RefreshCw } from 'lucide-react';

interface UserHeaderProps {
  onRefresh: () => void;
}

const UserHeader: React.FC<UserHeaderProps> = ({ onRefresh }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold flex items-center gap-2">
        <Users className="h-6 w-6" />
        User Management
      </h1>
      <Button onClick={onRefresh} variant="outline" size="sm">
        <RefreshCw className="w-4 h-4 mr-2" /> Refresh
      </Button>
    </div>
  );
};

export default UserHeader;
