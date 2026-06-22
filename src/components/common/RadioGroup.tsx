import { forwardRef } from 'react'
import type { InputHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
  description?: string
}

interface RadioGroupProps {
  name: string
  options: Option[]
  value?: string
  onChange?: (value: string) => void
  orientation?: 'horizontal' | 'vertical'
  hasError?: boolean
  disabled?: boolean
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, options, value, onChange, orientation = 'horizontal', hasError, disabled }, ref) => (
    <div
      ref={ref}
      role="radiogroup"
      className={`flex ${orientation === 'vertical' ? 'flex-col gap-2' : 'flex-row flex-wrap gap-3'}`}
    >
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`
            flex items-start gap-2 cursor-pointer rounded-lg border p-3 transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary hover:bg-blue-50'}
            ${value === opt.value
              ? 'border-primary bg-blue-50 ring-1 ring-primary'
              : hasError ? 'border-red-300' : 'border-gray-300'
            }
          `}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            disabled={disabled}
            className="mt-0.5 text-primary focus-visible:ring-2 focus-visible:ring-primary"
          />
          <span className="flex flex-col">
            <span className="text-sm font-medium text-gray-800">{opt.label}</span>
            {opt.description && (
              <span className="text-xs text-gray-500">{opt.description}</span>
            )}
          </span>
        </label>
      ))}
    </div>
  ),
)
RadioGroup.displayName = 'RadioGroup'
