import type { Database } from '@/lib/utils/types'
import type { SupabaseClient } from '@supabase/supabase-js'

export type TypedSupabaseClient = SupabaseClient<Database>

export type Tables = Database['public']['Tables']
export type BoardInsert = Tables['boards']['Insert']
export type BoardRow = Tables['boards']['Row']
export type ColumnInsert = Tables['columns']['Insert']
export type ColumnRow = Tables['columns']['Row']
export type TaskInsert = Tables['tasks']['Insert']
export type TaskUpdate = Tables['tasks']['Update']
export type TaskRow = Tables['tasks']['Row']
export type ProfileInsert = Tables['profiles']['Insert']
export type ProfileRow = Tables['profiles']['Row']

