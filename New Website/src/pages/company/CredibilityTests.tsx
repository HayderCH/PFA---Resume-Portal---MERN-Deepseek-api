
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, FileText, AlertCircle, CheckCircle, Clock, Edit } from 'lucide-react';
import { CompanyTest } from '@/types/marketplace';
import { fetchCompanyTests } from '@/services/companyTests';
import { format } from 'date-fns';

const CredibilityTests: React.FC = () => {
  const [tests, setTests] = useState<CompanyTest[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      const data = await fetchCompanyTests();
      setTests(data);
      setLoading(false);
    };

    loadTests();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-yellow-500">Pending Review</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'MMM d, yyyy');
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Credibility Tests</h1>
            <p className="text-gray-600 mt-2">
              Create and manage your company's credibility tests
            </p>
          </div>
          <Button onClick={() => navigate('/company/tests/create')}>
            <Plus className="mr-2 h-4 w-4" /> Create New Test
          </Button>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TestsList tests={tests} loading={loading} />
          </TabsContent>
          
          <TabsContent value="pending">
            <TestsList 
              tests={tests.filter(t => t.status === 'pending')} 
              loading={loading} 
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <TestsList 
              tests={tests.filter(t => t.status === 'approved')} 
              loading={loading}
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <TestsList 
              tests={tests.filter(t => t.status === 'rejected')} 
              loading={loading}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );

  function TestsList({ tests, loading }: { tests: CompanyTest[], loading: boolean }) {
    if (loading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      );
    }

    if (tests.length === 0) {
      return (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No tests found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new credibility test.
          </p>
          <div className="mt-6">
            <Button onClick={() => navigate('/company/tests/create')}>
              Create Test
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tests.map(test => (
          <Card key={test.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <div className="flex items-center space-x-2">
                {getStatusIcon(test.status)}
                <CardTitle className="text-lg font-bold truncate">
                  {test.title}
                </CardTitle>
              </div>
              {getStatusBadge(test.status)}
            </CardHeader>
            <CardContent>
              <CardDescription className="line-clamp-2 h-10">
                {test.description || 'No description provided'}
              </CardDescription>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>Category: {test.categoryName || 'Uncategorized'}</p>
                <p>Created: {formatDate(test.createdAt)}</p>
              </div>
              
              <div className="mt-4 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(`/company/tests/${test.id}`)}
                >
                  View Details
                </Button>
                
                {test.status === 'pending' && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/company/tests/${test.id}/edit`)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default CredibilityTests;
