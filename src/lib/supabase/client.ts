import { createBrowserClient } from '@supabase/ssr'
import { Database } from '@/lib/utils/types'
import type { SupabaseClient } from '@supabase/supabase-js'

// Singleton pattern to ensure we use the same client instance
let client: SupabaseClient<Database> | null = null

export function createClient(): SupabaseClient<Database> {
  if (client) {
    console.log('♻️ Reusing existing Supabase client')
    return client
  }
  
  console.log('🆕 Creating new Supabase client')
  client = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  return client
}

