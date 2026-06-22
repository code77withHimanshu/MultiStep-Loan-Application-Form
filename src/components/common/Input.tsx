import React, { forwardRef } from 'react'
import type { InputHTMLAttributes, LabelHTMLAttributes } from 'react'

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean
}

function Label({ children, required, className = '', ...props }: LabelProps) {
  return (
    <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
      {children}
      {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
    </label>
  )
}

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ hasError, className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`
        w-full px-3 py-2 border rounded-lg text-sm transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        disabled:bg-gray-50 disabled:cursor-not-allowed
        ${hasError
          ? 'border-red-400 bg-red-50 focus:ring-red-400'
          : 'border-gray-300 bg-white hover:border-gray-400'
        }
        ${className}
      `}
      aria-invalid={hasError ? 'true' : undefined}
      {...props}
    />
  ),
)
Field.displayName = 'Input.Field'

function Error({ children, id }: { children: React.ReactNode; id?: string }) {
  if (!children) return null
  return (
    <p
      id={id}
      className="mt-1 text-xs text-red-600 flex items-center gap-1"
      role="alert"
      aria-live="polite"
    >
      <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      {children}
    </p>
  )
}

function HelpText({ children }: { children: React.ReactNode }) {
  if (!children) return null
  return <p className="mt-1 text-xs text-gray-500">{children}</p>
}

export const Input = { Label, Field, Error, HelpText }
