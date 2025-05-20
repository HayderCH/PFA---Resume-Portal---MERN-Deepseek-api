import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { UserRole } from '@/types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading spinner or placeholder while checking auth
    return <div className="h-screen w-full flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated || !user) {
    // Redirect to the login page if not authenticated
    return <Navigate to="/login" />;
  }
  
  // Check if user has permission to access this route
  if (user.role && allowedRoles.includes(user.role)) {
    return <>{children}</>;
  }
  
  // Redirect based on user role if they don't have permission
  if (user.role === 'candidate') {
    return <Navigate to="/candidate/dashboard" />;
  } else if (user.role === 'company') {
    return <Navigate to="/company/dashboard" />;
  } else if (user.role === 'admin') {
    return <Navigate to="/admin/dashboard" />;
  }
  
  // Fallback to the home page
  return <Navigate to="/" />;
};

export default ProtectedRoute;
