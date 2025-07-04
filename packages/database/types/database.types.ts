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
          status?: string | null
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
          status?: string | null
          status_history?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_candidate_id_fkey"
            columns: ["candidate_id"]
            isOneToOne: false
            referencedRelation: "individual_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      // ... (truncated for brevity, full types available)
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

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Type aliases for easier use
export type UserProfile = Tables<'user_profiles'>
export type IndividualProfile = Tables<'individual_profiles'>
export type CompanyProfile = Tables<'company_profiles'>
export type Job = Tables<'jobs'>
export type Application = Tables<'applications'>
export type Skill = Tables<'skills'>
export type UserSkill = Tables<'user_skills'>
export type Message = Tables<'messages'>
export type ReferralProgram = Tables<'referral_programs'>
export type CVDocument = Tables<'cv_documents'>
export type JobCategory = Tables<'job_categories'>
