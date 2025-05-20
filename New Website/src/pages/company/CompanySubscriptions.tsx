
import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Check, CreditCard } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const CompanySubscriptions = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const currentPlan = user?.companyDetails?.subscription_tier || 'basic';

  const features = {
    basic: [
      'Access to marketplace',
      'Basic talent search',
      'Standard pack purchases',
      'Email support'
    ],
    pro: [
      'Everything in Basic',
      'Industry-specific insights',
      'Talent supply/demand trends',
      'Salary benchmarks',
      'Enhanced visualizations',
      'Priority support'
    ],
    enterprise: [
      'Everything in Pro',
      'Custom reports',
      'Dedicated account manager',
      'Competitor talent analysis',
      'Predictive analytics',
      'Raw data access',
      'API integration'
    ]
  };

  const handleUpgrade = (plan: string) => {
    toast.info(`Upgrading to ${plan} plan. This feature will be implemented soon.`);
    // Upgrade implementation would go here
  };

  const handleManagePayment = () => {
    toast.info('Payment management will be implemented soon.');
    // Payment method management implementation would go here
  };

  // Mock billing data
  const billingHistory = [
    { id: 'INV-001', date: '2025-05-01', amount: '$299.00', status: 'Paid' },
    { id: 'INV-002', date: '2025-04-01', amount: '$299.00', status: 'Paid' }
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
        <p className="text-gray-600 mb-8">Manage your subscription plan and billing information</p>

        <Tabs defaultValue="plans">
          <TabsList className="mb-8">
            <TabsTrigger value="plans">Plans</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          {/* Plans Tab */}
          <TabsContent value="plans">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <Card className={currentPlan === 'basic' ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Basic</CardTitle>
                    {currentPlan === 'basic' && (
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <CardDescription>For startups and small businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-gray-600"> / month</span>
                  </div>
                  <ul className="space-y-2">
                    {features.basic.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {currentPlan === 'basic' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={() => handleUpgrade('basic')}>
                      Downgrade
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Pro Plan */}
              <Card className={currentPlan === 'pro' ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Pro</CardTitle>
                    {currentPlan === 'pro' && (
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <CardDescription>For growing businesses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$299</span>
                    <span className="text-gray-600"> / month</span>
                  </div>
                  <ul className="space-y-2">
                    {features.pro.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {currentPlan === 'pro' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : currentPlan === 'basic' ? (
                    <Button className="w-full" onClick={() => handleUpgrade('pro')}>
                      Upgrade
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full" onClick={() => handleUpgrade('pro')}>
                      Downgrade
                    </Button>
                  )}
                </CardFooter>
              </Card>

              {/* Enterprise Plan */}
              <Card className={currentPlan === 'enterprise' ? 'border-primary border-2' : ''}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Enterprise</CardTitle>
                    {currentPlan === 'enterprise' && (
                      <Badge variant="outline" className="bg-primary/20 text-primary border-primary">
                        Current Plan
                      </Badge>
                    )}
                  </div>
                  <CardDescription>For large organizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <span className="text-3xl font-bold">$999</span>
                    <span className="text-gray-600"> / month</span>
                  </div>
                  <ul className="space-y-2">
                    {features.enterprise.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <Check size={16} className="text-green-500 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {currentPlan === 'enterprise' ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => handleUpgrade('enterprise')}>
                      Upgrade
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Billing Tab */}
          <TabsContent value="billing">
            <div className="space-y-8">
              {/* Payment Method */}
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>Manage your payment details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center p-4 border rounded-md">
                    <CreditCard className="mr-4 h-8 w-8 text-gray-400" />
                    <div>
                      <p className="font-medium">VISA ending in 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/2026</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" onClick={handleManagePayment}>Update Payment Method</Button>
                </CardFooter>
              </Card>

              {/* Billing History */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing History</CardTitle>
                  <CardDescription>Your recent invoices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {billingHistory.map((invoice) => (
                          <tr key={invoice.id}>
                            <td className="px-4 py-3 text-sm font-medium text-blue-600">{invoice.id}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{invoice.date}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{invoice.amount}</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                {invoice.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Insights</CardTitle>
                <CardDescription>
                  Data and analytics based on your {currentPlan} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {currentPlan === 'basic' && (
                    <>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium mb-4">General Platform Activity</h3>
                        <p className="text-gray-600 mb-4">
                          Overall platform activity trends and basic industry insights.
                        </p>
                        <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          Basic visualization placeholder
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">
                          Upgrade for More Insights
                        </h3>
                        <p className="text-blue-700">
                          Upgrade to the Pro plan to access industry-specific insights, detailed trends, and advanced visualizations.
                        </p>
                        <Button className="mt-4" onClick={() => handleUpgrade('pro')}>
                          Upgrade to Pro
                        </Button>
                      </div>
                    </>
                  )}

                  {currentPlan === 'pro' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Industry Insights</h3>
                          <p className="text-gray-600 mb-4">
                            Detailed insights about your selected industries.
                          </p>
                          <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            Industry visualization placeholder
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Talent Supply & Demand</h3>
                          <p className="text-gray-600 mb-4">
                            Trends in talent availability in your chosen categories.
                          </p>
                          <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            Supply/demand chart placeholder
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Emerging Skills</h3>
                          <p className="text-gray-600 mb-4">
                            Trending skills in your industry sectors.
                          </p>
                          <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            Skills trend chart placeholder
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Salary Benchmarks</h3>
                          <p className="text-gray-600 mb-4">
                            Aggregated salary data for different roles.
                          </p>
                          <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            Salary benchmark chart placeholder
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-800 mb-2">
                          Need More Advanced Analytics?
                        </h3>
                        <p className="text-blue-700">
                          Upgrade to Enterprise for custom reports, predictive analytics, and a dedicated account manager.
                        </p>
                        <Button className="mt-4" onClick={() => handleUpgrade('enterprise')}>
                          Upgrade to Enterprise
                        </Button>
                      </div>
                    </>
                  )}

                  {currentPlan === 'enterprise' && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Custom Reports</h3>
                          <p className="text-gray-600 mb-4">
                            Your tailored reports based on specific requirements.
                          </p>
                          <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            Custom report placeholder
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Competitor Analysis</h3>
                          <p className="text-gray-600 mb-4">
                            Anonymized talent acquisition trends of competitors.
                          </p>
                          <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            Competitor chart placeholder
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Predictive Analytics</h3>
                          <p className="text-gray-600 mb-4">
                            Future talent availability forecasts for your industries.
                          </p>
                          <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            Prediction model placeholder
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <h3 className="text-lg font-medium mb-4">Raw Data Access</h3>
                          <p className="text-gray-600 mb-4">
                            Access to aggregated data feeds for your own analysis.
                          </p>
                          <div className="h-64 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                            Data feed example placeholder
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-green-50 p-6 rounded-lg">
                        <h3 className="text-lg font-medium text-green-800 mb-2">
                          Contact Your Account Manager
                        </h3>
                        <p className="text-green-700 mb-4">
                          Need custom analytics or have specific requirements? Your dedicated account manager is here to help.
                        </p>
                        <div className="flex items-center p-4 bg-white rounded-lg border border-green-200">
                          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                            <span className="text-green-700 font-bold">AM</span>
                          </div>
                          <div>
                            <p className="font-medium">Alex Morgan</p>
                            <p className="text-sm text-gray-600">alex.morgan@talentpulse.example</p>
                            <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default CompanySubscriptions;
