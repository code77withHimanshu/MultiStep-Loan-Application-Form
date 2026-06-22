import type { ReactNode } from 'react'

interface FormFieldProps {
  label?: string
  required?: boolean
  hint?: string
  error?: string
  children: ReactNode
  className?: string
}

export default function FormField({
  label,
  required,
  hint,
  error,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label className="text-sm font-semibold text-slate-900 flex items-center gap-1">
          {label}
          {required && <span className="text-red-600 font-bold">*</span>}
        </label>
      )}
      {children}
      {hint && !error && <span className="text-xs text-slate-400">{hint}</span>}
      {error && (
        <span className="text-xs text-red-600 flex items-center gap-1" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {error}
        </span>
      )}
    </div>
  )
}
