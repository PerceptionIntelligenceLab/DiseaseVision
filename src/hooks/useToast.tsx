import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'

export type ToastInput = {
  title: string
  description?: string
  duration?: number
  variant?: 'default' | 'destructive'
}

type ToastContextValue = {
  toast: (input: ToastInput) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<ToastInput | null>(null)

  const toast = useCallback((input: ToastInput) => {
    setCurrent(input)
    window.setTimeout(() => setCurrent(null), input.duration ?? 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {current && (
        <div
          role="status"
          className={`fixed bottom-6 right-6 z-[100] max-w-sm rounded-lg border p-4 shadow-lg ${
            current.variant === 'destructive'
              ? 'border-red-200 bg-red-50'
              : 'border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900'
          }`}
        >
          <p
            className={`font-semibold ${
              current.variant === 'destructive' ? 'text-red-900' : 'text-zinc-900 dark:text-zinc-50'
            }`}
          >
            {current.title}
          </p>
          {current.description ? (
            <p
              className={`mt-1 text-sm ${
                current.variant === 'destructive' ? 'text-red-800' : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {current.description}
            </p>
          ) : null}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
