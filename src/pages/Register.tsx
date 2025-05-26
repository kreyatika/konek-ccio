import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import AuthCard from '@/components/auth/AuthCard';
import { useAuth } from '@/contexts/auth';
import Logo from '@/components/ui/logo';
import { motion } from 'framer-motion';
const Register = () => {
  const {
    isAuthenticated
  } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-background to-secondary/50 px-4 py-8">
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }}>
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
          <h1 className="font-bold tracking-tight text-xl">Welcome to KONEK</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign in to your account or create a new one
          </p>
        </div>
        
        <AuthCard isLoading={isLoading} setIsLoading={setIsLoading} defaultTab="login" />
      </motion.div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CCIO KONEK. All rights reserved.
      </p>
    </div>;
};
export default Register;