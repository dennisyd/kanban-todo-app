'use client'

import { useEffect, useState } from 'react'

export default function KeyboardShortcutsHelper() {
  const [showHelp, setShowHelp] = useState(false)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === '?' && !showHelp) {
        const target = event.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          event.preventDefault()
          setShowHelp(true)
        }
      } else if (event.key === 'Escape' && showHelp) {
        setShowHelp(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showHelp])

  if (!showHelp) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-800 dark:bg-gray-700 text-white px-3 py-2 rounded-lg shadow-lg text-sm">
        Press <kbd className="px-2 py-1 bg-gray-700 dark:bg-gray-600 rounded">?</kbd> for shortcuts
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Keyboard Shortcuts
          </h2>
          <button
            onClick={() => setShowHelp(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-3">
          <ShortcutItem keys={['?']} description="Show this help" />
          <ShortcutItem keys={['Esc']} description="Close modals" />
          <ShortcutItem keys={['Double-click']} description="Edit task" />
          <ShortcutItem keys={['Drag & Drop']} description="Move tasks between columns" />
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs">Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  )
}

function ShortcutItem({ keys, description }: { keys: string[], description: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 dark:text-gray-300">{description}</span>
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <kbd
            key={i}
            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded text-sm font-mono"
          >
            {key}
          </kbd>
        ))}
      </div>
    </div>
  )
}

