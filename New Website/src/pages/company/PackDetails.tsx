
import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { ArrowLeft, ChevronRight, Check, Loader2 } from 'lucide-react';
import { TalentPack } from '@/types/marketplace';
import { fetchPackDetails } from '@/services/marketplace';

const PackDetails: React.FC = () => {
  const { packId } = useParams<{ packId: string }>();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [packDetails, setPackDetails] = useState<TalentPack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPackDetails = async () => {
      if (!packId) return;
      
      try {
        setLoading(true);
        const data = await fetchPackDetails(packId);
        
        if (!data) {
          setError('Pack not found');
          return;
        }
        
        setPackDetails(data);
      } catch (err) {
        console.error('Error loading pack details:', err);
        setError('Failed to load pack details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPackDetails();
  }, [packId]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  const handleAddToCart = () => {
    setIsAddingToCart(true);
    setTimeout(() => {
      setIsAddingToCart(false);
      toast.success(`"${packDetails?.name}" added to cart!`);
    }, 1000);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 text-talent-primary animate-spin" />
        </div>
      </DashboardLayout>
    );
  }
  
  if (error || !packDetails) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">{error || 'Pack not found'}</p>
          <Link to="/company/marketplace" className="mt-4 inline-block">
            <Button variant="outline">Back to Marketplace</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  // Mock data for visualization - would come from real data in full implementation
  const scoreDistribution = [
    { range: '95-100', count: Math.round(packDetails.candidateCount * 0.15) },
    { range: '90-94', count: Math.round(packDetails.candidateCount * 0.35) },
    { range: '85-89', count: Math.round(packDetails.candidateCount * 0.50) },
  ];
  
  const topSkills = packDetails.criteria.requiredSkills
    ? packDetails.criteria.requiredSkills.map((skill, index) => ({
        skill,
        count: Math.round(packDetails.candidateCount * (0.95 - index * 0.1))
      })).slice(0, 5)
    : [];
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center">
            <Link to="/company/marketplace" className="mr-4">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ArrowLeft size={16} />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">{packDetails.name}</h1>
              <div className="flex items-center text-sm text-gray-600">
                <Link to="/company/marketplace" className="hover:text-talent-primary">
                  Categories
                </Link>
                <ChevronRight size={14} className="mx-1" />
                <Link to={`/company/marketplace/category/${packDetails.categoryId}`} className="hover:text-talent-primary">
                  {packDetails.categoryName}
                </Link>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-xl font-bold">
              {formatCurrency(packDetails.price)}
            </div>
            <Button onClick={handleAddToCart} disabled={isAddingToCart}>
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pack Details</CardTitle>
                <CardDescription>
                  Comprehensive information about this talent pack
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700">{packDetails.description}</p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Selection Criteria</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Minimum Score:</span>
                        <span className="font-medium">{packDetails.criteria.minimumScore || 'N/A'}+</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Minimum Experience:</span>
                        <span className="font-medium">{packDetails.criteria.minimumExperience || 'N/A'}+ years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Education:</span>
                        <span className="font-medium">{packDetails.criteria.educationLevel || 'Not specified'}</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm text-gray-600 mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {packDetails.criteria.requiredSkills?.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                            {skill}
                          </Badge>
                        )) || 'No specific skills required'}
                      </div>
                    </div>
                  </div>
                  
                  {packDetails.criteria.otherCriteria && packDetails.criteria.otherCriteria.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm text-gray-600 mb-2">Additional Criteria:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {packDetails.criteria.otherCriteria.map((criteria, index) => (
                          <li key={index} className="text-sm">{criteria}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-3">Top Skills Distribution</h3>
                  <div className="space-y-3">
                    {topSkills.map((skillData, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{skillData.skill}</span>
                          <span>{skillData.count} candidates ({Math.round((skillData.count / packDetails.candidateCount) * 100)}%)</span>
                        </div>
                        <Progress value={(skillData.count / packDetails.candidateCount) * 100} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pack Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Candidates:</span>
                  <span className="font-medium">{packDetails.candidateCount}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Score:</span>
                  <span className="font-medium">{packDetails.stats.averageScore}/100</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Avg. Experience:</span>
                  <span className="font-medium">{packDetails.stats.averageExperience} years</span>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="text-sm font-medium mb-3">Score Distribution</h4>
                  {scoreDistribution.map((range, index) => (
                    <div key={index} className="flex justify-between items-center text-sm mb-2">
                      <span>{range.range}</span>
                      <span className="font-medium">{range.count} candidates</span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="pt-2">
                  <div className="text-xl font-bold text-center mb-4">
                    {formatCurrency(packDetails.price)}
                  </div>
                  <Button className="w-full" onClick={handleAddToCart} disabled={isAddingToCart}>
                    {isAddingToCart ? 'Adding...' : 'Add to Cart'}
                  </Button>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-start">
                      <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Full access to all {packDetails.candidateCount} candidate profiles</p>
                    </div>
                    <div className="flex items-start">
                      <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Detailed candidate assessment data</p>
                    </div>
                    <div className="flex items-start">
                      <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Direct contact information</p>
                    </div>
                    <div className="flex items-start">
                      <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <p className="text-sm">CSV/JSON data export</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PackDetails;
