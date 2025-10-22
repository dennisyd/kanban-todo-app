import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'
import SupabaseProvider from '@/components/providers/SupabaseProvider'
import LogoutButton from './LogoutButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <SupabaseProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Kanban Todo
                </h1>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar 
                    src={profile?.avatar_url} 
                    alt={profile?.github_username || 'User'} 
                    size="sm"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {profile?.github_username}
                  </span>
                </div>
                <LogoutButton />
              </div>
            </div>
          </div>
        </nav>
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </SupabaseProvider>
  )
}

