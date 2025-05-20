
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner';
import { Category } from '@/types/marketplace';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/services/marketplace';
import { Loader2, AlertCircle, Code, BarChart2 } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const CategoryManagement = () => {
  const [newCategory, setNewCategory] = useState({ name: '', description: '', iconName: 'code' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  // Use react-query properly
  const queryClient = useQueryClient();
  
  // Get categories
  const { data: categories = [], isLoading: isCategoriesLoading, isError: isCategoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });
  
  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: (newCategory: { name: string; description: string; iconName: string }) => {
      return createCategory(newCategory);
    },
    onSuccess: () => {
      toast.success('Category added successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory({ name: '', description: '', iconName: 'code' });
    },
    onError: (error: any) => {
      toast.error(`Error adding category: ${error.message}`);
    }
  });
  
  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: (category: Category) => {
      return updateCategory(category.id, category);
    },
    onSuccess: () => {
      toast.success('Category updated successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingCategory(null);
    },
    onError: (error: any) => {
      toast.error(`Error updating category: ${error.message}`);
    }
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteCategory(id);
    },
    onSuccess: () => {
      toast.success('Category deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setIsDeleteModalOpen(false);
    },
    onError: (error: any) => {
      toast.error(`Error deleting category: ${error.message}`);
    }
  });

  
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategoryMutation.mutate(newCategory);
  };
  
  const handleUpdateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateCategoryMutation.mutate(editingCategory);
    }
  };
  
  const handleDeleteCategory = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete);
    }
  };
  
  const iconOptions = [
    { value: 'code', label: 'Code' },
    { value: 'bar-chart-2', label: 'Bar Chart' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Add Category form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
          <CardDescription>Create a new category for talent packs</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddCategory} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="iconName">Icon</Label>
              <select
                id="iconName"
                className="w-full h-10 px-3 border rounded-md"
                value={newCategory.iconName}
                onChange={(e) => setNewCategory({ ...newCategory, iconName: e.target.value })}
              >
                {iconOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={addCategoryMutation.isPending}>
                {addCategoryMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  'Add Category'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Categories list */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>Manage existing categories</CardDescription>
        </CardHeader>
        <CardContent>
          {isCategoriesLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : isCategoriesError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to load categories</AlertDescription>
            </Alert>
          ) : categories.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">No categories found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between border p-4 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {/* Render icon dynamically */}
                      {category.iconName === 'code' && <Code size={20} />}
                      {category.iconName === 'bar-chart-2' && <BarChart2 size={20} />}
                      
                    </div>
                    <div>
                      <h3 className="font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditingCategory(category)}>
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => {
                        setCategoryToDelete(category.id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Modal */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update the category details</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateCategory}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="editName">Name</Label>
                  <Input
                    id="editName"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editDescription">Description</Label>
                  <Input
                    id="editDescription"
                    value={editingCategory.description || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editIconName">Icon</Label>
                  <select
                    id="editIconName"
                    className="w-full h-10 px-3 border rounded-md"
                    value={editingCategory.iconName}
                    onChange={(e) => setEditingCategory({ ...editingCategory, iconName: e.target.value })}
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditingCategory(null)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateCategoryMutation.isPending}>
                  {updateCategoryMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Delete Confirmation Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the category and all associated talent packs.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteCategory}
              disabled={deleteCategoryMutation.isPending}
              className="bg-destructive text-destructive-foreground"
            >
              {deleteCategoryMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManagement;
