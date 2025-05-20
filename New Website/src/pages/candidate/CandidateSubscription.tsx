
import React from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const CandidateSubscription = () => {
  const { user } = useAuth();
  const isPremium = user?.candidateDetails?.subscriptionTier === 'premium';

  const freeFeatures = [
    'Basic profile management',
    'CV upload',
    'Basic credibility test',
    'Standard visibility to companies',
    'General job recommendations'
  ];

  const premiumFeatures = [
    'Everything in Free',
    'Detailed skill analysis',
    'Personalized improvement recommendations',
    'Score breakdown insights',
    'Industry trend reports',
    'Salary benchmarks',
    'Enhanced profile visibility',
    'Priority support'
  ];

  const handleSubscribe = () => {
    toast.info('Premium subscription processing. This feature will be implemented soon.');
    // Subscription implementation would go here
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Premium Subscription</h1>
        <p className="text-gray-600 mb-8">Upgrade your profile and access detailed insights</p>

        <Tabs defaultValue={isPremium ? "insights" : "plans"}>
          <TabsList className="mb-8">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            {isPremium && <TabsTrigger value="insights">Insights</TabsTrigger>}
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Free Plan */}
              <Card className={!isPremium ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Free</CardTitle>
                    {!isPremium && (
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <CardDescription>Basic candidate features</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-gray-600"> / month</span>
                  </div>
                  <ul className="space-y-2">
                    {freeFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled>
                    Current Plan
                  </Button>
                </CardFooter>
              </Card>

              {/* Premium Plan */}
              <Card className={isPremium ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Premium</CardTitle>
                    {isPremium && (
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <CardDescription>Enhanced candidate features with insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$9.99</span>
                    <span className="text-gray-600"> / month</span>
                  </div>
                  <ul className="space-y-2">
                    {premiumFeatures.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {isPremium ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={handleSubscribe}>
                      Subscribe Now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>

            {/* Benefits Section */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Why Upgrade to Premium?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Get comprehensive feedback on your skills, test performance, and specific areas for improvement.
                      Understand exactly why you received your scores and how to improve them.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Industry Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Access up-to-date industry reports relevant to your skills and experience.
                      Stay informed about evolving skill requirements and job market changes.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Enhanced Visibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Premium members gain enhanced visibility with employers.
                      Your profile will receive priority placement in search results with equal scores.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Insights Tab (Only for Premium) */}
          <TabsContent value="insights">
            {isPremium ? (
              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Score Breakdown</CardTitle>
                    <CardDescription>Detailed analysis of your credibility score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Technical Skills</span>
                          <span>75/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Your technical skills score is above average, but there's room for improvement in cloud technologies and CI/CD practices.
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Practical Experience</span>
                          <span>82/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Strong practical experience, particularly in project implementation. Consider more complex or larger-scale projects.
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Problem Solving</span>
                          <span>68/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '68%' }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Your problem-solving approach shows promise but lacks systematic methodology. Consider practicing algorithmic thinking.
                        </p>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">Communication</span>
                          <span>90/100</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          Excellent communication skills demonstrated through clear explanations and well-structured responses.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Personalized Recommendations</CardTitle>
                    <CardDescription>Based on your profile and test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border rounded-lg bg-blue-50">
                        <h3 className="font-medium text-blue-700">Skill Development</h3>
                        <p className="mt-1 text-gray-700">
                          Consider focusing on cloud computing technologies such as AWS or Azure to complement your
                          existing backend development skills. We've noticed this is increasingly required in your industry.
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-green-50">
                        <h3 className="font-medium text-green-700">Experience Building</h3>
                        <p className="mt-1 text-gray-700">
                          Adding open-source contributions to your portfolio would strengthen your practical experience score.
                          Consider contributing to projects related to your core skills.
                        </p>
                      </div>

                      <div className="p-4 border rounded-lg bg-amber-50">
                        <h3 className="font-medium text-amber-700">Test Preparation</h3>
                        <p className="mt-1 text-gray-700">
                          Your problem-solving score could be improved with practice. We recommend working on algorithmic challenges
                          on platforms like LeetCode or HackerRank, focusing on medium difficulty problems.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Industry Trends</CardTitle>
                    <CardDescription>Insights relevant to your profile</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium text-lg mb-2">Emerging Skills in Your Field</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Kubernetes</span>
                              <Badge>High Demand</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              +124% job listings in the past year
                            </p>
                          </div>
                          
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">GraphQL</span>
                              <Badge>Growing</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              +78% job listings in the past year
                            </p>
                          </div>
                          
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Data Pipelines</span>
                              <Badge>High Demand</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              +92% job listings in the past year
                            </p>
                          </div>
                          
                          <div className="p-3 border rounded-md">
                            <div className="flex justify-between items-center">
                              <span className="font-medium">Terraform</span>
                              <Badge>Growing</Badge>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              +63% job listings in the past year
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-medium text-lg mb-2">Salary Benchmarks</h3>
                        <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                          Salary chart placeholder - shows your position relative to market rates
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">Premium Subscription Required</h3>
                <p className="text-gray-600 mb-6">
                  You need to subscribe to the Premium plan to access detailed insights.
                </p>
                <Button onClick={handleSubscribe}>Subscribe Now</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CandidateSubscription;
