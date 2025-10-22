'use client'

import { useSupabase } from '@/components/providers/SupabaseProvider'
import Button from '@/components/ui/Button'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout}>
      Logout
    </Button>
  )
}

