import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import KanbanBoard from '@/components/board/KanbanBoard'

export default async function BoardPage({
  params,
}: {
  params: { boardId: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: board } = await supabase
    .from('boards')
    .select('*')
    .eq('id', params.boardId)
    .eq('user_id', user!.id)
    .single()

  if (!board) {
    notFound()
  }

  const { data: columns } = await supabase
    .from('columns')
    .select(`
      *,
      tasks (*)
    `)
    .eq('board_id', board.id)
    .order('position', { ascending: true })

  const columnsWithTasks = columns?.map(column => ({
    ...column,
    tasks: (column.tasks as any[]).sort((a, b) => a.position - b.position),
  })) || []

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {board.title}
        </h1>
        {board.description && (
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {board.description}
          </p>
        )}
      </div>

      <KanbanBoard
        boardId={board.id}
        initialColumns={columnsWithTasks}
      />
    </div>
  )
}

