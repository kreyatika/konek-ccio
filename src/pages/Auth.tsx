
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/ui/logo';
import AuthCard from '@/components/auth/AuthCard';
import { useAuth } from '@/contexts/AuthContext';

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/50 px-4 py-8">
      <div className="text-center mb-8">
        <Logo size="lg" className="mx-auto mb-4" />
        <h1 className="text-2xl font-bold tracking-tight">Welcome to CCIO Connect</h1>
        <p className="text-muted-foreground mt-1">
          Sign in to your account to continue
        </p>
      </div>

      <AuthCard isLoading={isLoading} setIsLoading={setIsLoading} />

      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CCIO Connect. All rights reserved.
      </p>
    </div>
  );
};

export default Auth;
