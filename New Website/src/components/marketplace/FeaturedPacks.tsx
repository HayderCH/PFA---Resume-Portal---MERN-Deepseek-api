
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TalentPack } from '@/types/marketplace';
import { fetchFeaturedPacks, fetchTalentPacks } from '@/services/marketplace';
import { Loader2 } from 'lucide-react';

interface FeaturedPacksProps {
  isRecent?: boolean;
}

const FeaturedPacks: React.FC<FeaturedPacksProps> = ({ isRecent = false }) => {
  const [packs, setPacks] = useState<TalentPack[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPacks = async () => {
      try {
        setLoading(true);
        let packData: TalentPack[];
        
        if (isRecent) {
          // Fetch all packs and sort by most recent
          packData = await fetchTalentPacks();
          packData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else {
          // Fetch featured packs
          packData = await fetchFeaturedPacks();
        }
        
        setPacks(packData);
      } catch (err) {
        console.error('Error loading packs:', err);
        setError('Failed to load talent packs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadPacks();
  }, [isRecent]);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 text-talent-primary animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (packs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {isRecent ? 'No recent talent packs found.' : 'No featured talent packs found.'}
        </p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packs.map((pack) => (
        <Card key={pack.id} className="overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-talent-primary to-talent-secondary"></div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{pack.name}</CardTitle>
                <CardDescription className="mt-1">
                  {pack.categoryName}
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
  );
};

export default FeaturedPacks;
