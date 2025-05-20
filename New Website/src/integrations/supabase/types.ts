export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      candidate_skills: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          proficiency: string | null
          skill_name: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          proficiency?: string | null
          skill_name: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          proficiency?: string | null
          skill_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "candidate_skills_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
        ]
      }
      candidates: {
        Row: {
          category: string | null
          created_at: string
          credibility_test_taken: boolean | null
          cv_data: Json | null
          cv_uploaded: boolean | null
          cv_url: string | null
          email: string
          experience_years: number | null
          final_assessment_data: Json | null
          full_name: string
          id: string
          interview_data: Json | null
          last_tested: string | null
          location: string | null
          overall_score: number | null
          phone: string | null
          profile_image_url: string | null
          profile_status: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          credibility_test_taken?: boolean | null
          cv_data?: Json | null
          cv_uploaded?: boolean | null
          cv_url?: string | null
          email: string
          experience_years?: number | null
          final_assessment_data?: Json | null
          full_name: string
          id: string
          interview_data?: Json | null
          last_tested?: string | null
          location?: string | null
          overall_score?: number | null
          phone?: string | null
          profile_image_url?: string | null
          profile_status?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          credibility_test_taken?: boolean | null
          cv_data?: Json | null
          cv_uploaded?: boolean | null
          cv_url?: string | null
          email?: string
          experience_years?: number | null
          final_assessment_data?: Json | null
          full_name?: string
          id?: string
          interview_data?: Json | null
          last_tested?: string | null
          location?: string | null
          overall_score?: number | null
          phone?: string | null
          profile_image_url?: string | null
          profile_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon_name: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon_name?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          company_name: string
          contact_name: string | null
          created_at: string
          description: string | null
          id: string
          industry: string | null
          phone: string | null
          size: string | null
          subscription_tier: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          company_name: string
          contact_name?: string | null
          created_at?: string
          description?: string | null
          id: string
          industry?: string | null
          phone?: string | null
          size?: string | null
          subscription_tier?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          company_name?: string
          contact_name?: string | null
          created_at?: string
          description?: string | null
          id?: string
          industry?: string | null
          phone?: string | null
          size?: string | null
          subscription_tier?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      company_tests: {
        Row: {
          category_id: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_tests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "company_tests_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_candidates: {
        Row: {
          candidate_id: string
          created_at: string
          id: string
          pack_id: string
        }
        Insert: {
          candidate_id: string
          created_at?: string
          id?: string
          pack_id: string
        }
        Update: {
          candidate_id?: string
          created_at?: string
          id?: string
          pack_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_candidates_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "candidates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pack_candidates_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "talent_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchases: {
        Row: {
          company_id: string
          created_at: string
          expires_at: string | null
          id: string
          pack_id: string
          price: number
          purchase_date: string
        }
        Insert: {
          company_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          pack_id: string
          price: number
          purchase_date?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          pack_id?: string
          price?: number
          purchase_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchases_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "talent_packs"
            referencedColumns: ["id"]
          },
        ]
      }
      talent_packs: {
        Row: {
          average_experience: number | null
          average_score: number | null
          candidate_count: number | null
          category_id: string
          created_at: string
          description: string
          education_level: string | null
          id: string
          is_featured: boolean | null
          minimum_experience: number | null
          minimum_score: number | null
          name: string
          other_criteria: string[] | null
          price: number
          required_skills: string[] | null
          updated_at: string
        }
        Insert: {
          average_experience?: number | null
          average_score?: number | null
          candidate_count?: number | null
          category_id: string
          created_at?: string
          description: string
          education_level?: string | null
          id?: string
          is_featured?: boolean | null
          minimum_experience?: number | null
          minimum_score?: number | null
          name: string
          other_criteria?: string[] | null
          price: number
          required_skills?: string[] | null
          updated_at?: string
        }
        Update: {
          average_experience?: number | null
          average_score?: number | null
          candidate_count?: number | null
          category_id?: string
          created_at?: string
          description?: string
          education_level?: string | null
          id?: string
          is_featured?: boolean | null
          minimum_experience?: number | null
          minimum_score?: number | null
          name?: string
          other_criteria?: string[] | null
          price?: number
          required_skills?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "talent_packs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      test_questions: {
        Row: {
          created_at: string
          expected_answer: string | null
          id: string
          order_index: number
          question_text: string
          question_type: string
          scoring_criteria: string | null
          test_id: string
        }
        Insert: {
          created_at?: string
          expected_answer?: string | null
          id?: string
          order_index?: number
          question_text: string
          question_type?: string
          scoring_criteria?: string | null
          test_id: string
        }
        Update: {
          created_at?: string
          expected_answer?: string | null
          id?: string
          order_index?: number
          question_text?: string
          question_type?: string
          scoring_criteria?: string | null
          test_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "company_tests"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
