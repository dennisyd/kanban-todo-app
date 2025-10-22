import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import CreateBoardButton from './CreateBoardButton'

export default async function BoardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: boards } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Boards
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Organize your tasks across multiple boards
          </p>
        </div>
        <CreateBoardButton />
      </div>

      {boards && boards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {boards.map((board) => (
            <Link
              key={board.id}
              href={`/boards/${board.id}`}
              className="block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 p-6 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {board.title}
                </h3>
                {board.description && (
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">
                    {board.description}
                  </p>
                )}
                <div className="mt-4 text-xs text-gray-500 dark:text-gray-500">
                  Updated {new Date(board.updated_at).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No boards yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first board to start organizing your tasks
          </p>
          <CreateBoardButton />
        </div>
      )}
    </div>
  )
}

