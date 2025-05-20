
// Auth types
export interface AuthUser {
  id: string;
  email: string;
  role?: 'candidate' | 'company' | 'admin';
  fullName?: string;
  candidateDetails?: {
    fullName: string;
    profileStatus: 'incomplete' | 'cv_uploaded' | 'data_verified' | 'test_completed' | 'complete';
    cvUrl?: string;
    category?: string;
    overallScore?: number;
    subscriptionTier?: 'free' | 'premium';
  };
  companyDetails?: {
    companyName: string;
    contactName: string;
    industry?: string;
    size?: string;
    subscription_tier?: 'basic' | 'pro' | 'enterprise';
  };
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signupCandidate: (data: CandidateSignupData) => Promise<void>;
  signupCompany: (data: CompanySignupData) => Promise<void>;
  loading: boolean;
}

export interface CandidateSignupData {
  fullName: string;
  email: string;
  password: string;
  agreedToTerms: boolean;
}

export interface CompanySignupData {
  companyName: string;
  contactName: string;
  email: string;
  password: string;
  industry: string;
  size: string;
  agreedToTerms: boolean;
  phone?: string;
  website?: string;
  description?: string;
}

// Define user role type
export type UserRole = 'candidate' | 'company' | 'admin';
