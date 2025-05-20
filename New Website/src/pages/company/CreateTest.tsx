
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Category } from '@/types/marketplace';
import { createCompanyTest, addQuestionsToTest } from '@/services/companyTests';
import { fetchCategories } from '@/services/marketplace'; 
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

// Define the form schema
const testSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().optional(),
  categoryId: z.string().min(1, 'Please select a category'),
  questions: z.array(z.object({
    questionText: z.string().min(5, 'Question must be at least 5 characters'),
    questionType: z.enum(['text', 'multiple_choice', 'rating']),
    expectedAnswer: z.string().optional(),
    scoringCriteria: z.string().optional()
  })).min(1, 'Add at least one question')
});

type TestFormValues = z.infer<typeof testSchema>;

const CreateTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Use React Query to fetch categories
  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const form = useForm<TestFormValues>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: '',
      description: '',
      categoryId: '',
      questions: [{ 
        questionText: '', 
        questionType: 'text',
        expectedAnswer: '',
        scoringCriteria: ''
      }]
    }
  });

  const addQuestion = () => {
    const currentQuestions = form.getValues().questions || [];
    form.setValue('questions', [
      ...currentQuestions, 
      { 
        questionText: '', 
        questionType: 'text',
        expectedAnswer: '',
        scoringCriteria: ''
      }
    ]);
  };

  const removeQuestion = (index: number) => {
    const currentQuestions = form.getValues().questions;
    if (currentQuestions.length <= 1) {
      toast.error("Test must have at least one question");
      return;
    }
    
    const updatedQuestions = [...currentQuestions];
    updatedQuestions.splice(index, 1);
    form.setValue('questions', updatedQuestions);
  };

  const onSubmit = async (values: TestFormValues) => {
    try {
      setLoading(true);
      
      // Create the test
      const testId = await createCompanyTest({
        title: values.title,
        description: values.description,
        categoryId: values.categoryId
      });
      
      // Add questions with all required fields
      const questionsWithIndex = values.questions.map((q, index) => ({
        questionText: q.questionText,
        questionType: q.questionType,
        expectedAnswer: q.expectedAnswer || '',
        scoringCriteria: q.scoringCriteria || '',
        orderIndex: index
      }));
      
      await addQuestionsToTest(testId, questionsWithIndex);
      
      toast.success('Test created successfully');
      navigate('/company/tests');
    } catch (error) {
      console.error('Error creating test:', error);
      toast.error('Failed to create test');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/company/tests')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tests
        </Button>
        
        <h1 className="text-3xl font-bold mb-6">Create Credibility Test</h1>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Test Information</CardTitle>
                <CardDescription>
                  Provide basic information about your credibility test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Test Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Software Development Skills Assessment" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what this test evaluates..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      {categoriesLoading ? (
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading categories...</span>
                        </div>
                      ) : categoriesError ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Error</AlertTitle>
                          <AlertDescription>
                            Failed to load categories. Please try again.
                          </AlertDescription>
                        </Alert>
                      ) : (
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.length === 0 ? (
                              <div className="p-2 text-center text-gray-500">No categories found</div>
                            ) : (
                              categories.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                  {category.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Test Questions</CardTitle>
                  <CardDescription>
                    Add questions to evaluate candidate credibility
                  </CardDescription>
                </div>
                <Button type="button" onClick={addQuestion} variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Add Question
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {form.formState.errors.questions?.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {form.formState.errors.questions.root.message}
                    </AlertDescription>
                  </Alert>
                )}
                
                {form.watch('questions')?.map((_, index) => (
                  <div key={index} className="p-4 border rounded-md">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Question {index + 1}</h3>
                      <Button 
                        type="button"
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeQuestion(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`questions.${index}.questionText`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Textarea {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`questions.${index}.questionType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="text">Text Response</SelectItem>
                                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                                <SelectItem value="rating">Rating Scale</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`questions.${index}.expectedAnswer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expected Answer (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="What would an ideal answer look like?" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`questions.${index}.scoringCriteria`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scoring Criteria (Optional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How should this question be scored?" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important</AlertTitle>
              <AlertDescription>
                Your test will be reviewed by an administrator before it becomes available to candidates.
              </AlertDescription>
            </Alert>
            
            <div className="flex justify-end space-x-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/company/tests')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Test'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </DashboardLayout>
  );
};

export default CreateTest;
