import { supabase } from '@/integrations/supabase/client';
import { 
  AdminStats, 
  Category, 
  CompanyStats, 
  RecentActivity, 
  TalentPack, 
  UserDetails 
} from '@/types/marketplace';

// Define the UserManagementFilters interface that was missing
export interface UserManagementFilters {
  role: string;
  status: string;
  searchQuery: string;
}

export async function fetchCategories(): Promise<Category[]> {
  console.log('Fetching categories from Supabase');
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    
    console.log('Categories fetched:', data);
    
    // Ensure we're properly mapping the database fields to our Category type
    return data.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description || '',
      iconName: category.icon_name || 'code',
    }));
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    return [];
  }
}

export async function fetchCategory(categoryId: string): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', categoryId)
    .single();
  
  if (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    iconName: data.icon_name || 'code',
  };
}

export async function fetchTalentPacks(categoryId?: string): Promise<TalentPack[]> {
  let query = supabase
    .from('talent_packs')
    .select(`
      *,
      categories:category_id (name),
      pack_candidates:pack_candidates(count)
    `);
  
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching talent packs:', error);
    throw error;
  }

  return data.map(pack => ({
    id: pack.id,
    name: pack.name,
    description: pack.description,
    categoryId: pack.category_id,
    categoryName: pack.categories?.name || '',
    candidateCount: pack.candidate_count || pack.pack_candidates?.length || 0,
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
}

export async function fetchFeaturedPacks(): Promise<TalentPack[]> {
  const { data, error } = await supabase
    .from('talent_packs')
    .select(`
      *,
      categories:category_id (name),
      pack_candidates:pack_candidates(count)
    `)
    .eq('is_featured', true);
  
  if (error) {
    console.error('Error fetching featured packs:', error);
    throw error;
  }

  return data.map(pack => ({
    id: pack.id,
    name: pack.name,
    description: pack.description,
    categoryId: pack.category_id,
    categoryName: pack.categories?.name || '',
    candidateCount: pack.candidate_count || pack.pack_candidates?.length || 0,
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
}

export async function fetchPackDetails(packId: string): Promise<TalentPack | null> {
  const { data, error } = await supabase
    .from('talent_packs')
    .select(`
      *,
      categories:category_id (name),
      pack_candidates:pack_candidates(count)
    `)
    .eq('id', packId)
    .single();
  
  if (error) {
    console.error('Error fetching pack details:', error);
    if (error.code === 'PGRST116') {
      return null; // Pack not found
    }
    throw error;
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    categoryId: data.category_id,
    categoryName: data.categories?.name || '',
    candidateCount: data.candidate_count || data.pack_candidates?.length || 0,
    price: Number(data.price),
    criteria: {
      minimumScore: data.minimum_score,
      minimumExperience: data.minimum_experience,
      requiredSkills: data.required_skills || [],
      educationLevel: data.education_level,
      otherCriteria: data.other_criteria || [],
    },
    stats: {
      averageScore: data.average_score || 0,
      averageExperience: data.average_experience || 0,
    },
    isFeatured: data.is_featured || false,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

export async function fetchAdminDashboardStats(): Promise<AdminStats> {
  try {
    // Fetch total candidates count
    const { count: totalCandidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true });
    
    if (candidatesError) throw candidatesError;
    
    // Fetch new candidates this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const { count: newCandidatesThisWeek, error: newCandidatesError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());
    
    if (newCandidatesError) throw newCandidatesError;
    
    // Fetch companies data
    const { count: totalCompanies, error: companiesError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true });
    
    if (companiesError) throw companiesError;
    
    // Fetch new companies this week
    const { count: newCompaniesThisWeek, error: newCompaniesError } = await supabase
      .from('companies')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString());
    
    if (newCompaniesError) throw newCompaniesError;
    
    // Fetch active packs
    const { count: activePacks, error: packsError } = await supabase
      .from('talent_packs')
      .select('*', { count: 'exact', head: true });
    
    if (packsError) throw packsError;
    
    // Fetch categories count
    const { count: categoriesCount, error: categoriesError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true });
    
    if (categoriesError) throw categoriesError;
    
    // Calculate monthly revenue from purchases
    const currentMonth = new Date();
    currentMonth.setDate(1); // First day of current month
    
    const { data: monthlyPurchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('price')
      .gte('purchase_date', currentMonth.toISOString());
    
    if (purchasesError) throw purchasesError;
    
    const monthlyRevenue = monthlyPurchases.reduce((sum, purchase) => sum + Number(purchase.price), 0);
    
    // For revenue change percentage, we'd need last month's data too
    // But for simplicity, let's just return a placeholder value
    const revenueChangePercentage = 12.3; // Placeholder
    
    return {
      totalCandidates: totalCandidates || 0,
      newCandidatesThisWeek: newCandidatesThisWeek || 0,
      totalCompanies: totalCompanies || 0,
      newCompaniesThisWeek: newCompaniesThisWeek || 0,
      activePacks: activePacks || 0,
      categoriesCount: categoriesCount || 0,
      monthlyRevenue,
      revenueChangePercentage,
    };
  } catch (error) {
    console.error('Error fetching admin dashboard stats:', error);
    // Return default values if there's an error
    return {
      totalCandidates: 0,
      newCandidatesThisWeek: 0,
      totalCompanies: 0,
      newCompaniesThisWeek: 0,
      activePacks: 0,
      categoriesCount: 0,
      monthlyRevenue: 0,
      revenueChangePercentage: 0,
    };
  }
}

export async function fetchCompanyDashboardStats(companyId: string): Promise<CompanyStats> {
  try {
    // Fetch total available packs
    const { count: availablePacks, error: packsError } = await supabase
      .from('talent_packs')
      .select('*', { count: 'exact', head: true });
    
    if (packsError) throw packsError;
    
    // Fetch distinct industries count
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id')
      .limit(100);
    
    if (categoriesError) throw categoriesError;
    
    // Fetch company's purchased packs
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .eq('company_id', companyId);
    
    if (purchasesError) throw purchasesError;
    
    // Calculate total candidates from purchases
    let totalCandidates = 0;
    if (purchases.length > 0) {
      const packIds = purchases.map(p => p.pack_id);
      const { data: packs, error: packDetailsError } = await supabase
        .from('talent_packs')
        .select('candidate_count')
        .in('id', packIds);
      
      if (packDetailsError) throw packDetailsError;
      
      totalCandidates = packs.reduce((sum, pack) => sum + (pack.candidate_count || 0), 0);
    }
    
    // For this example, we'll use placeholder values for viewed candidates
    // In a real application, you'd have a table tracking candidate profile views
    const viewedCandidates = Math.floor(totalCandidates * 0.3); // Placeholder: 30% viewed
    const viewedPercentage = totalCandidates > 0 ? (viewedCandidates / totalCandidates) * 100 : 0;
    
    // Get company subscription tier
    const { data: company, error: companyError } = await supabase
      .from('companies')
      .select('subscription_tier')
      .eq('id', companyId)
      .single();
    
    if (companyError) throw companyError;
    
    return {
      availablePacks: availablePacks || 0,
      industriesCount: categories.length || 0,
      purchasedPacks: purchases.length,
      totalCandidates,
      viewedCandidates,
      viewedPercentage,
      subscriptionTier: company?.subscription_tier || 'Basic',
    };
  } catch (error) {
    console.error('Error fetching company dashboard stats:', error);
    // Return default values if there's an error
    return {
      availablePacks: 0,
      industriesCount: 0,
      purchasedPacks: 0,
      totalCandidates: 0,
      viewedCandidates: 0,
      viewedPercentage: 0,
      subscriptionTier: 'Basic',
    };
  }
}

export async function fetchRecentActivities(limit: number = 5): Promise<RecentActivity[]> {
  try {
    // In a real app, you'd have a dedicated activities table
    // For this example, we'll combine recent packs and purchases
    
    // Get recent packs
    const { data: recentPacks, error: packsError } = await supabase
      .from('talent_packs')
      .select('id, name, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (packsError) throw packsError;
    
    // Get recent purchases
    const { data: recentPurchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('id, pack_id, company_id, purchase_date, companies:company_id(company_name)')
      .order('purchase_date', { ascending: false })
      .limit(limit);
    
    if (purchasesError) throw purchasesError;
    
    // Get pack names for purchases
    const packIds = recentPurchases.map(p => p.pack_id);
    const { data: purchasePacks, error: purchasePacksError } = await supabase
      .from('talent_packs')
      .select('id, name')
      .in('id', packIds);
    
    if (purchasePacksError) throw purchasePacksError;
    
    const packMap = purchasePacks.reduce((map, pack) => {
      map[pack.id] = pack.name;
      return map;
    }, {} as Record<string, string>);
    
    // Transform packs into activities
    const packActivities: RecentActivity[] = recentPacks.map(pack => ({
      id: `pack-${pack.id}`,
      action: 'Pack Created',
      description: `New pack created: "${pack.name}"`,
      timestamp: pack.created_at,
      status: 'success',
    }));
    
    // Transform purchases into activities
    const purchaseActivities: RecentActivity[] = recentPurchases.map(purchase => ({
      id: `purchase-${purchase.id}`,
      action: 'Pack Purchased',
      description: `"${packMap[purchase.pack_id] || 'Unknown pack'}" purchased by ${purchase.companies?.company_name || 'Unknown company'}`,
      timestamp: purchase.purchase_date,
      status: 'success',
    }));
    
    // Combine and sort activities
    const allActivities = [...packActivities, ...purchaseActivities]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
    
    return allActivities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
}

export async function fetchUsers(filters: UserManagementFilters): Promise<UserDetails[]> {
  try {
    let query = supabase
      .from('profiles')
      .select('id, email, full_name, role, created_at');
    
    if (filters.role && filters.role !== 'all') {
      query = query.eq('role', filters.role);
    }
    
    if (filters.searchQuery) {
      query = query.or(`email.ilike.%${filters.searchQuery}%,full_name.ilike.%${filters.searchQuery}%`);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data.map(profile => ({
      id: profile.id,
      email: profile.email,
      fullName: profile.full_name || '',
      role: profile.role,
      status: 'active', // We could derive this from last login or other fields
      lastLogin: null, // Updated since we can't access auth.users directly
      createdAt: profile.created_at,
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
}

// CRUD operations for categories
export async function createCategory(categoryData: Omit<Category, 'id'>): Promise<Category> {
  const { data, error } = await supabase
    .from('categories')
    .insert({
      name: categoryData.name,
      description: categoryData.description || '',
      icon_name: categoryData.iconName || 'folder'
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating category:', error);
    throw error;
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    iconName: data.icon_name || 'folder',
  };
}

export async function updateCategory(id: string, categoryData: Partial<Omit<Category, 'id'>>): Promise<Category> {
  const updateData: any = {};
  
  if (categoryData.name !== undefined) updateData.name = categoryData.name;
  if (categoryData.description !== undefined) updateData.description = categoryData.description;
  if (categoryData.iconName !== undefined) updateData.icon_name = categoryData.iconName;
  
  const { data, error } = await supabase
    .from('categories')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating category:', error);
    throw error;
  }
  
  return {
    id: data.id,
    name: data.name,
    description: data.description || '',
    iconName: data.icon_name || 'folder',
  };
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
}
