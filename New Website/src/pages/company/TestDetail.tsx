
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { CompanyTest } from '@/types/marketplace';
import { fetchTestWithQuestions } from '@/services/companyTests';
import { format } from 'date-fns';

const TestDetail: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const [test, setTest] = useState<CompanyTest | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTest = async () => {
      if (!testId) return;

      setLoading(true);
      const testData = await fetchTestWithQuestions(testId);
      setTest(testData);
      setLoading(false);
    };

    loadTest();
  }, [testId]);

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
              onClick={() => navigate('/company/tests')} 
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
          onClick={() => navigate('/company/tests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tests
        </Button>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <h1 className="text-3xl font-bold">{test.title}</h1>
            {getStatusBadge(test.status)}
          </div>
          
          {test.status === 'pending' && (
            <Button 
              onClick={() => navigate(`/company/tests/${testId}/edit`)}
            >
              Edit Test
            </Button>
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
            
            <div className="grid grid-cols-2 gap-4">
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
                <p className="font-medium text-red-800">This test was rejected</p>
                <p className="text-red-700">
                  Please review the test content and create a new test addressing any issues.
                </p>
              </div>
            )}
            
            {test.status === 'pending' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="font-medium text-yellow-800">This test is pending review</p>
                <p className="text-yellow-700">
                  An administrator will review your test and approve or reject it soon.
                </p>
              </div>
            )}
            
            {test.status === 'approved' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="font-medium text-green-800">This test is active</p>
                <p className="text-green-700">
                  This test has been approved and is now available to candidates.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Questions ({test.questions?.length || 0})</CardTitle>
            <CardDescription>
              Review the questions included in this test
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

export default TestDetail;
