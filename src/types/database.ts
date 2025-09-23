// Database types for Supabase integration

export interface Database {
  public: {
    Tables: {
      candidates: {
        Row: {
          id: number
          name: string
          class: string
          photo_url: string | null
          vision: string
          mission: string[]
          votes: number
          created_at: string
          update_at: string
        }
        Insert: {
          id?: number
          name: string
          class: string
          photo_url?: string | null
          vision: string
          mission: string[]
          votes?: number
          created_at?: string
          update_at?: string
        }
        Update: {
          id?: number
          name?: string
          class?: string
          photo_url?: string | null
          vision?: string
          mission?: string[]
          votes?: number
          created_at?: string
          update_at?: string
        }
      }
      voters: {
        Row: {
          id: number
          name: string
          email: string
          class: string
          has_voted: boolean
          voted_for: number | null
          voted_at: string | null
          created_at: string
          update_at: string
        }
        Insert: {
          id?: number
          name: string
          email: string
          class: string
          has_voted?: boolean
          voted_for?: number | null
          voted_at?: string | null
          created_at?: string
          update_at?: string
        }
        Update: {
          id?: number
          name?: string
          email?: string
          class?: string
          has_voted?: boolean
          voted_for?: number | null
          voted_at?: string | null
          created_at?: string
          update_at?: string
        }
      }
      election_settings: {
        Row: {
          id: number
          election_name: string
          start_date: string
          end_date: string
          is_active: boolean
          allow_voting: boolean
          allow_registration: boolean
          max_candidates: number
          require_photo: boolean
          announcement: string | null
          contact_info: string | null
          created_at: string
          update_at: string
        }
        Insert: {
          id?: number
          election_name: string
          start_date: string
          end_date: string
          is_active?: boolean
          allow_voting?: boolean
          allow_registration?: boolean
          max_candidates?: number
          require_photo?: boolean
          announcement?: string | null
          contact_info?: string | null
          created_at?: string
          update_at?: string
        }
        Update: {
          id?: number
          election_name?: string
          start_date?: string
          end_date?: string
          is_active?: boolean
          allow_voting?: boolean
          allow_registration?: boolean
          max_candidates?: number
          require_photo?: boolean
          announcement?: string | null
          contact_info?: string | null
          created_at?: string
          update_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'admin' | 'panitia' | 'member'
          avatar_url: string | null
          created_at: string
          update_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          role: 'admin' | 'panitia' | 'member'
          avatar_url?: string | null
          created_at?: string
          update_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          role?: 'admin' | 'panitia' | 'member'
          avatar_url?: string | null
          created_at?: string
          update_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'panitia' | 'member'
    }
  }
}

// Type aliases for easier usage
export type Candidate = Database['public']['Tables']['candidates']['Row']
export type CandidateInsert = Database['public']['Tables']['candidates']['Insert']
export type CandidateUpdate = Database['public']['Tables']['candidates']['Update']

export type Voter = Database['public']['Tables']['voters']['Row']
export type VoterInsert = Database['public']['Tables']['voters']['Insert']
export type VoterUpdate = Database['public']['Tables']['voters']['Update']

export type ElectionSettings = Database['public']['Tables']['election_settings']['Row']
export type ElectionSettingsInsert = Database['public']['Tables']['election_settings']['Insert']
export type ElectionSettingsUpdate = Database['public']['Tables']['election_settings']['Update']

export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  count: number
  error?: string
}








