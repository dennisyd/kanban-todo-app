'use client'

import { useEffect, useState } from 'react'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { ColumnWithTasks } from '@/lib/utils/types'

export function useBoard(boardId: string, initialColumns: ColumnWithTasks[]) {
  const [columns, setColumns] = useState<ColumnWithTasks[]>(initialColumns)
  const { supabase } = useSupabase()

  useEffect(() => {
    console.log('🔄 Setting up realtime for board:', boardId)
    
    // Set up a single channel for all board updates
    const channel = supabase
      .channel(`board-${boardId}-realtime`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'columns',
          filter: `board_id=eq.${boardId}`,
        },
        (payload: any) => {
          console.log('📊 Column change:', payload.eventType, payload)
          if (payload.eventType === 'INSERT') {
            const newColumn = payload.new as any
            setColumns(prev => {
              const exists = prev.some(col => col.id === newColumn.id)
              if (exists) return prev
              return [...prev, { ...newColumn, tasks: [] }].sort((a, b) => a.position - b.position)
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedColumn = payload.new as any
            setColumns(prev =>
              prev.map(col =>
                col.id === updatedColumn.id
                  ? { ...col, title: updatedColumn.title, position: updatedColumn.position }
                  : col
              ).sort((a, b) => a.position - b.position)
            )
          } else if (payload.eventType === 'DELETE') {
            setColumns(prev => prev.filter(col => col.id !== payload.old.id))
          }
        }
      )
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        (payload: any) => {
          console.log('✅ Task change:', payload.eventType, payload)
          if (payload.eventType === 'INSERT') {
            const newTask = payload.new as any
            setColumns(prev => {
              // Check if this task belongs to any column in this board
              const belongsToBoard = prev.some(col => col.id === newTask.column_id)
              if (!belongsToBoard) return prev
              
              return prev.map(col => {
                if (col.id === newTask.column_id) {
                  const taskExists = col.tasks.some(task => task.id === newTask.id)
                  if (taskExists) return col
                  
                  return {
                    ...col,
                    tasks: [...col.tasks, newTask].sort((a, b) => a.position - b.position),
                  }
                }
                return col
              })
            })
          } else if (payload.eventType === 'UPDATE') {
            const updatedTask = payload.new as any
            
            setColumns(prev => {
              // First, find which column currently has this task
              const currentColumnId = prev.find(col => 
                col.tasks.some(task => task.id === updatedTask.id)
              )?.id
              
              // Check if this task belongs to this board
              const belongsToBoard = currentColumnId || prev.some(col => col.id === updatedTask.column_id)
              if (!belongsToBoard) return prev
              
              console.log(`📦 Task ${updatedTask.id} moving from column ${currentColumnId} to ${updatedTask.column_id}`)
              
              return prev.map(col => {
                // Remove from current column (if it exists there)
                if (currentColumnId && col.id === currentColumnId && col.id !== updatedTask.column_id) {
                  console.log(`🗑️ Removing task ${updatedTask.id} from column ${col.id}`)
                  return {
                    ...col,
                    tasks: col.tasks.filter(task => task.id !== updatedTask.id),
                  }
                }
                // Add to destination column or update in same column
                else if (col.id === updatedTask.column_id) {
                  const taskExists = col.tasks.some(task => task.id === updatedTask.id)
                  if (taskExists) {
                    console.log(`🔄 Updating task ${updatedTask.id} in column ${col.id}`)
                    return {
                      ...col,
                      tasks: col.tasks
                        .map(task => task.id === updatedTask.id ? updatedTask : task)
                        .sort((a, b) => a.position - b.position),
                    }
                  }
                  console.log(`➕ Adding task ${updatedTask.id} to column ${col.id}`)
                  return {
                    ...col,
                    tasks: [...col.tasks, updatedTask].sort((a, b) => a.position - b.position),
                  }
                }
                return col
              })
            })
          } else if (payload.eventType === 'DELETE') {
            const deletedTaskId = payload.old.id
            console.log(`🗑️ Deleting task ${deletedTaskId}`)
            
            setColumns(prev =>
              prev.map(col => {
                // Check if this column has the task to delete
                const hasTask = col.tasks.some(task => task.id === deletedTaskId)
                if (hasTask) {
                  console.log(`🗑️ Removing task ${deletedTaskId} from column ${col.id}`)
                  return {
                    ...col,
                    tasks: col.tasks.filter(task => task.id !== deletedTaskId),
                  }
                }
                return col
              })
            )
          }
        }
      )
      .subscribe((status, err) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime SUBSCRIBED successfully for board:', boardId)
        } else if (status === 'CLOSED') {
          console.log('❌ Realtime CLOSED for board:', boardId)
        } else if (status === 'CHANNEL_ERROR') {
          console.error('❌ Realtime ERROR for board:', boardId, err)
        } else {
          console.log('🔄 Realtime status:', status, 'for board:', boardId)
        }
      })

    // Test if we can manually trigger to see if connection works
    console.log('📡 Channel created:', channel.topic)

    return () => {
      console.log('🧹 Cleaning up realtime subscription for board:', boardId)
      supabase.removeChannel(channel)
    }
  }, [boardId, supabase])

  return { columns, setColumns }
}

