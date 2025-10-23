'use client'

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { useState } from 'react'
import { useBoard } from '@/lib/hooks/useBoard'
import { useSupabase } from '@/components/providers/SupabaseProvider'
import { calculateNewPosition } from '@/lib/utils/reorder'
import { ColumnWithTasks, Task } from '@/lib/utils/types'
import type { TaskUpdate } from '@/lib/supabase/types'
import Column from './Column'
import TaskCard from './TaskCard'
import KeyboardShortcutsHelper from './KeyboardShortcutsHelper'

interface KanbanBoardProps {
  boardId: string
  initialColumns: ColumnWithTasks[]
}

export default function KanbanBoard({ boardId, initialColumns }: KanbanBoardProps) {
  const { columns, setColumns } = useBoard(boardId, initialColumns)
  const { supabase } = useSupabase()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const taskId = active.id as string

    for (const column of columns) {
      const task = column.tasks.find(t => t.id === taskId)
      if (task) {
        setActiveTask(task)
        break
      }
    }
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string

    let sourceColumn: ColumnWithTasks | undefined
    let taskToMove: Task | undefined
    let taskIndex = -1

    for (const column of columns) {
      const index = column.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) {
        sourceColumn = column
        taskToMove = column.tasks[index]
        taskIndex = index
        break
      }
    }

    if (!sourceColumn || !taskToMove) return

    let targetColumnId: string
    let targetIndex: number

    const targetColumn = columns.find(col => col.id === overId)
    if (targetColumn) {
      targetColumnId = targetColumn.id
      targetIndex = targetColumn.tasks.length
    } else {
      const targetTask = columns
        .flatMap(col => col.tasks.map(task => ({ task, columnId: col.id })))
        .find(({ task }) => task.id === overId)

      if (!targetTask) return

      targetColumnId = targetTask.columnId
      const targetCol = columns.find(col => col.id === targetColumnId)!
      targetIndex = targetCol.tasks.findIndex(t => t.id === overId)
    }

    if (sourceColumn.id === targetColumnId && taskIndex === targetIndex) {
      return
    }

    const updatedColumns = columns.map(col => {
      if (col.id === sourceColumn.id) {
        return {
          ...col,
          tasks: col.tasks.filter(t => t.id !== taskId),
        }
      }
      return col
    })

    const newColumns = updatedColumns.map(col => {
      if (col.id === targetColumnId) {
        const newTasks = [...col.tasks]
        newTasks.splice(targetIndex, 0, taskToMove)
        return { ...col, tasks: newTasks }
      }
      return col
    })

    setColumns(newColumns)

    const tasksInTargetColumn = newColumns.find(col => col.id === targetColumnId)!.tasks
    const movedTaskIndex = tasksInTargetColumn.findIndex(t => t.id === taskId)
    
    const previousTask = movedTaskIndex > 0 ? tasksInTargetColumn[movedTaskIndex - 1] : null
    const nextTask = movedTaskIndex < tasksInTargetColumn.length - 1 ? tasksInTargetColumn[movedTaskIndex + 1] : null

    const newPosition = calculateNewPosition(
      previousTask?.position ?? null,
      nextTask?.position ?? null
    )

    const updates: TaskUpdate = {
      column_id: targetColumnId,
      position: newPosition,
    }

    const { error } = await (supabase
      .from('tasks') as any)
      .update(updates)
      .eq('id', taskId)

    if (error) {
      console.error('Error updating task:', error)
      setColumns(columns)
    }
  }

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map(column => (
            <Column key={column.id} column={column} />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rotate-3 opacity-80">
              <TaskCard task={activeTask} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <KeyboardShortcutsHelper />
    </>
  )
}

