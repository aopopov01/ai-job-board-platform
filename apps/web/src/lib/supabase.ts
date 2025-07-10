import { createClient } from '@supabase/supabase-js'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

// Server-side client with service role key
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key-for-testing'
)

// Route handler client factory (for authentication)
export function createSupabaseRouteHandlerClient() {
  try {
    return createRouteHandlerClient({ cookies })
  } catch (error) {
    console.warn('Failed to create route handler client, using fallback:', error)
    // Fallback to regular client if route handler client fails
    return createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
      process.env.SUPABASE_ANON_KEY || 'mock-anon-key-for-testing'
    )
  }
}

// Client-side client with anon key
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-project.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'mock-anon-key-for-testing'
)