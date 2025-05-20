
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  Package,
  Users,
  CreditCard,
  Settings,
  FileText,
  BarChart2,
  Star,
  Database,
  ClipboardList
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  userType: 'company' | 'candidate' | 'admin' | 'guest';
}

const SidebarItem = ({ 
  to, 
  icon: Icon, 
  children, 
  active = false 
}: { 
  to: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  active?: boolean;
}) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all",
      active 
        ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    )}
  >
    <Icon size={18} />
    {children}
  </Link>
);

const Sidebar: React.FC<SidebarProps> = ({ userType }) => {
  const location = useLocation();
  const { pathname } = location;
  const { user, logout } = useAuth();
  
  // Company sidebar items
  const companyLinks = [
    { to: "/company/dashboard", icon: Home, text: "Dashboard" },
    { to: "/company/marketplace", icon: Package, text: "Marketplace" },
    { to: "/company/tests", icon: ClipboardList, text: "Credibility Tests" },
    { to: "/company/purchases", icon: CreditCard, text: "Purchases" },
    { to: "/company/subscriptions", icon: Star, text: "Subscription" },
    { to: "/company/settings", icon: Settings, text: "Settings" },
  ];
  
  // Candidate sidebar items
  const candidateLinks = [
    { to: "/candidate/dashboard", icon: Home, text: "Dashboard" },
    { to: "/candidate/profile", icon: FileText, text: "Profile" },
    { to: "/candidate/credibility-test", icon: ClipboardList, text: "Credibility Test" },
    { to: "/candidate/subscription", icon: Star, text: "Premium" },
    { to: "/candidate/settings", icon: Settings, text: "Settings" },
  ];
  
  // Admin sidebar items
  const adminLinks = [
    { to: "/admin/dashboard", icon: Home, text: "Dashboard" },
    { to: "/admin/candidates", icon: Users, text: "Candidates" },
    { to: "/admin/companies", icon: Package, text: "Companies" },
    { to: "/admin/tests", icon: ClipboardList, text: "Test Review" },
    { to: "/admin/packs", icon: Database, text: "Pack Management" },
    { to: "/admin/categories", icon: BarChart2, text: "Categories" },
    { to: "/admin/settings", icon: Settings, text: "Settings" },
  ];

  // Choose the appropriate links based on userType
  let links;
  let sidebarTitle;
  
  switch (userType) {
    case 'company':
      links = companyLinks;
      sidebarTitle = "Company Portal";
      break;
    case 'candidate':
      links = candidateLinks;
      sidebarTitle = "Candidate Portal";
      break;
    case 'admin':
      links = adminLinks;
      sidebarTitle = "Admin Portal";
      break;
    default:
      links = [];
      sidebarTitle = "Navigation";
  }

  return (
    <aside className="bg-sidebar p-4 w-64 border-r border-gray-200 hidden md:flex flex-col h-full bg-sidebar">
      <div className="mb-6 px-3">
        <Link to="/" className="flex items-center">
          <span className="text-lg font-semibold text-sidebar-primary">{sidebarTitle}</span>
        </Link>
      </div>
      
      <nav className="space-y-1 flex-1">
        {links.map((link) => (
          <SidebarItem 
            key={link.to} 
            to={link.to} 
            icon={link.icon}
            active={pathname === link.to}
          >
            {link.text}
          </SidebarItem>
        ))}
      </nav>
      
      {/* User section at bottom */}
      {user && (
        <div className="mt-auto border-t border-gray-200 pt-4">
          <div className="px-3 py-2">
            <div className="text-sm font-medium text-sidebar-foreground truncate">
              {user.fullName || user.email}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full mt-2" 
            size="sm"
            onClick={() => logout()}
          >
            Sign out
          </Button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
