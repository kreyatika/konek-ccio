
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

interface RequireSuperAdminProps {
  children: React.ReactNode;
}

const RequireSuperAdmin: React.FC<RequireSuperAdminProps> = ({ children }) => {
  const { isAuthenticated, loading, userProfile } = useAuth();
  const location = useLocation();
  
  console.log('RequireSuperAdmin check:', { 
    isAuthenticated, 
    loading, 
    userProfile
  }); // Add more detailed logging
  
  // Development mode - allow access to fix role issues
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Added null check for userProfile
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // In development mode, allow access to the admin page to fix roles
  if (isDevelopment) {
    console.log('Development mode: Allowing access to admin page regardless of role');
    return <>{children}</>;
  }

  if (userProfile.role !== 'superadmin') {
    console.log('Access denied - not superadmin. Current role:', userProfile.role);
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireSuperAdmin;
