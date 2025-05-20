
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, CheckCircle, AlertCircle, Clock,
  CheckCheck, X, Building 
} from 'lucide-react';
import { CompanyTest } from '@/types/marketplace';
import { fetchTestWithQuestions, updateTestStatus } from '@/services/companyTests';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Extend the test type to include company name for admin view
type AdminTestView = CompanyTest & { 
  companyName?: string 
};

const AdminTestDetail: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<AdminTestView | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTest = async () => {
      if (!testId) return;

      setLoading(true);
      try {
        // First get the test data
        const testData = await fetchTestWithQuestions(testId);
        
        if (!testData) {
          setLoading(false);
          return;
        }
        
        // Fetch the company name separately
        const { supabase } = await import('@/integrations/supabase/client');
        const { data } = await supabase
          .from('companies')
          .select('company_name')
          .eq('id', testData.companyId)
          .single();
        
        setTest({
          ...testData,
          companyName: data?.company_name
        });
      } catch (error) {
        console.error('Error loading test:', error);
        toast.error('Failed to load test details');
      } finally {
        setLoading(false);
      }
    };

    loadTest();
  }, [testId]);

  const handleApprove = async () => {
    if (!testId) return;
    
    const success = await updateTestStatus(testId, 'approved');
    if (success) {
      setTest(test ? { ...test, status: 'approved' } : null);
      toast.success('Test approved successfully');
    }
  };

  const handleReject = async () => {
    if (!testId) return;
    
    const success = await updateTestStatus(testId, 'rejected');
    if (success) {
      setTest(test ? { ...test, status: 'rejected' } : null);
      toast.success('Test rejected successfully');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!test) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Test not found</h3>
            <Button 
              onClick={() => navigate('/admin/tests')} 
              className="mt-4"
            >
              Back to Tests
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <AlertCircle className="h-6 w-6 text-red-500" />;
      case 'pending':
      default:
        return <Clock className="h-6 w-6 text-yellow-500" />;
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
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/admin/tests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tests
        </Button>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">{test.title}</h1>
            {getStatusBadge(test.status)}
          </div>
          
          {test.status === 'pending' && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="border-green-500 text-green-600 hover:bg-green-50"
                onClick={handleApprove}
              >
                <CheckCheck className="mr-2 h-4 w-4" /> Approve
              </Button>
              
              <Button 
                variant="outline" 
                className="border-red-500 text-red-600 hover:bg-red-50"
                onClick={handleReject}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
            </div>
          )}
        </div>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              {getStatusIcon(test.status)}
              <span className="ml-2">Test Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p>{test.description || 'No description provided'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Company</p>
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1 text-gray-400" />
                  <p className="font-medium">{test.companyName || 'Unknown'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Category</p>
                <p>{test.categoryName || 'Uncategorized'}</p>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500">Created</p>
                <p>{formatDate(test.createdAt)}</p>
              </div>
            </div>
            
            {test.status === 'rejected' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="font-medium text-red-800">You rejected this test</p>
                <p className="text-red-700">
                  The company will need to create a new test.
                </p>
              </div>
            )}
            
            {test.status === 'pending' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="font-medium text-yellow-800">This test is awaiting your review</p>
                <p className="text-yellow-700">
                  Please review the test content and either approve or reject it.
                </p>
              </div>
            )}
            
            {test.status === 'approved' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="font-medium text-green-800">You approved this test</p>
                <p className="text-green-700">
                  This test is now active and available to candidates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Questions ({test.questions?.length || 0})</CardTitle>
            <CardDescription>
              Review the questions in this test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {test.questions?.length ? (
              test.questions.map((question, index) => (
                <div key={question.id} className="p-4 border rounded-md">
                  <h3 className="font-medium mb-2">Question {index + 1}</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Question</p>
                      <p className="font-medium">{question.questionText}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Type</p>
                        <p>{question.questionType === 'text' ? 'Text Response' : 
                           question.questionType === 'multiple_choice' ? 'Multiple Choice' : 
                           'Rating Scale'}</p>
                      </div>
                    </div>
                    
                    {question.expectedAnswer && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Expected Answer</p>
                        <p>{question.expectedAnswer}</p>
                      </div>
                    )}
                    
                    {question.scoringCriteria && (
                      <div>
                        <p className="text-sm font-medium text-gray-500">Scoring Criteria</p>
                        <p>{question.scoringCriteria}</p>
                      </div>
                    )}
                  </div>
                  
                  {index < (test.questions?.length || 0) - 1 && (
                    <Separator className="my-4" />
                  )}
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No questions found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AdminTestDetail;
