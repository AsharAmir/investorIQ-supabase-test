export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          role: string
          created_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          role?: string
          created_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          title: string
          address: string
          price: number
          deal_type: string
          description: string | null
          images: string[]
          iq_score: number
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          address: string
          price: number
          deal_type: string
          description?: string | null
          images?: string[]
          iq_score?: number
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          address?: string
          price?: number
          deal_type?: string
          description?: string | null
          images?: string[]
          iq_score?: number
          user_id?: string
          created_at?: string
        }
      }
      advisor_requests: {
        Row: {
          id: string
          property_id: string
          user_id: string
          advisor_id: string | null
          message: string
          response: string | null
          status: string
          created_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          property_id: string
          user_id: string
          advisor_id?: string | null
          message: string
          response?: string | null
          status?: string
          created_at?: string
          responded_at?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          user_id?: string
          advisor_id?: string | null
          message?: string
          response?: string | null
          status?: string
          created_at?: string
          responded_at?: string | null
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
      [_ in never]: never
    }
  }
}