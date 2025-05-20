
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, AuthUser, CandidateSignupData, CompanySignupData, UserRole } from '@/types/auth';

// Create context
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  signupCandidate: async () => {},
  signupCompany: async () => {},
  loading: false,
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (profile) {
            let userData: AuthUser = {
              id: session.user.id,
              email: session.user.email || '',
              role: profile.role as UserRole,
              fullName: profile.full_name || '',
            };
            
            // If user is a candidate, get additional details
            if (profile.role === 'candidate') {
              const { data: candidateData } = await supabase
                .from('candidates')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (candidateData) {
                userData.candidateDetails = {
                  fullName: candidateData.full_name || profile.full_name || '',
                  // Explicitly cast the profile_status to the expected type
                  profileStatus: candidateData.profile_status as "incomplete" | "cv_uploaded" | "data_verified" | "test_completed" | "complete",
                  cvUrl: candidateData.cv_url,
                  category: candidateData.category,
                  overallScore: candidateData.overall_score,
                };
                console.log("Loaded candidate details:", userData.candidateDetails);
              } else {
                console.log("No candidate record found, creating one");
                
                // Create a candidate record if it doesn't exist
                const { error: candidateError } = await supabase
                  .from('candidates')
                  .insert({
                    id: session.user.id,
                    full_name: profile.full_name || '',
                    email: profile.email || '',
                    profile_status: 'incomplete'
                  });
                  
                if (candidateError) {
                  console.error("Error creating candidate record:", candidateError);
                } else {
                  // Set default candidate details
                  userData.candidateDetails = {
                    fullName: profile.full_name || '',
                    profileStatus: 'incomplete',
                    cvUrl: undefined,
                    category: undefined,
                    overallScore: undefined
                  };
                }
              }
            } 
            // If user is a company, get additional details
            else if (profile.role === 'company') {
              const { data: companyData } = await supabase
                .from('companies')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (companyData) {
                userData.companyDetails = {
                  companyName: companyData.company_name,
                  contactName: companyData.contact_name || '',
                  industry: companyData.industry,
                  size: companyData.size
                };
              }
            }
            
            setUser(userData);
          }
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.info('Auth state changed:', event, session?.user?.id);
      if (session) {
        fetchUser();
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();
          
        if (profile) {
          if (profile.role === 'candidate') {
            navigate('/candidate/dashboard');
          } else if (profile.role === 'company') {
            navigate('/company/dashboard');
          } else if (profile.role === 'admin') {
            navigate('/admin/dashboard');
          }
        }
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
      setUser(null);
      navigate('/');
    } catch (error: any) {
      toast.error(error.message || 'Failed to logout');
      console.error('Logout error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Signup function for candidates
  const signupCandidate = async (data: CandidateSignupData) => {
    try {
      setLoading(true);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      if (authData.user) {
        // Update or insert profile after signup
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: authData.user.email!,
            full_name: data.fullName,
            role: 'candidate'
          });
          
        if (profileError) {
          throw profileError;
        }
        
        // Create candidate record
        const { error: candidateError } = await supabase
          .from('candidates')
          .insert({
            id: authData.user.id,
            email: authData.user.email!,
            full_name: data.fullName,
            profile_status: 'incomplete'
          });
          
        if (candidateError) {
          throw candidateError;
        }
        
        toast.success('Account created! Please verify your email to continue.');
        navigate('/email-verification');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Signup function for companies
  const signupCompany = async (data: CompanySignupData) => {
    try {
      setLoading(true);
      
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            company_name: data.companyName,
            contact_name: data.contactName,
          }
        }
      });
      
      //if (error) {
        //throw error;
      //}
      
      if (authData.user) {
        // Update or insert profile after signup
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: authData.user.email!,
            full_name: data.contactName,
            role: 'company'
          });
          
        if (profileError) {
          throw profileError;
        }
        
        // Create company record
        const { error: companyError } = await supabase
          .from('companies')
          .insert({
            id: authData.user.id,
            company_name: data.companyName,
            contact_name: data.contactName,
            industry: data.industry,
            size: data.size,
            phone: data.phone || null,
            website: data.website || null,
            description: data.description || null,
          });
          
        if (companyError) {
          throw companyError;
        }
        
        toast.success('Account created! Please verify your email to continue.');
        navigate('/email-verification');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign up');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated: !!user,
        isLoading,
        login, 
        logout,
        signupCandidate,
        signupCompany,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
