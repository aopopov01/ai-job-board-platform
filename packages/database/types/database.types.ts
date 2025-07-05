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
      applications: {
        Row: {
          ai_screening_notes: Json | null
          ai_screening_score: number | null
          application_type: string | null
          applied_at: string | null
          candidate_id: string
          cover_letter: string | null
          id: string
          job_id: string
          last_status_change: string | null
          recruiter_notes: string | null
          status: string | null
          status_history: Json | null
        }
        Insert: {
          ai_screening_notes?: Json | null
          ai_screening_score?: number | null
          application_type?: string | null
          applied_at?: string | null
          candidate_id: string
          cover_letter?: string | null
          id?: string
          job_id: string
          last_status_change?: string | null
          recruiter_notes?: string | null
          status?: string
          status_history?: Json | null
        }
        Update: {
          ai_screening_notes?: Json | null
          ai_screening_score?: number | null
          application_type?: string | null
          applied_at?: string | null
          candidate_id?: string
          cover_letter?: string | null
          id?: string
          job_id?: string
          last_status_change?: string | null
          recruiter_notes?: string | null
          status?: string
          status_history?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          }
        ]
      }
      user_profiles: {
        Row: {
          id: string
          user_type: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          user_type: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_type?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      individual_profiles: {
        Row: {
          id: string
          years_of_experience: number | null
          current_job_title: string | null
          job_search_status: string
          remote_preference: string
          salary_expectation_min: number | null
          salary_expectation_max: number | null
          salary_currency: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          years_of_experience?: number | null
          current_job_title?: string | null
          job_search_status: string
          remote_preference: string
          salary_expectation_min?: number | null
          salary_expectation_max?: number | null
          salary_currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          years_of_experience?: number | null
          current_job_title?: string | null
          job_search_status?: string
          remote_preference?: string
          salary_expectation_min?: number | null
          salary_expectation_max?: number | null
          salary_currency?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      company_profiles: {
        Row: {
          id: string
          company_name: string
          industry: string
          company_size: string | null
          website: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          company_name: string
          industry: string
          company_size?: string | null
          website?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          company_name?: string
          industry?: string
          company_size?: string | null
          website?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      jobs: {
        Row: {
          id: string
          title: string
          description: string
          company_id: string
          location: string | null
          work_style: string
          job_type: string
          experience_level: string
          salary_min: number | null
          salary_max: number | null
          salary_currency: string | null
          skills_required: string[]
          skills_nice_to_have: string[]
          benefits: string[]
          application_deadline: string | null
          status: string
          category_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          company_id: string
          location?: string | null
          work_style: string
          job_type: string
          experience_level: string
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string | null
          skills_required: string[]
          skills_nice_to_have?: string[]
          benefits?: string[]
          application_deadline?: string | null
          status?: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          company_id?: string
          location?: string | null
          work_style?: string
          job_type?: string
          experience_level?: string
          salary_min?: number | null
          salary_max?: number | null
          salary_currency?: string | null
          skills_required?: string[]
          skills_nice_to_have?: string[]
          benefits?: string[]
          application_deadline?: string | null
          status?: string
          category_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      job_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
        Relationships: []
      }
      skills: {
        Row: {
          id: string
          name: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string | null
          created_at?: string
        }
        Relationships: []
      }
      user_skills: {
        Row: {
          id: string
          user_id: string
          skill_id: string
          proficiency_level: string | null
          years_experience: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          skill_id: string
          proficiency_level?: string | null
          years_experience?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          skill_id?: string
          proficiency_level?: string | null
          years_experience?: number | null
          created_at?: string
        }
        Relationships: []
      }
      cv_documents: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string
          file_size: number
          is_primary: boolean
          parsed_content: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path: string
          file_size: number
          is_primary?: boolean
          parsed_content?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string
          file_size?: number
          is_primary?: boolean
          parsed_content?: Json | null
          created_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          recipient_id: string
          subject: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          sender_id: string
          recipient_id: string
          subject?: string | null
          content: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          sender_id?: string
          recipient_id?: string
          subject?: string | null
          content?: string
          is_read?: boolean
          created_at?: string
        }
        Relationships: []
      }
      referral_programs: {
        Row: {
          id: string
          name: string
          description: string | null
          reward_amount: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          reward_amount?: number | null
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          reward_amount?: number | null
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

// Specific table types for easier usage
export type UserProfile = Tables<'user_profiles'>
export type IndividualProfile = Tables<'individual_profiles'>
export type CompanyProfile = Tables<'company_profiles'>
export type Job = Tables<'jobs'>
export type Application = Tables<'applications'>
export type Skill = Tables<'skills'>
export type UserSkill = Tables<'user_skills'>
export type CVDocument = Tables<'cv_documents'>
export type JobCategory = Tables<'job_categories'>
export type Message = Tables<'messages'>
export type ReferralProgram = Tables<'referral_programs'>