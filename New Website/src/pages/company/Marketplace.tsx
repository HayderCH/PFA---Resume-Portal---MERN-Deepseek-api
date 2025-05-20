import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, Loader2 } from 'lucide-react';
import CategoryGrid from '@/components/marketplace/CategoryGrid';
import FeaturedPacks from '@/components/marketplace/FeaturedPacks';
import { Category } from '@/types/marketplace';
import { fetchCategories, fetchFeaturedPacks } from '@/services/marketplace';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

const Marketplace: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Use React Query to fetch categories
  const { 
    data: categories = [], 
    isLoading: categoriesLoading, 
    error: categoriesError,
    refetch: refetchCategories
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Filter categories based on search query
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Use React Query to fetch featured packs
  const { 
    data: featuredPacks = [], 
    isLoading: packsLoading, 
    error: packsError 
  } = useQuery({
    queryKey: ['featuredPacks'],
    queryFn: fetchFeaturedPacks
  });
  
  // Handle errors
  useEffect(() => {
    if (categoriesError) {
      console.error('Error loading categories:', categoriesError);
      toast.error('Failed to load categories');
    }
    
    if (packsError) {
      console.error('Error loading featured packs:', packsError);
      toast.error('Failed to load featured packs');
    }
  }, [categoriesError, packsError]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Talent Marketplace</h1>
            <p className="text-gray-600">
              Browse and purchase curated talent packs by industry
            </p>
          </div>
          
          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="Search categories or packs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Tabs defaultValue="categories">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="featured">Featured Packs</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm" className="hidden md:flex items-center">
              <Filter size={16} className="mr-2" />
              <span>Filter</span>
            </Button>
          </div>
          
          <TabsContent value="categories" className="pt-6">
            {categoriesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-talent-primary animate-spin" />
              </div>
            ) : categoriesError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load categories. Please try again later.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => refetchCategories()}
                >
                  Try Again
                </Button>
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No categories found matching your search.</p>
              </div>
            ) : (
              <CategoryGrid categories={filteredCategories} />
            )}
          </TabsContent>
          
          <TabsContent value="featured" className="pt-6">
            {packsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-talent-primary animate-spin" />
              </div>
            ) : packsError ? (
              <div className="text-center py-12">
                <p className="text-red-500">Failed to load featured packs. Please try again later.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <FeaturedPacks />
            )}
          </TabsContent>
          
          <TabsContent value="recent" className="pt-6">
            <FeaturedPacks isRecent />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Marketplace;
