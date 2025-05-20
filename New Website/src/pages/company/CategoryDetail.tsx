
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Category, TalentPack } from '@/types/marketplace';
import { fetchCategory, fetchTalentPacks } from '@/services/marketplace';

const CategoryDetail: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [packs, setPacks] = useState<TalentPack[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadCategoryData = async () => {
      if (!categoryId) return;
      
      try {
        setLoading(true);
        const [categoryData, packsData] = await Promise.all([
          fetchCategory(categoryId),
          fetchTalentPacks(categoryId)
        ]);
        
        setCategory(categoryData);
        setPacks(packsData);
      } catch (err) {
        console.error('Error loading category data:', err);
        setError('Failed to load category data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCategoryData();
  }, [categoryId]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
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
  
  if (error || !category) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-red-500">{error || 'Category not found'}</p>
          <Link to="/company/marketplace" className="mt-4 inline-block">
            <Button variant="outline">Back to Marketplace</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/company/marketplace">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft size={16} />
            </Button>
          </Link>
          
          <div>
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-gray-600">{category.description}</p>
          </div>
        </div>
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-6">Available Talent Packs</h2>
          
          {packs.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p>No talent packs available in this category yet.</p>
              <Link to="/company/marketplace" className="mt-4 inline-block">
                <Button variant="outline" size="sm">Browse other categories</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packs.map((pack) => (
                <Card key={pack.id} className="overflow-hidden">
                  <div className="h-1.5 bg-gradient-to-r from-talent-primary to-talent-secondary"></div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{pack.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {category.name}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                        {pack.candidateCount} profiles
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">
                      {pack.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Minimum Score:</span>
                        <span className="font-medium">{pack.criteria.minimumScore || 'N/A'}+</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Avg. Experience:</span>
                        <span className="font-medium">{pack.stats.averageExperience} years</span>
                      </div>
                      
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Key Skills:</span>
                        <span className="font-medium truncate max-w-[180px]">
                          {pack.criteria.requiredSkills?.slice(0, 2).join(', ')}
                          {pack.criteria.requiredSkills && pack.criteria.requiredSkills.length > 2 && '...'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="text-lg font-semibold">
                      {formatCurrency(pack.price)}
                    </div>
                    <Link to={`/company/marketplace/pack/${pack.id}`}>
                      <Button>View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CategoryDetail;
