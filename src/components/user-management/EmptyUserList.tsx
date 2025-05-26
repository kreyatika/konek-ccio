
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Users, RefreshCw } from 'lucide-react';

interface EmptyUserListProps {
  onRefresh: () => void;
}

const EmptyUserList: React.FC<EmptyUserListProps> = ({ onRefresh }) => {
  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            User Management
          </CardTitle>
          <CardDescription>
            No users found in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh List
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmptyUserList;
