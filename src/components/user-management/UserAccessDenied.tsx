
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const UserAccessDenied = () => {
  return (
    <div className="container mx-auto py-10">
      <Card className="border-destructive">
        <CardHeader>
          <AlertTriangle className="text-destructive w-10 h-10 mb-2" />
          <CardTitle>Access Denied</CardTitle>
          <CardDescription>
            You don't have permission to access this page. Only superadmins can manage users.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
};

export default UserAccessDenied;
