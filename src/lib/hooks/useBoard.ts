'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { ColumnWithTasks } from '@/lib/utils/types'

export function useBoard(boardId: string, initialColumns: ColumnWithTasks[]) {
  const [columns, setColumns] = useState<ColumnWithTasks[]>(initialColumns)
  const { supabase } = useSupabase()

  useEffect(() => {
    const columnChannel = supabase
      .channel(`board-${boardId}-columns`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          filter: `board_id=eq.${boardId}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newColumn = payload.new as any
            setColumns(prev => [...prev, { ...newColumn, tasks: [] }].sort((a, b) => a.position - b.position))
          } else if (payload.eventType === 'UPDATE') {
            const updatedColumn = payload.new as any
            setColumns(prev =>
              prev.map(col =>
                col.id === updatedColumn.id
                  ? { ...col, ...updatedColumn }
                  : col
              ).sort((a, b) => a.position - b.position)
            )
          } else if (payload.eventType === 'DELETE') {
            setColumns(prev => prev.filter(col => col.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    const taskChannel = supabase
      .channel(`board-${boardId}-tasks`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new as any
            setColumns(prev =>
              prev.map(col => {
                if (col.id === newTask.column_id) {
                  const taskExists = col.tasks.some(task => task.id === newTask.id)
                  return taskExists
                    ? col
                    : {
                        ...col,
                        tasks: [...col.tasks, newTask].sort((a, b) => a.position - b.position),
                      }
                }
                return col
              })
            )
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new as any
            const oldTask = payload.old as any
            
            setColumns(prev =>
              prev.map(col => {
                const taskExists = col.tasks.some(task => task.id === updatedTask.id)
                
                if (col.id === oldTask.column_id && col.id === updatedTask.column_id) {
                  return {
                    ...col,
                    tasks: col.tasks
                      .map(task => task.id === updatedTask.id ? updatedTask : task)
                      .sort((a, b) => a.position - b.position),
                  }
                } else if (col.id === oldTask.column_id) {
                  return {
                    ...col,
                    tasks: col.tasks.filter(task => task.id !== updatedTask.id),
                  }
                } else if (col.id === updatedTask.column_id) {
                  return {
                    ...col,
                    tasks: taskExists
                      ? col.tasks.map(task => task.id === updatedTask.id ? updatedTask : task).sort((a, b) => a.position - b.position)
                      : [...col.tasks, updatedTask].sort((a, b) => a.position - b.position),
                  }
                }
                return col
              })
            )
          } else if (payload.eventType === 'DELETE') {
            const deletedTask = payload.old as any
            setColumns(prev =>
              prev.map(col =>
                col.id === deletedTask.column_id
                  ? {
                      ...col,
                      tasks: col.tasks.filter(task => task.id !== deletedTask.id),
                    }
                  : col
              )
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(columnChannel)
      supabase.removeChannel(taskChannel)
    }
  }, [boardId, supabase])

  return { columns, setColumns }
}

