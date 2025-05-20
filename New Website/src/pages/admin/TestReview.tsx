
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { 
  FileText, Search, CheckCircle, AlertCircle, Clock, 
  CheckCheck, X, ArrowRight 
} from 'lucide-react';
import { CompanyTest } from '@/types/marketplace';
import { fetchAllTestsForAdmin, updateTestStatus } from '@/services/companyTests';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const TestReview: React.FC = () => {
  const [tests, setTests] = useState<(CompanyTest & { companyName?: string })[]>([]);
  const [filteredTests, setFilteredTests] = useState<(CompanyTest & { companyName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadTests = async () => {
      setLoading(true);
      const data = await fetchAllTestsForAdmin();
      setTests(data);
      setFilteredTests(data);
      setLoading(false);
    };

    loadTests();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredTests(tests);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tests.filter(test => 
      test.title.toLowerCase().includes(query) || 
      test.companyName?.toLowerCase().includes(query) ||
      test.categoryName?.toLowerCase().includes(query)
    );
    setFilteredTests(filtered);
  }, [searchQuery, tests]);

  const handleApprove = async (testId: string) => {
    const success = await updateTestStatus(testId, 'approved');
    if (success) {
      setTests(tests.map(test => 
        test.id === testId ? { ...test, status: 'approved' } : test
      ));
      setFilteredTests(filteredTests.map(test => 
        test.id === testId ? { ...test, status: 'approved' } : test
      ));
      toast.success('Test approved successfully');
    }
  };

  const handleReject = async (testId: string) => {
    const success = await updateTestStatus(testId, 'rejected');
    if (success) {
      setTests(tests.map(test => 
        test.id === testId ? { ...test, status: 'rejected' } : test
      ));
      setFilteredTests(filteredTests.map(test => 
        test.id === testId ? { ...test, status: 'rejected' } : test
      ));
      toast.success('Test rejected successfully');
    }
  };

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
            <h1 className="text-3xl font-bold">Test Review</h1>
            <p className="text-gray-600 mt-2">
              Review and manage company-submitted credibility tests
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search tests by title, company, or category..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="pending">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Tests</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <TestsList 
              tests={filteredTests} 
              loading={loading} 
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
          
          <TabsContent value="pending">
            <TestsList 
              tests={filteredTests.filter(t => t.status === 'pending')} 
              loading={loading} 
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
          
          <TabsContent value="approved">
            <TestsList 
              tests={filteredTests.filter(t => t.status === 'approved')} 
              loading={loading}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
          
          <TabsContent value="rejected">
            <TestsList 
              tests={filteredTests.filter(t => t.status === 'rejected')} 
              loading={loading}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );

  function TestsList({ 
    tests, 
    loading, 
    onApprove,
    onReject
  }: { 
    tests: (CompanyTest & { companyName?: string })[], 
    loading: boolean, 
    onApprove: (id: string) => void, 
    onReject: (id: string) => void 
  }) {
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
            There are no tests matching your current filters.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {tests.map(test => (
          <Card key={test.id}>
            <CardContent className="p-6">
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(test.status)}
                    <h3 className="text-lg font-bold">{test.title}</h3>
                    {getStatusBadge(test.status)}
                  </div>
                  
                  <p className="text-gray-500 mb-4 line-clamp-2">
                    {test.description || 'No description provided'}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="font-medium">{test.companyName || 'Unknown'}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p>{test.categoryName || 'Uncategorized'}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Submitted</p>
                      <p>{formatDate(test.createdAt)}</p>
                    </div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col justify-center space-y-2">
                  <Button 
                    className="whitespace-nowrap"
                    onClick={() => navigate(`/admin/tests/${test.id}`)}
                  >
                    View Details <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  
                  {test.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                        onClick={() => onApprove(test.id)}
                      >
                        <CheckCheck className="mr-1 h-4 w-4" /> Approve
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                        onClick={() => onReject(test.id)}
                      >
                        <X className="mr-1 h-4 w-4" /> Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};

export default TestReview;
