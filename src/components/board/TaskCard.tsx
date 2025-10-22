'use client'

import { useDraggable } from '@dnd-kit/core'
import { Task } from '@/lib/utils/types'
import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
}

export default function TaskCard({ task, isDragging = false }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description || '')
  const { supabase } = useSupabase()

  const { attributes, listeners, setNodeRef, transform, isDragging: isDraggingActive } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined

  const handleSave = async () => {
    const { error } = await supabase
      .from('tasks')
      .update({
        title: title.trim(),
        description: description.trim() || null,
      })
      .eq('id', task.id)

    if (!error) {
      setIsEditing(false)
    }
  }

  const handleDelete = async () => {
    if (confirm('Delete this task?')) {
      await supabase.from('tasks').delete().eq('id', task.id)
      setIsEditing(false)
    }
  }

  if (isDragging) {
    return (
      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-lg border-2 border-blue-500">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>
    )
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-600 cursor-move hover:shadow-md transition-shadow ${
          isDraggingActive ? 'opacity-50' : ''
        }`}
        role="button"
        tabIndex={0}
        onClick={(e) => {
          if (e.detail === 2) {
            setIsEditing(true)
          }
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsEditing(true)
          }
        }}
      >
        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">
          {task.title}
        </h4>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title="Edit Task">
        <div className="space-y-4">
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              id="task-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
              rows={4}
            />
          </div>
          <div className="flex gap-3 justify-between">
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

