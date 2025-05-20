
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { TalentPack, Category } from '@/types/marketplace';

// Form validation schema
const packFormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  categoryId: z.string().min(1, 'You must select a category'),
  price: z.coerce.number().positive('Price must be a positive number'),
  minimumScore: z.coerce.number().min(0).max(100).optional(),
  minimumExperience: z.coerce.number().min(0).optional(),
  requiredSkills: z.string().optional(),
  educationLevel: z.string().optional(),
  otherCriteria: z.string().optional(),
  isFeatured: z.boolean().default(false),
});

type PackFormValues = z.infer<typeof packFormSchema>;

export const PackManagement: React.FC = () => {
  const [packs, setPacks] = useState<TalentPack[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPack, setEditingPack] = useState<TalentPack | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Initialize form
  const form = useForm<PackFormValues>({
    resolver: zodResolver(packFormSchema),
    defaultValues: {
      name: '',
      description: '',
      categoryId: '',
      price: 0,
      minimumScore: 80,
      minimumExperience: 2,
      requiredSkills: '',
      educationLevel: '',
      otherCriteria: '',
      isFeatured: false,
    },
  });

  // Load packs and categories data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      try {
        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('*')
          .order('name');
        
        if (categoriesError) throw categoriesError;
        
        // Fetch talent packs
        const { data: packsData, error: packsError } = await supabase
          .from('talent_packs')
          .select(`
            *,
            categories:category_id (name)
          `)
          .order('name');
        
        if (packsError) throw packsError;
        
        // Transform data to match our types
        const transformedCategories = categoriesData.map(category => ({
          id: category.id,
          name: category.name,
          description: category.description || '',
          iconName: category.icon_name || 'code',
        }));
        
        const transformedPacks = packsData.map(pack => ({
          id: pack.id,
          name: pack.name,
          description: pack.description,
          categoryId: pack.category_id,
          categoryName: pack.categories?.name || '',
          candidateCount: pack.candidate_count || 0,
          price: Number(pack.price),
          criteria: {
            minimumScore: pack.minimum_score,
            minimumExperience: pack.minimum_experience,
            requiredSkills: pack.required_skills || [],
            educationLevel: pack.education_level,
            otherCriteria: pack.other_criteria || [],
          },
          stats: {
            averageScore: pack.average_score || 0,
            averageExperience: pack.average_experience || 0,
          },
          isFeatured: pack.is_featured || false,
          createdAt: pack.created_at,
          updatedAt: pack.updated_at,
        }));
        
        setCategories(transformedCategories);
        setPacks(transformedPacks);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Handle form submission
  const onSubmit = async (values: PackFormValues) => {
    try {
      // Convert string to arrays
      const requiredSkills = values.requiredSkills ? 
        values.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : 
        [];
      
      const otherCriteria = values.otherCriteria ? 
        values.otherCriteria.split('\n').map(s => s.trim()).filter(Boolean) : 
        [];
      
      const packData = {
        name: values.name,
        description: values.description,
        category_id: values.categoryId,
        price: values.price,
        minimum_score: values.minimumScore || null,
        minimum_experience: values.minimumExperience || null,
        required_skills: requiredSkills,
        education_level: values.educationLevel || null,
        other_criteria: otherCriteria,
        is_featured: values.isFeatured,
      };
      
      let result;
      
      if (editingPack) {
        // Update existing pack
        const { data, error } = await supabase
          .from('talent_packs')
          .update(packData)
          .eq('id', editingPack.id)
          .select();
        
        if (error) throw error;
        result = data[0];
        
        toast.success('Talent pack updated successfully');
      } else {
        // Create new pack
        const { data, error } = await supabase
          .from('talent_packs')
          .insert(packData)
          .select();
        
        if (error) throw error;
        result = data[0];
        
        toast.success('Talent pack created successfully');
      }
      
      // Refresh the packs list
      const category = categories.find(c => c.id === result.category_id);
      
      const newPack: TalentPack = {
        id: result.id,
        name: result.name,
        description: result.description,
        categoryId: result.category_id,
        categoryName: category?.name || '',
        candidateCount: result.candidate_count || 0,
        price: Number(result.price),
        criteria: {
          minimumScore: result.minimum_score,
          minimumExperience: result.minimum_experience,
          requiredSkills: result.required_skills || [],
          educationLevel: result.education_level,
          otherCriteria: result.other_criteria || [],
        },
        stats: {
          averageScore: result.average_score || 0,
          averageExperience: result.average_experience || 0,
        },
        isFeatured: result.is_featured || false,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
      };
      
      if (editingPack) {
        setPacks(packs.map(p => p.id === newPack.id ? newPack : p));
      } else {
        setPacks([...packs, newPack]);
      }
      
      // Close dialog and reset form
      setDialogOpen(false);
      setEditingPack(null);
      form.reset();
    } catch (error) {
      console.error('Error saving talent pack:', error);
      toast.error('Failed to save talent pack');
    }
  };

  // Handle pack deletion
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    
    try {
      const { error } = await supabase
        .from('talent_packs')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPacks(packs.filter(pack => pack.id !== id));
      toast.success('Talent pack deleted successfully');
    } catch (error) {
      console.error('Error deleting talent pack:', error);
      toast.error('Failed to delete talent pack');
    } finally {
      setDeletingId(null);
    }
  };

  // Handle toggling featured status
  const handleToggleFeatured = async (pack: TalentPack) => {
    try {
      const newStatus = !pack.isFeatured;
      
      const { error } = await supabase
        .from('talent_packs')
        .update({ is_featured: newStatus })
        .eq('id', pack.id);
      
      if (error) throw error;
      
      setPacks(packs.map(p => p.id === pack.id ? { ...p, isFeatured: newStatus } : p));
      
      toast.success(`Pack ${newStatus ? 'added to' : 'removed from'} featured collection`);
    } catch (error) {
      console.error('Error updating featured status:', error);
      toast.error('Failed to update featured status');
    }
  };

  // Open edit dialog
  const openEditDialog = (pack: TalentPack) => {
    setEditingPack(pack);
    
    form.reset({
      name: pack.name,
      description: pack.description,
      categoryId: pack.categoryId,
      price: pack.price,
      minimumScore: pack.criteria.minimumScore || undefined,
      minimumExperience: pack.criteria.minimumExperience || undefined,
      requiredSkills: pack.criteria.requiredSkills ? pack.criteria.requiredSkills.join(', ') : '',
      educationLevel: pack.criteria.educationLevel || '',
      otherCriteria: pack.criteria.otherCriteria ? pack.criteria.otherCriteria.join('\n') : '',
      isFeatured: pack.isFeatured || false,
    });
    
    setDialogOpen(true);
  };

  // Open create dialog
  const openCreateDialog = () => {
    setEditingPack(null);
    form.reset({
      name: '',
      description: '',
      categoryId: '',
      price: 1000,
      minimumScore: 80,
      minimumExperience: 2,
      requiredSkills: '',
      educationLevel: '',
      otherCriteria: '',
      isFeatured: false,
    });
    setDialogOpen(true);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Talent Packs</h2>
        <Button onClick={openCreateDialog} className="flex items-center">
          <Plus size={16} className="mr-2" />
          Add New Pack
        </Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-talent-primary animate-spin" />
        </div>
      ) : packs.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-gray-500 mb-4">No talent packs found</p>
            <Button onClick={openCreateDialog}>Create Your First Pack</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-center">Featured</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {packs.map((pack) => (
                  <TableRow key={pack.id}>
                    <TableCell>
                      <div className="font-medium">{pack.name}</div>
                      <div className="text-sm text-gray-500">
                        {pack.candidateCount} candidates
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{pack.categoryName}</Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(pack.price)}</TableCell>
                    <TableCell className="text-center">
                      <Switch 
                        checked={pack.isFeatured} 
                        onCheckedChange={() => handleToggleFeatured(pack)}
                        aria-label="Toggle featured status"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" onClick={() => openEditDialog(pack)}>
                          <Edit size={16} />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="text-red-500 hover:text-red-700" 
                          onClick={() => handleDelete(pack.id)}
                          disabled={deletingId === pack.id}
                        >
                          {deletingId === pack.id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPack ? 'Edit Talent Pack' : 'Create Talent Pack'}</DialogTitle>
            <DialogDescription>
              {editingPack ? 'Edit the details of this talent pack' : 'Fill in the details to create a new talent pack'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pack Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Senior React Developers" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="100" {...field} />
                      </FormControl>
                      <FormDescription>Price in USD</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe this talent pack..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Selection Criteria */}
                <div className="md:col-span-2">
                  <h3 className="text-md font-medium mb-4">Selection Criteria</h3>
                </div>
                
                <FormField
                  control={form.control}
                  name="minimumScore"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Score</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" max="100" {...field} />
                      </FormControl>
                      <FormDescription>Minimum score out of 100</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minimumExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Experience</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" {...field} />
                      </FormControl>
                      <FormDescription>Minimum years of experience</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="requiredSkills"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Required Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="React, TypeScript, Node.js (comma separated)" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of required skills</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="educationLevel"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Education Level</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Bachelor's degree or higher" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="otherCriteria"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Other Criteria</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Each line will be a separate criterion" {...field} />
                      </FormControl>
                      <FormDescription>Enter each criterion on a new line</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="isFeatured"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured Pack</FormLabel>
                        <FormDescription>
                          Featured packs appear prominently in the marketplace
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">{editingPack ? 'Update Pack' : 'Create Pack'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PackManagement;
