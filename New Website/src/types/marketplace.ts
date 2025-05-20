
// Industry/Category types
export interface Category {
  id: string;
  name: string;
  description: string;
  iconName?: string;
  subcategories?: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  description?: string;
  parentId: string;
}

// Talent Pack types
export interface TalentPack {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  candidateCount: number;
  price: number;
  criteria: PackCriteria;
  stats: PackStats;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PackCriteria {
  minimumScore?: number;
  minimumExperience?: number;
  requiredSkills?: string[];
  educationLevel?: string;
  otherCriteria?: string[];
}

export interface PackStats {
  averageScore: number;
  averageExperience: number;
  scoreDistribution?: {
    range: string;
    count: number;
  }[];
  topSkills?: {
    skill: string;
    count: number;
  }[];
}

// Purchase types
export interface Purchase {
  id: string;
  packId: string;
  packName: string;
  companyId: string;
  price: number;
  candidateCount: number;
  purchaseDate: string;
  expiresAt?: string;
}

// Candidate types (for purchase data access)
export interface Candidate {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  overallScore: number;
  categoryId: string;
  categoryName: string;
  experience: CandidateExperience[];
  education: CandidateEducation[];
  skills: CandidateSkill[];
  projects: CandidateProject[];
  certifications: CandidateCertification[];
  languages?: CandidateLanguage[];
}

export interface CandidateExperience {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description: string;
  skillsUsed?: string[];
}

export interface CandidateEducation {
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  gpa?: string;
  description?: string;
}

export interface CandidateSkill {
  skillName: string;
  category?: string;
  proficiency?: string;
}

export interface CandidateProject {
  projectName: string;
  description: string;
  technologiesUsed: string[];
  link?: string;
}

export interface CandidateCertification {
  certificationName: string;
  issuingBody: string;
  issueDate: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface CandidateLanguage {
  languageName: string;
  proficiency: string;
}

// Dashboard statistics types
export interface AdminStats {
  totalCandidates: number;
  newCandidatesThisWeek: number;
  totalCompanies: number;
  newCompaniesThisWeek: number;
  activePacks: number;
  categoriesCount: number;
  monthlyRevenue: number;
  revenueChangePercentage: number;
}

export interface CompanyStats {
  availablePacks: number;
  industriesCount: number;
  purchasedPacks: number;
  totalCandidates: number;
  viewedCandidates: number;
  viewedPercentage: number;
  subscriptionTier: string;
}

export interface RecentActivity {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'warning';
}

export interface UserManagementFilters {
  role: string;
  status: string;
  searchQuery: string;
}

export interface UserDetails {
  id: string;
  email: string;
  fullName?: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
  createdAt: string;
}

// Company Test types
export interface CompanyTest {
  id: string;
  companyId: string;
  title: string;
  description?: string;
  categoryId?: string;
  categoryName?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  questions?: TestQuestion[];
}

export interface TestQuestion {
  id: string;
  testId: string;
  questionText: string;
  questionType: 'text' | 'multiple_choice' | 'rating';
  expectedAnswer?: string;
  scoringCriteria?: string;
  orderIndex: number;
  createdAt: string;
}

export interface TestSubmission {
  testId: string;
  candidateId: string;
  answers: TestAnswer[];
  score?: number;
  submittedAt: string;
}

export interface TestAnswer {
  questionId: string;
  answer: string;
}
