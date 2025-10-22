import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LoginButton from './LoginButton'

export default async function LoginPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/boards')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Kanban Todo
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Organize your tasks with style
            </p>
          </div>
          
          <LoginButton />
          
          <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
            By signing in, you agree to use this app responsibly.
          </div>
        </div>
      </div>
    </div>
  )
}

