
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fetchApprovedTestsForCategory } from '@/services/companyTests';
import { CompanyTest, TestQuestion } from '@/types/marketplace';
import { AlertCircle, CheckCircle, ArrowRight, Building } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

// Sample placeholder test if no company tests available
const placeholderTest: CompanyTest = {
  id: 'placeholder',
  companyId: 'system',
  title: 'General Credibility Assessment',
  description: 'This assessment evaluates your professional credibility and expertise.',
  status: 'approved',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  questions: [
    {
      id: 'q1',
      testId: 'placeholder',
      questionText: 'Describe your approach to problem-solving in your field.',
      questionType: 'text',
      orderIndex: 0,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q2',
      testId: 'placeholder',
      questionText: 'How do you stay updated with the latest developments in your industry?',
      questionType: 'text',
      orderIndex: 1,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q3',
      testId: 'placeholder',
      questionText: 'How would you rate your expertise level in your field?',
      questionType: 'rating',
      orderIndex: 2,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q4',
      testId: 'placeholder',
      questionText: 'What is your typical approach when facing a challenging project?',
      questionType: 'multiple_choice',
      expectedAnswer: 'Break it down into manageable tasks|Seek guidance from colleagues|Research similar projects|Create a detailed plan',
      orderIndex: 3,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'q5',
      testId: 'placeholder',
      questionText: 'Describe a situation where you demonstrated leadership in your previous role.',
      questionType: 'text',
      orderIndex: 4,
      createdAt: new Date().toISOString(),
    }
  ]
};

const CredibilityTest: React.FC = () => {
  const { user } = useAuth();
  const [testStarted, setTestStarted] = useState(false);
  const [selectedTest, setSelectedTest] = useState<CompanyTest | null>(null);
  const [companyTests, setCompanyTests] = useState<(CompanyTest & { companyName?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [testComplete, setTestComplete] = useState(false);
  const [testScore, setTestScore] = useState<number | null>(null);

  useEffect(() => {
    const loadTests = async () => {
      if (!user?.candidateDetails?.category) {
        setLoading(false);
        return;
      }

      try {
        const tests = await fetchApprovedTestsForCategory(user.candidateDetails.category);
        setCompanyTests(tests);
      } catch (error) {
        console.error('Error loading tests:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTests();
  }, [user?.candidateDetails?.category]);

  const startTest = (test: CompanyTest) => {
    setSelectedTest(test);
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTestComplete(false);
    setTestScore(null);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const goToNextQuestion = () => {
    if (!selectedTest?.questions) return;
    
    if (currentQuestion < selectedTest.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeTest();
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const completeTest = async () => {
    setTestComplete(true);
    
    // Mock scoring for now - in reality, this would be done by backend or AI
    const totalQuestions = selectedTest?.questions?.length || 1;
    const answeredQuestions = Object.keys(answers).length;
    const completionScore = Math.floor((answeredQuestions / totalQuestions) * 100);
    
    // Random score between 60 and 95 for demo
    const calculatedScore = Math.floor(Math.random() * 36) + 60;
    setTestScore(calculatedScore);
    
    // In a real app, we would save this to the database
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      // Update the candidate's credibility test status and score
      await supabase
        .from('candidates')
        .update({
          credibility_test_taken: true,
          overall_score: calculatedScore,
          last_tested: new Date().toISOString(),
          profile_status: 'test_completed'
        })
        .eq('id', user?.id || '');
      
      toast.success('Test completed successfully!');
      
      // Refresh user data to show updated profile status
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error('Error saving test results:', error);
      toast.error('Failed to save test results');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Credibility Test</h1>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show test completion page
  if (testComplete) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Test Completed</h1>
          
          <Card>
            <CardHeader>
              <div className="flex items-center mb-2">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                <CardTitle>Congratulations!</CardTitle>
              </div>
              <CardDescription>
                You've successfully completed the credibility assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-6">
                <div className="mb-4">
                  <span className="text-4xl font-bold text-green-500">{testScore}</span>
                  <span className="text-xl text-gray-500">/100</span>
                </div>
                <p className="text-gray-600">Your credibility score</p>
              </div>
              
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="font-medium text-green-800">Your profile is now complete</p>
                <p className="text-green-700">
                  Your credibility score has been added to your profile. Companies can now discover you in talent packs.
                </p>
              </div>
              
              <div className="flex justify-center">
                <Button onClick={() => window.location.href = '/candidate/dashboard'}>
                  Return to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Show test taking interface
  if (testStarted && selectedTest) {
    const question = selectedTest.questions?.[currentQuestion];
    const progress = selectedTest.questions ? 
      Math.round(((currentQuestion + 1) / selectedTest.questions.length) * 100) : 0;

    if (!question) {
      return <div>Error loading question</div>;
    }

    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-4">{selectedTest.title}</h1>
          
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">
                Question {currentQuestion + 1} of {selectedTest.questions?.length}
              </span>
              <span className="text-sm font-medium">{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">{question.questionText}</h2>
              
              {question.questionType === 'text' && (
                <Textarea 
                  placeholder="Enter your answer here..." 
                  className="min-h-[150px]"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                />
              )}
              
              {question.questionType === 'multiple_choice' && question.expectedAnswer && (
                <RadioGroup 
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                  className="space-y-3"
                >
                  {question.expectedAnswer.split('|').map((option, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`option-${idx}`} />
                      <Label htmlFor={`option-${idx}`}>{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {question.questionType === 'rating' && (
                <RadioGroup 
                  value={answers[question.id] || ''}
                  onValueChange={(value) => handleAnswer(question.id, value)}
                  className="flex justify-between"
                >
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <div key={rating} className="flex flex-col items-center">
                      <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                      <Label htmlFor={`rating-${rating}`} className="mt-1">{rating}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            
            <Button 
              onClick={goToNextQuestion}
              disabled={!answers[question.id]}
            >
              {currentQuestion < (selectedTest.questions?.length || 1) - 1 ? 'Next' : 'Complete Test'}
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Show test selection interface
  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Credibility Test</h1>
        
        {!user?.candidateDetails?.category ? (
          <Card>
            <CardHeader>
              <CardTitle>Category Required</CardTitle>
              <CardDescription>
                You need to select an industry category before taking the credibility test.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Please complete your profile information first by selecting an industry or job category.
              </p>
              <Button onClick={() => window.location.href = '/candidate/profile'}>
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>About the Credibility Test</CardTitle>
                <CardDescription>
                  This assessment helps verify your skills and expertise in {user?.candidateDetails?.category}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    The credibility test consists of questions designed by top companies in your field.
                    Your responses will be evaluated to generate a credibility score that will be visible
                    on your profile to potential employers.
                  </p>
                  
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2" />
                      <div>
                        <p className="font-medium text-blue-800">Why this matters</p>
                        <p className="text-blue-700">
                          A higher credibility score increases your visibility to companies and improves
                          your chances of being included in premium talent packs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <h2 className="text-xl font-bold mb-4">Available Tests</h2>
            
            <div className="space-y-4">
              {companyTests.length > 0 ? (
                companyTests.map(test => (
                  <Card key={test.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold mb-2">{test.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <Building className="h-4 w-4 mr-1" />
                            <span>Created by {test.companyName}</span>
                          </div>
                          <p className="text-gray-600 mb-4">
                            {test.description || 'No description provided'}
                          </p>
                        </div>
                        <Button onClick={() => startTest(test)}>
                          Start Test <ArrowRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                // If no company tests are available for this category, show the placeholder test
                <Card className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold mb-2">{placeholderTest.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mb-3">
                          <Building className="h-4 w-4 mr-1" />
                          <span>Standard Assessment</span>
                        </div>
                        <p className="text-gray-600 mb-4">
                          {placeholderTest.description}
                        </p>
                      </div>
                      <Button onClick={() => startTest(placeholderTest)}>
                        Start Test <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CredibilityTest;
