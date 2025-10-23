import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { ProfileInsert } from '@/lib/supabase/types'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (!profile) {
          const newProfile: ProfileInsert = {
            id: user.id,
            github_username: user.user_metadata.user_name,
            avatar_url: user.user_metadata.avatar_url,
          }
          
          await (supabase.from('profiles') as any).insert(newProfile)
        }
      }
      
      return NextResponse.redirect(`${origin}/boards`)
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}

