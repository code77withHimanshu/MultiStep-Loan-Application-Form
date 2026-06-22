import { forwardRef } from 'react'
import type { SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
  placeholder?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError, placeholder, options, className = '', ...props }, ref) => (
    <select
      ref={ref}
      className={`
        w-full px-3 py-2 border rounded-lg text-sm bg-white transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
        disabled:bg-gray-50 disabled:cursor-not-allowed appearance-none
        ${hasError
          ? 'border-red-400 bg-red-50 focus:ring-red-400'
          : 'border-gray-300 hover:border-gray-400'
        }
        ${className}
      `}
      aria-invalid={hasError ? 'true' : undefined}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
)
Select.displayName = 'Select'
