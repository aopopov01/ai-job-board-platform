import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

// Server-side client (simplified for standalone deployment)
export const createServerClient = () => {
  return createClient(supabaseUrl, supabaseKey)
}

export default supabase