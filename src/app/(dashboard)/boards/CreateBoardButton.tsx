'use client'

import { useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import type { BoardInsert, ColumnInsert } from '@/lib/supabase/types'

export default function CreateBoardButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { supabase } = useSupabase()
  const router = useRouter()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    setIsLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return
    
    const newBoard: BoardInsert = {
      user_id: user.id,
      title: title.trim(),
      description: description.trim() || null,
    }
    
    const { data: board, error } = await (supabase
      .from('boards') as any)
      .insert(newBoard)
      .select()
      .single()

    if (!error && board) {
      const defaultColumns: ColumnInsert[] = [
        { board_id: board.id, title: 'To Do', position: 0 },
        { board_id: board.id, title: 'In Progress', position: 1000 },
        { board_id: board.id, title: 'Done', position: 2000 },
      ]

      await (supabase
        .from('columns') as any)
        .insert(defaultColumns)

      setIsOpen(false)
      setTitle('')
      setDescription('')
      router.push(`/boards/${board.id}`)
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>
        <svg
          className="w-5 h-5 mr-2"
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
        New Board
      </Button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Create New Board">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Board Title"
            placeholder="e.g., Product Launch"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description (optional)
            </label>
            <textarea
              placeholder="What is this board for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none"
              rows={3}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !title.trim()}>
              {isLoading ? 'Creating...' : 'Create Board'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  )
}

