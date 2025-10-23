'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { TaskInsert, TaskRow } from '@/lib/supabase/types'

interface AddTaskButtonProps {
  columnId: string
}

export default function AddTaskButton({ columnId }: AddTaskButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const { supabase } = useSupabase()

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const { data: tasks } = await supabase
      .from('tasks')
      .select('position')
      .eq('column_id', columnId)
      .order('position', { ascending: false })
      .limit(1)

    const lastPosition = tasks && tasks.length > 0 ? (tasks[0] as unknown as TaskRow).position : 0

    const newTask: TaskInsert = {
      column_id: columnId,
      title: title.trim(),
      position: lastPosition + 1000,
    }

    await (supabase.from('tasks') as any).insert(newTask)

    setTitle('')
    setIsAdding(false)
  }

  if (isAdding) {
    return (
      <form onSubmit={handleAdd} className="mt-3">
        <Input
          placeholder="Enter task title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
          onBlur={() => {
            setTimeout(() => {
              if (!title.trim()) {
                setIsAdding(false)
              }
            }, 150)
          }}
        />
        <div className="flex gap-2 mt-2">
          <Button type="submit" size="sm" disabled={!title.trim()}>
            Add
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsAdding(false)
              setTitle('')
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={() => setIsAdding(true)}
      className="w-full mt-3 justify-start text-gray-600 dark:text-gray-400"
    >
      <svg
        className="w-4 h-4 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      Add task
    </Button>
  )
}

