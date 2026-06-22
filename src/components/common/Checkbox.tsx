import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string | React.ReactNode
  hasError?: boolean
  errorId?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, hasError, errorId, className = '', id, ...props }, ref) => (
    <label
      htmlFor={id}
      className={`flex items-start gap-3 cursor-pointer group ${className}`}
    >
      <input
        ref={ref}
        type="checkbox"
        id={id}
        aria-describedby={errorId}
        aria-invalid={hasError ? 'true' : undefined}
        className={`
          mt-0.5 h-4 w-4 rounded border transition-colors cursor-pointer flex-shrink-0
          focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1
          ${hasError ? 'border-red-400 text-red-500' : 'border-gray-300 text-primary'}
        `}
        {...props}
      />
      <span className={`text-sm leading-relaxed ${hasError ? 'text-red-700' : 'text-gray-700'}`}>
        {label}
      </span>
    </label>
  ),
)
Checkbox.displayName = 'Checkbox'
