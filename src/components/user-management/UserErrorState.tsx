
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface UserErrorStateProps {
  error: Error;
  onRefresh: () => void;
}

const UserErrorState: React.FC<UserErrorStateProps> = ({ error, onRefresh }) => {
  return (
    <div className="container mx-auto py-10">
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Error Loading Users</CardTitle>
          <CardDescription>
            {error.message || 'Failed to load users.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onRefresh} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" /> Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserErrorState;
