
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';
import { Package, Users, CreditCard, BarChart2, Loader2 } from 'lucide-react';
import { CompanyStats } from '@/types/marketplace';
import { fetchCompanyDashboardStats, fetchFeaturedPacks } from '@/services/marketplace';
import { TalentPack } from '@/types/marketplace';

const CompanyDashboard: React.FC = () => {
  const { user } = useAuth();
  const companyName = user?.companyDetails?.companyName || 'Your Company';
  const companyId = user?.id || '';
  
  const [stats, setStats] = useState<CompanyStats | null>(null);
  const [featuredPacks, setFeaturedPacks] = useState<TalentPack[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const [statsData, packsData] = await Promise.all([
          fetchCompanyDashboardStats(companyId),
          fetchFeaturedPacks()
        ]);
        
        setStats(statsData);
        // Take just the first 3 featured packs
        setFeaturedPacks(packsData.slice(0, 3));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (companyId) {
      loadDashboardData();
    }
  }, [companyId]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {companyName}</h1>
        <p className="text-gray-600">
          Access your talent acquisition dashboard, browse the marketplace, and manage your purchases.
        </p>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-12 w-12 text-talent-primary animate-spin" />
          </div>
        ) : (
          <>
            {/* Dashboard Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Available Packs
                  </CardTitle>
                  <Package size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.availablePacks}</div>
                  <p className="text-xs text-muted-foreground">
                    Across {stats?.industriesCount} industries
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Purchased Packs
                  </CardTitle>
                  <CreditCard size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.purchasedPacks}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats?.totalCandidates} candidates total
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Viewed Candidates
                  </CardTitle>
                  <Users size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.viewedCandidates}</div>
                  <p className="text-xs text-muted-foreground">
                    {Math.round(stats?.viewedPercentage || 0)}% of purchased profiles
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    Subscription Status
                  </CardTitle>
                  <BarChart2 size={18} className="text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.subscriptionTier || 'Basic'}</div>
                  <p className="text-xs text-muted-foreground">
                    <Link to="/company/subscriptions" className="text-talent-primary">Upgrade</Link>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Purchases */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent Purchases</h2>
                <Link to="/company/purchases">
                  <Button variant="link">View All</Button>
                </Link>
              </div>
              
              {stats?.purchasedPacks && stats.purchasedPacks > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1"></div>
                    <CardHeader>
                      <CardTitle>Placeholder Pack Name</CardTitle>
                      <CardDescription>
                        Purchased recently
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          25 candidates
                        </div>
                        <Link to="/company/purchases/placeholder-id">
                          <Button size="sm" variant="outline">
                            Access Data
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="bg-gray-50 border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <p className="text-gray-500 mb-4">You haven't purchased any talent packs yet</p>
                    <Link to="/company/marketplace">
                      <Button>Browse Marketplace</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Marketplace Preview */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Featured Talent Packs</h2>
                <Link to="/company/marketplace">
                  <Button variant="link">Browse Marketplace</Button>
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {featuredPacks.length > 0 ? (
                  featuredPacks.map(pack => (
                    <Card key={pack.id} className="overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1"></div>
                      <CardHeader>
                        <CardTitle>{pack.name}</CardTitle>
                        <CardDescription>
                          {pack.description.slice(0, 60)}...
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="text-sm text-muted-foreground mb-1">
                              {pack.candidateCount} candidates
                            </div>
                            <div className="font-semibold">{formatCurrency(pack.price)}</div>
                          </div>
                          <Link to={`/company/marketplace/pack/${pack.id}`}>
                            <Button size="sm">
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="col-span-3 bg-gray-50 border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-10">
                      <p className="text-gray-500 mb-4">No featured packs available at the moment</p>
                      <Link to="/company/marketplace">
                        <Button>Browse All Packs</Button>
                      </Link>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CompanyDashboard;
