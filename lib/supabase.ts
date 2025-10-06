import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: number
  fid: number
  username: string | null
  display_name: string | null
  pfp_url: string | null
  current_streak: number
  max_streak: number
  last_claim_date: string | null
  total_claims: number
  referral_count: number
  created_at: string
  updated_at: string
}

export interface Badge {
  id: number
  name: string
  emoji: string
  description: string | null
  required_streak: number | null
  badge_type: string
}

export interface UserBadge {
  id: number
  user_id: number
  badge_id: number
  earned_at: string
}