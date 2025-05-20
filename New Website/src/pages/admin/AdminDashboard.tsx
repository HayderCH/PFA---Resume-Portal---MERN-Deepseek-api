import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Users, Package, Database, Tag, 
  BarChart2, CreditCard, AlertCircle, Check,
  Plus, Package2, User, Loader2
} from 'lucide-react';
import PackManagement from '@/components/admin/PackManagement';
import CategoryManagement from '@/components/admin/CategoryManagement';
import UserManagement from '@/components/admin/UserManagement';
import { AdminStats, RecentActivity } from '@/types/marketplace';
import { fetchAdminDashboardStats, fetchRecentActivities } from '@/services/marketplace';
import { format } from 'date-fns';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, activitiesData] = await Promise.all([
          fetchAdminDashboardStats(),
          fetchRecentActivities(5)
        ]);
        
        setStats(statsData);
        setActivities(activitiesData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Get icon based on activity status
  const getActivityIcon = (status: string, action: string) => {
    if (status === 'success') {
      if (action.includes('Pack')) return <Package2 size={16} className="text-green-500 mr-2 mt-1" />;
      if (action.includes('User') || action.includes('company')) return <User size={16} className="text-purple-500 mr-2 mt-1" />;
      return <Check size={16} className="text-green-500 mr-2 mt-1" />;
    }
    
    if (status === 'warning') return <AlertCircle size={16} className="text-amber-500 mr-2 mt-1" />;
    
    return <Plus size={16} className="text-blue-500 mr-2 mt-1" />;
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    try {
      const now = new Date();
      const date = new Date(dateString);
      
      // If it's today, show the time
      if (date.toDateString() === now.toDateString()) {
        return `Today, ${format(date, 'h:mm a')}`;
      }
      
      // If it's yesterday
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
        return `Yesterday, ${format(date, 'h:mm a')}`;
      }
      
      // Otherwise show the date
      return format(date, 'MMM d, h:mm a');
    } catch (e) {
      return 'Unknown date';
    }
  };

  // Get border color based on activity status
  const getActivityBorderColor = (status: string) => {
    switch (status) {
      case 'success': return 'border-green-500';
      case 'warning': return 'border-amber-500';
      case 'pending': return 'border-blue-500';
      default: return 'border-purple-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage platform users, categories, and packs
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 text-talent-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Candidates
                  </CardTitle>
                  <Users size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCandidates.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.newCandidatesThisWeek} this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Companies
                  </CardTitle>
                  <Package size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalCompanies.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{stats?.newCompaniesThisWeek} this week
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Packs
                  </CardTitle>
                  <Database size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activePacks.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {stats?.categoriesCount} categories
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Monthly Revenue
                  </CardTitle>
                  <CreditCard size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(stats?.monthlyRevenue || 0)}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.revenueChangePercentage > 0 ? '+' : ''}{stats?.revenueChangePercentage}% from last month
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="packs">
              <TabsList className="mb-4">
                <TabsTrigger value="packs">Talent Packs</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>
              
              <TabsContent value="packs">
                <PackManagement />
              </TabsContent>
              
              <TabsContent value="categories">
                <CategoryManagement />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagement />
              </TabsContent>
            </Tabs>

            {/* Recent Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and events on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No recent activities</p>
                  ) : (
                    activities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className={`border-l-4 ${getActivityBorderColor(activity.status)} pl-4 py-1`}
                      >
                        <div className="flex items-start">
                          {getActivityIcon(activity.status, activity.action)}
                          <div>
                            <p className="text-sm font-medium">{activity.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(activity.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
