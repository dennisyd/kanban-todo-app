'use client'

import { useDroppable } from '@dnd-kit/core'
import { ColumnWithTasks } from '@/lib/utils/types'
import TaskCard from './TaskCard'
import AddTaskButton from './AddTaskButton'

interface ColumnProps {
  column: ColumnWithTasks
}

export default function Column({ column }: ColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  })

  return (
    <div
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 bg-gray-100 dark:bg-gray-800 rounded-lg p-4 transition-colors ${
        isOver ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-gray-700' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
          {column.title}
        </h3>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-700 px-2 py-1 rounded">
          {column.tasks.length}
        </span>
      </div>

      <div className="space-y-3 min-h-[200px]">
        {column.tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <AddTaskButton columnId={column.id} />
    </div>
  )
}

