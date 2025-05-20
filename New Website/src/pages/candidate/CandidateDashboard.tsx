
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { FileText, BarChart2, CheckCircle, AlertTriangle } from 'lucide-react';

const CandidateDashboard: React.FC = () => {
  const { user } = useAuth();
  const fullName = user?.candidateDetails?.fullName || user?.fullName || 'Candidate';
  const profileStatus = user?.candidateDetails?.profileStatus || 'incomplete';
  
  // Derived values based on profile status
  const hasUploadedCV = profileStatus !== 'incomplete';
  const hasVerifiedData = profileStatus === 'data_verified' || profileStatus === 'test_completed' || profileStatus === 'complete';
  const hasCompletedTest = profileStatus === 'test_completed' || profileStatus === 'complete';
  const hasReceivedScore = profileStatus === 'complete';
  
  // Score data - use real data if available
  const candidateScore = user?.candidateDetails?.overallScore || 87;
  const candidateRank = 42; // This would come from an API in a real implementation
  const totalInCategory = 356; // This would come from an API in a real implementation
  const rankPercentile = Math.round((1 - (candidateRank / totalInCategory)) * 100);
  
  // Component scores - in a real implementation, these would come from an API
  const componentScores = [
    { name: 'Technical Skills', score: 92 },
    { name: 'Experience', score: 84 },
    { name: 'Education', score: 78 },
    { name: 'Problem Solving', score: 91 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Welcome, {fullName}</h1>
        <p className="text-gray-600">
          Manage your profile, track your assessment progress, and view your industry ranking.
        </p>

        {/* Profile Status */}
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Profile Status</CardTitle>
            <CardDescription>Current progress of your profile setup and assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center p-3 border rounded-md">
                  <div className={`mr-3 ${hasUploadedCV ? 'text-green-500' : 'text-amber-500'}`}>
                    {hasUploadedCV ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <p className="font-medium">CV Upload</p>
                    <p className="text-sm text-gray-500">{hasUploadedCV ? 'Completed' : 'Required'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <div className={`mr-3 ${hasVerifiedData ? 'text-green-500' : 'text-amber-500'}`}>
                    {hasVerifiedData ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <p className="font-medium">Data Verification</p>
                    <p className="text-sm text-gray-500">{hasVerifiedData ? 'Completed' : 'Required'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <div className={`mr-3 ${hasCompletedTest ? 'text-green-500' : 'text-amber-500'}`}>
                    {hasCompletedTest ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <p className="font-medium">Credibility Test</p>
                    <p className="text-sm text-gray-500">{hasCompletedTest ? 'Completed' : 'Required'}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border rounded-md">
                  <div className={`mr-3 ${hasReceivedScore ? 'text-green-500' : 'text-amber-500'}`}>
                    {hasReceivedScore ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                  </div>
                  <div>
                    <p className="font-medium">Scoring</p>
                    <p className="text-sm text-gray-500">{hasReceivedScore ? 'Completed' : 'Pending'}</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-3">
                {profileStatus === 'incomplete' ? (
                  <Link to="/candidate/profile">
                    <Button className="w-full sm:w-auto">Complete Your Profile</Button>
                  </Link>
                ) : profileStatus === 'cv_uploaded' ? (
                  <Link to="/candidate/profile">
                    <Button className="w-full sm:w-auto">Verify Your Data</Button>
                  </Link>
                ) : profileStatus === 'data_verified' ? (
                  <Link to="/candidate/test">
                    <Button className="w-full sm:w-auto">Take Credibility Test</Button>
                  </Link>
                ) : (
                  <div className="text-center text-sm text-green-700 font-medium py-1 bg-green-50 rounded-md">
                    Your profile is complete and visible to companies in your industry
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score and Rank */}
        {hasReceivedScore ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1"></div>
              <CardHeader>
                <CardTitle>Overall Industry Score</CardTitle>
                <CardDescription>
                  Your comprehensive assessment score
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center justify-center">
                  <div className="relative h-32 w-32 flex items-center justify-center">
                    <svg className="absolute" width="128" height="128" viewBox="0 0 100 100">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#e2e8f0" 
                        strokeWidth="10" 
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#4F46E5" 
                        strokeWidth="10" 
                        strokeDasharray={`${candidateScore * 2.83} 283`} 
                        strokeLinecap="round" 
                        transform="rotate(-90 50 50)" 
                      />
                    </svg>
                    <div className="text-3xl font-bold text-gray-800">{candidateScore}</div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-center w-full text-sm">
                  <span className="text-talent-primary font-medium">
                    {candidateScore >= 85 ? 'Excellent' : 
                     candidateScore >= 70 ? 'Good' : 
                     candidateScore >= 50 ? 'Average' : 'Needs Improvement'}
                  </span> score compared to peers
                </div>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1"></div>
              <CardHeader>
                <CardTitle>Industry Ranking</CardTitle>
                <CardDescription>
                  Your position within your primary category
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold">#{candidateRank}</div>
                  <p className="text-sm text-gray-500 mb-4">Out of {totalInCategory} candidates</p>
                  
                  <div className="bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-talent-primary h-full rounded-full" 
                      style={{ width: `${rankPercentile}%` }}
                    ></div>
                  </div>
                  
                  <p className="mt-2 text-sm">
                    Top <span className="font-semibold">{rankPercentile}%</span> in your category
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-center w-full text-sm">
                  <span className="text-talent-primary">{user?.candidateDetails?.category || 'Software Engineering'}</span> category
                </div>
              </CardFooter>
            </Card>
            
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1"></div>
              <CardHeader>
                <CardTitle>Visibility Status</CardTitle>
                <CardDescription>
                  Where your profile appears
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span>Included in packs:</span>
                    <span className="font-medium">2 packs</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span>Viewed by companies:</span>
                    <span className="font-medium">5 companies</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pb-1">
                    <span>Profile visibility:</span>
                    <span className="text-green-500 font-medium">Active</span>
                  </div>
                  
                  <div className="pt-2">
                    <Link to="/candidate/subscription">
                      <Button variant="outline" size="sm" className="w-full">
                        Upgrade for Premium Insights
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="text-center w-full text-xs text-gray-500">
                  Premium members receive detailed visibility analytics
                </div>
              </CardFooter>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Complete Your Assessment</CardTitle>
              <CardDescription>
                {profileStatus === 'incomplete' 
                  ? 'Upload your CV to start the assessment process'
                  : profileStatus === 'cv_uploaded'
                  ? 'Verify your extracted data to proceed to the credibility test'
                  : 'Take the credibility test to receive your industry score and ranking'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {profileStatus === 'incomplete' && (
                  <Link to="/candidate/profile">
                    <Button>
                      <FileText className="mr-2 h-4 w-4" /> Upload CV
                    </Button>
                  </Link>
                )}
                
                {profileStatus === 'cv_uploaded' && (
                  <Link to="/candidate/profile">
                    <Button>
                      <CheckCircle className="mr-2 h-4 w-4" /> Verify Data
                    </Button>
                  </Link>
                )}
                
                {profileStatus === 'data_verified' && (
                  <Link to="/candidate/test">
                    <Button>
                      <BarChart2 className="mr-2 h-4 w-4" /> Take Credibility Test
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Component Scores */}
        {hasReceivedScore && (
          <Card>
            <CardHeader>
              <CardTitle>Score Breakdown</CardTitle>
              <CardDescription>Detailed assessment of your different skill components</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {componentScores.map((component, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{component.name}</span>
                      <span className="text-sm font-medium">{component.score}/100</span>
                    </div>
                    <Progress value={component.score} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Link to="/candidate/subscription" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  Get Detailed Feedback with Premium
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CandidateDashboard;
