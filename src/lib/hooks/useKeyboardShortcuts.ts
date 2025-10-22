'use client'

import { useEffect } from 'react'

export type ShortcutHandler = () => void

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  handler: ShortcutHandler
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[], enabled = true) {
  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return
      }

      for (const shortcut of shortcuts) {
        const ctrlMatch = shortcut.ctrlKey === undefined || shortcut.ctrlKey === event.ctrlKey
        const shiftMatch = shortcut.shiftKey === undefined || shortcut.shiftKey === event.shiftKey
        const metaMatch = shortcut.metaKey === undefined || shortcut.metaKey === event.metaKey
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase()

        if (ctrlMatch && shiftMatch && metaMatch && keyMatch) {
          event.preventDefault()
          shortcut.handler()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, enabled])
}

export function useGlobalShortcuts() {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: '?',
      description: 'Show keyboard shortcuts',
      handler: () => {
        alert(
          'Keyboard Shortcuts:\n\n' +
          '? - Show this help\n' +
          'n - Create new task (when on board)\n' +
          'Esc - Close modal\n' +
          'Double-click task - Edit task\n' +
          'Drag and drop - Move tasks'
        )
      },
    },
  ]

  useKeyboardShortcuts(shortcuts)
}

