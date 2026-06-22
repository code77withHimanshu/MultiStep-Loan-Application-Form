import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value' | 'type'> {
  value?: number | ''
  onChange?: (value: number | '') => void
  hasError?: boolean
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, hasError, className = '', onBlur, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState<string>(
      value !== undefined && value !== '' ? value.toString() : '',
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/[^0-9]/g, '')
      setDisplayValue(raw)
      if (raw === '') {
        onChange?.('')
      } else {
        onChange?.(Number(raw))
      }
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      onBlur?.(e)
    }

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">
          ₹
        </span>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`
            w-full pl-7 pr-3 py-2 border rounded-lg text-sm transition-colors duration-150
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
      </div>
    )
  },
)
CurrencyInput.displayName = 'CurrencyInput'
