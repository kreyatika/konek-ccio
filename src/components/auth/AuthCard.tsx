import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

interface AuthCardProps {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  defaultTab?: 'login' | 'signup';
}

const AuthCard: React.FC<AuthCardProps> = ({ 
  isLoading, 
  setIsLoading,
  defaultTab = 'login'
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </CardContent>
        </TabsContent>

        <TabsContent value="signup">
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>
              Sign up for a new account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm isLoading={isLoading} setIsLoading={setIsLoading} />
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthCard;
