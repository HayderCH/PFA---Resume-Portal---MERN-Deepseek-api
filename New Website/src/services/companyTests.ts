
import { supabase } from '@/integrations/supabase/client';
import { CompanyTest, TestQuestion } from '@/types/marketplace';
import { toast } from 'sonner';

// Fetch all tests for the logged-in company
export async function fetchCompanyTests() {
  try {
    const { data, error } = await supabase
      .from('company_tests')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format data for frontend
    return data.map(test => ({
      id: test.id,
      companyId: test.company_id,
      title: test.title,
      description: test.description,
      categoryId: test.category_id,
      categoryName: test.categories?.name,
      status: test.status as 'pending' | 'approved' | 'rejected',
      createdAt: test.created_at,
      updatedAt: test.updated_at
    })) as CompanyTest[];
  } catch (error: any) {
    console.error('Error fetching company tests:', error);
    toast.error('Failed to load tests');
    return [];
  }
}

// Fetch a specific test with its questions
export async function fetchTestWithQuestions(testId: string) {
  try {
    // First fetch the test
    const { data: testData, error: testError } = await supabase
      .from('company_tests')
      .select('*, categories(name)')
      .eq('id', testId)
      .single();

    if (testError) throw testError;

    // Then fetch the questions
    const { data: questionsData, error: questionsError } = await supabase
      .from('test_questions')
      .select('*')
      .eq('test_id', testId)
      .order('order_index', { ascending: true });

    if (questionsError) throw questionsError;

    // Format the test
    const test: CompanyTest = {
      id: testData.id,
      companyId: testData.company_id,
      title: testData.title,
      description: testData.description,
      categoryId: testData.category_id,
      categoryName: testData.categories?.name,
      status: testData.status as 'pending' | 'approved' | 'rejected',
      createdAt: testData.created_at,
      updatedAt: testData.updated_at,
      questions: questionsData.map(q => ({
        id: q.id,
        testId: q.test_id,
        questionText: q.question_text,
        questionType: q.question_type as 'text' | 'multiple_choice' | 'rating',
        expectedAnswer: q.expected_answer,
        scoringCriteria: q.scoring_criteria,
        orderIndex: q.order_index,
        createdAt: q.created_at
      }))
    };

    return test;
  } catch (error: any) {
    console.error('Error fetching test with questions:', error);
    toast.error('Failed to load test details');
    return null;
  }
}

// Create a new test
export async function createCompanyTest(testData: Omit<CompanyTest, 'id' | 'companyId' | 'createdAt' | 'updatedAt' | 'status'>) {
  try {
    // Get the current user's ID
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('User not authenticated');
    
    // First check if this user has a company record
    const { data: companyData, error: companyError } = await supabase
      .from('companies')
      .select('id')
      .eq('id', user.id)
      .single();

    if (companyError || !companyData) {
      // If there's no company record, create one
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile && profile.role === 'company') {
        // Create a new company record
        const { data: newCompany, error: createError } = await supabase
          .from('companies')
          .insert({
            id: user.id,
            company_name: profile.full_name || 'Company',
            contact_name: profile.full_name
          })
          .select()
          .single();

        if (createError) throw createError;
      } else {
        throw new Error('User is not registered as a company');
      }
    }
    
    // Now create the test
    const { data, error } = await supabase
      .from('company_tests')
      .insert({
        company_id: user.id,
        title: testData.title,
        description: testData.description,
        category_id: testData.categoryId,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    
    return data.id as string;
  } catch (error: any) {
    console.error('Error creating test:', error);
    toast.error('Failed to create test: ' + error.message);
    throw error;
  }
}

// Add questions to a test
export async function addQuestionsToTest(testId: string, questions: Omit<TestQuestion, 'id' | 'testId' | 'createdAt'>[]) {
  try {
    // Ensure all required fields are present in each question
    const formattedQuestions = questions.map(q => ({
      test_id: testId,
      question_text: q.questionText,
      question_type: q.questionType,
      expected_answer: q.expectedAnswer,
      scoring_criteria: q.scoringCriteria,
      order_index: q.orderIndex
    }));

    const { error } = await supabase
      .from('test_questions')
      .insert(formattedQuestions);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error adding questions:', error);
    toast.error('Failed to add questions to test');
    throw error;
  }
}

// Update a test's status (for admins)
export async function updateTestStatus(testId: string, status: 'approved' | 'rejected') {
  try {
    const { error } = await supabase
      .from('company_tests')
      .update({ status })
      .eq('id', testId);

    if (error) throw error;
    
    return true;
  } catch (error: any) {
    console.error('Error updating test status:', error);
    toast.error('Failed to update test status');
    return false;
  }
}

// Fetch all tests for admin review
export async function fetchAllTestsForAdmin() {
  try {
    const { data, error } = await supabase
      .from('company_tests')
      .select('*, categories(name), companies(company_name)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format data for frontend
    return data.map(test => ({
      id: test.id,
      companyId: test.company_id,
      companyName: test.companies?.company_name,
      title: test.title,
      description: test.description,
      categoryId: test.category_id,
      categoryName: test.categories?.name,
      status: test.status as 'pending' | 'approved' | 'rejected',
      createdAt: test.created_at,
      updatedAt: test.updated_at
    })) as (CompanyTest & { companyName?: string })[];
  } catch (error: any) {
    console.error('Error fetching tests for admin:', error);
    toast.error('Failed to load tests for review');
    return [];
  }
}

// Fetch approved tests for a specific category (for candidates)
export async function fetchApprovedTestsForCategory(categoryId: string) {
  try {
    const { data, error } = await supabase
      .from('company_tests')
      .select('*, categories(name), companies(company_name)')
      .eq('category_id', categoryId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Format data for frontend
    return data.map(test => ({
      id: test.id,
      companyId: test.company_id,
      companyName: test.companies?.company_name,
      title: test.title,
      description: test.description,
      categoryId: test.category_id,
      categoryName: test.categories?.name,
      status: test.status as 'pending' | 'approved' | 'rejected',
      createdAt: test.created_at,
      updatedAt: test.updated_at
    })) as (CompanyTest & { companyName?: string })[];
  } catch (error: any) {
    console.error('Error fetching approved tests:', error);
    toast.error('Failed to load tests');
    return [];
  }
}
