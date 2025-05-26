
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface SecurityCardProps {
  onChangePassword: () => void;
}

const SecurityCard = ({ onChangePassword }: SecurityCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>
          Manage your password and account settings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full" onClick={onChangePassword}>
          Change Password
        </Button>
      </CardContent>
    </Card>
  );
};

export default SecurityCard;
