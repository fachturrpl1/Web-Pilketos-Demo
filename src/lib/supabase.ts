import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Helper function untuk error handling
export const handleSupabaseError = (error: unknown) => {
  const message = (typeof error === 'object' && error !== null && 'message' in error)
    ? String((error as { message?: unknown }).message)
    : 'An error occurred'
  console.error('Supabase error:', error)
  return {
    success: false,
    error: message
  }
}

// Helper function untuk success response
export const handleSupabaseSuccess = <TData>(data: TData) => {
  return {
    success: true,
    data
  }
}




























