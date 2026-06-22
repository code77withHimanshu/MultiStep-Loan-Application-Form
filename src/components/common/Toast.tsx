import { useEffect, useState } from 'react'
import { TOAST_DISMISS_MS } from '@/utils/constants'

interface ToastProps {
  message: string
  onDismiss: () => void
  duration?: number
}

export function Toast({ message, onDismiss, duration = TOAST_DISMISS_MS }: ToastProps) {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gray-800 text-white text-sm
        px-4 py-2.5 rounded-lg shadow-lg transition-all duration-300
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      {message}
    </div>
  )
}

interface ToastManagerState {
  id: number
  message: string
}

let globalToastId = 0

export function useToast() {
  const [toasts, setToasts] = useState<ToastManagerState[]>([])

  const showToast = (message: string) => {
    globalToastId += 1
    const id = globalToastId
    setToasts((prev) => [...prev, { id, message }])
  }

  const dismissToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, showToast, dismissToast }
}
