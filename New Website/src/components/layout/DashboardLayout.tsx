
import React from 'react';
import Sidebar from './Sidebar';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Determine sidebar content based on user type from URL or auth context
  const getUserType = () => {
    if (user?.role === 'company') return 'company';
    if (user?.role === 'candidate') return 'candidate';
    if (user?.role === 'admin') return 'admin';
    
    // Fallback based on URL if needed
    if (location.pathname.includes('/company/')) return 'company';
    if (location.pathname.includes('/candidate/')) return 'candidate';
    if (location.pathname.includes('/admin/')) return 'admin';
    
    return 'guest';
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <Sidebar userType={getUserType()} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
