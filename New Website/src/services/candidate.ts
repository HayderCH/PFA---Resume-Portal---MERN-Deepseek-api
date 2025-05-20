import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserRole } from '@/types/auth';

// Interface for extracted profile data
export interface ExtractedProfileData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    linkedIn: string;
  };
  primaryCategory: string;
  subCategory: string;
  workExperience: Array<{
    title: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
  }>;
  skills: Array<{
    name: string;
    category: string;
    proficiency: string;
  }>;
}

// Upload CV to Supabase storage
export const uploadCV = async (file: File, userId: string): Promise<string> => {
  try {
    // Create a unique file path
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    console.log("Uploading file to path:", filePath, "in bucket: candidate-cvs");
    
    // Upload to Supabase storage
    const { error: uploadError, data } = await supabase.storage
      .from('candidate-cvs')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }
    
    // Get the public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('candidate-cvs')
      .getPublicUrl(filePath);
    
    console.log("File uploaded successfully, public URL:", publicUrl);
    
    // Check if the user has an existing profile record
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error("Error checking for profile:", profileError);
      throw profileError;
    }
    
    // Make sure profile exists before updating candidate
    if (!profiles) {
      console.error("No profile found for user:", userId);
      throw new Error("User profile not found");
    }
    
    // Check if candidate record exists - use the authenticated user's own ID
    const { data: existingCandidate, error: checkError } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (checkError) {
      console.error("Error checking for existing candidate:", checkError);
      throw checkError;
    }
    
    if (!existingCandidate) {
      // Create a new candidate record if it doesn't exist
      console.log("Creating new candidate record for user:", userId);
      const { error: insertError } = await supabase
        .from('candidates')
        .insert({
          id: userId,
          cv_url: publicUrl,
          profile_status: 'cv_uploaded',
          full_name: profiles.full_name || '',
          email: profiles.email || '',
          updated_at: new Date().toISOString()
        });
      
      if (insertError) {
        console.error("Error creating candidate record:", insertError);
        throw insertError;
      }
      
      console.log("Created new candidate record with CV URL");
    } else {
      // Update the existing candidate record
      console.log("Updating existing candidate record for user:", userId);
      const { error: updateError } = await supabase
        .from('candidates')
        .update({ 
          cv_url: publicUrl,
          profile_status: 'cv_uploaded',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
      
      if (updateError) {
        console.error("Database update error:", updateError);
        throw updateError;
      }
      
      console.log("Updated existing candidate record with CV URL");
    }
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading CV:', error);
    throw error;
  }
};

// Send CV for AI extraction
export const extractCVData = async (cvUrl: string, userId: string): Promise<ExtractedProfileData> => {
  try {
    // In a real implementation, this would call your Python API/FastAPI
    // For now, we'll just return static data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Extracting data from CV URL:", cvUrl);
    
    // Static AI extracted data
    const extractedData: ExtractedProfileData = {
      personalInfo: {
        fullName: "Alex Johnson",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        linkedIn: "https://linkedin.com/in/alexjohnson"
      },
      primaryCategory: "Technology",
      subCategory: "Software Engineering",
      workExperience: [
        {
          title: "Senior Full Stack Engineer",
          company: "Tech Innovations Inc.",
          startDate: "2020-03",
          endDate: "2023-05",
          description: "- Led development of cloud-based analytics platform\n- Implemented React and Node.js microservices\n- Reduced system response time by 40%\n- Managed team of 4 developers"
        },
        {
          title: "Frontend Developer",
          company: "Digital Solutions LLC",
          startDate: "2017-06",
          endDate: "2020-02",
          description: "- Built responsive web applications\n- Developed mobile-first UI components\n- Implemented CI/CD pipelines\n- Collaborated with design and product teams"
        }
      ],
      education: [
        {
          degree: "Master of Science in Computer Science",
          institution: "University of California, Berkeley",
          startDate: "2015-09",
          endDate: "2017-05"
        },
        {
          degree: "Bachelor of Science in Information Technology",
          institution: "Stanford University",
          startDate: "2011-09",
          endDate: "2015-05"
        }
      ],
      skills: [
        {
          name: "React",
          category: "Frontend",
          proficiency: "Expert"
        },
        {
          name: "Node.js",
          category: "Backend",
          proficiency: "Advanced"
        },
        {
          name: "Python",
          category: "Programming",
          proficiency: "Advanced"
        },
        {
          name: "GraphQL",
          category: "API",
          proficiency: "Intermediate"
        },
        {
          name: "AWS",
          category: "Cloud",
          proficiency: "Advanced"
        }
      ]
    };
    
    console.log("Extracted data (static):", extractedData);
    
    return extractedData;
  } catch (error) {
    console.error('Error extracting CV data:', error);
    throw error;
  }
};

// Save extracted profile data to the database
export const saveProfileData = async (userId: string, data: ExtractedProfileData): Promise<void> => {
  try {
    console.log("Saving profile data for user:", userId);
    
    // Update candidate record with profile data
    const { error: updateError } = await supabase
      .from('candidates')
      .update({ 
        full_name: data.personalInfo.fullName,
        phone: data.personalInfo.phone,
        location: data.personalInfo.location,
        category: data.subCategory,
        profile_status: 'data_verified',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      console.error("Error updating candidate profile:", updateError);
      throw updateError;
    }
    
    // Add skills to candidate_skills table
    if (data.skills && data.skills.length > 0) {
      // First, remove existing skills
      const { error: deleteError } = await supabase
        .from('candidate_skills')
        .delete()
        .eq('candidate_id', userId);
        
      if (deleteError) {
        console.error("Error deleting existing skills:", deleteError);
        // Continue despite this error
      }
      
      // Insert new skills
      const skillsToInsert = data.skills.map(skill => ({
        candidate_id: userId,
        skill_name: skill.name,
        proficiency: skill.proficiency
      }));
      
      const { error: skillsError } = await supabase
        .from('candidate_skills')
        .insert(skillsToInsert);
      
      if (skillsError) {
        console.error("Error inserting skills:", skillsError);
        throw skillsError;
      }
      
      console.log("Successfully saved", skillsToInsert.length, "skills");
    }
    
    console.log("Profile data saved successfully");
  } catch (error) {
    console.error('Error saving profile data:', error);
    throw error;
  }
};

// Start credibility test for candidate
export const startCredibilityTest = async (userId: string): Promise<any> => {
  try {
    // In a real implementation, this would call your Python API to get test questions
    // For now, we'll just return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock test questions
    const mockTestQuestions = {
      testId: "test-" + Date.now(),
      questions: [
        {
          id: 1,
          text: "Explain your approach to optimizing a slow-performing JavaScript application.",
          type: "text"
        },
        {
          id: 2,
          text: "What experience do you have with microservices architecture?",
          type: "text"
        },
        {
          id: 3,
          text: "Rate your proficiency in React state management from 1-10 and explain your rating.",
          type: "text"
        },
        {
          id: 4,
          text: "How do you ensure code quality in your projects?",
          type: "text"
        },
        {
          id: 5,
          text: "Describe a challenging technical problem you solved recently.",
          type: "text"
        }
      ]
    };
    
    console.log("Credibility test started for user:", userId);
    console.log("Test questions (mock):", mockTestQuestions);
    
    return mockTestQuestions;
  } catch (error) {
    console.error('Error starting credibility test:', error);
    throw error;
  }
};

// Submit credibility test answers
export const submitCredibilityTest = async (
  userId: string, 
  testId: string, 
  answers: Array<{ questionId: number, answer: string }>
): Promise<{ score: number, feedback: any }> => {
  try {
    // In a real implementation, this would call your Python API to evaluate answers
    // For now, we'll just return mock data
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Generate random score between 70 and 95
    const overallScore = Math.floor(Math.random() * 26) + 70;
    
    // Mock component scores
    const componentScores = {
      technicalSkills: Math.floor(Math.random() * 20) + 80,
      experience: Math.floor(Math.random() * 20) + 75,
      education: Math.floor(Math.random() * 20) + 75,
      problemSolving: Math.floor(Math.random() * 20) + 80
    };
    
    // Update candidate record with test results
    const { error: updateError } = await supabase
      .from('candidates')
      .update({ 
        overall_score: overallScore,
        profile_status: 'complete',
        last_tested: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (updateError) {
      throw updateError;
    }
    
    console.log("Test submitted for user:", userId);
    console.log("Test score:", overallScore);
    console.log("Component scores:", componentScores);
    
    return {
      score: overallScore,
      feedback: componentScores
    };
  } catch (error) {
    console.error('Error submitting credibility test:', error);
    throw error;
  }
};

// Refresh user data 
export const refreshUserData = async (userId: string): Promise<AuthUser | null> => {
  try {
    console.log("Refreshing user data for:", userId);
    
    // Use maybeSingle() instead of single() to avoid errors when no rows are returned
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();
      
    if (profileError) {
      console.error("Profile fetch error:", profileError);
      throw profileError;
    }
    
    if (!profile) {
      console.log('No profile found for user:', userId);
      return null;
    }
    
    let userData: AuthUser = {
      id: userId,
      email: profile.email,
      role: profile.role as UserRole, // Explicit type casting
      fullName: profile.full_name || ''
    };
    
    if (profile.role === 'candidate') {
      // Use maybeSingle() instead of single() to avoid errors when no rows are returned
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (candidateError) {
        console.error("Candidate data fetch error:", candidateError);
        throw candidateError;
      }
      
      if (candidateData) {
        userData.candidateDetails = {
          fullName: candidateData.full_name || profile.full_name || '',
          // Explicit type casting for profile_status
          profileStatus: candidateData.profile_status as "incomplete" | "cv_uploaded" | "data_verified" | "test_completed" | "complete",
          cvUrl: candidateData.cv_url,
          category: candidateData.category,
          overallScore: candidateData.overall_score
        };
        console.log("Candidate details fetched:", userData.candidateDetails);
      } else {
        console.log('No candidate data found for user:', userId);
      }
    } 
    else if (profile.role === 'company') {
      // Use maybeSingle() instead of single() to avoid errors when no rows are returned
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
        
      if (companyError) {
        throw companyError;
      }
      
      if (companyData) {
        userData.companyDetails = {
          companyName: companyData.company_name,
          contactName: companyData.contact_name || '',
          industry: companyData.industry,
          size: companyData.size
        };
      } else {
        console.log('No company data found for user:', userId);
      }
    }
    
    console.log("User data refreshed:", userData);
    return userData;
  } catch (error) {
    console.error('Error refreshing user data:', error);
    throw error;
  }
};
