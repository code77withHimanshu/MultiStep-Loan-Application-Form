import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStore } from '@/store/formStore'
import { step1Schema, type Step1Data } from '@/schemas/step1Schema'
import { LOAN_PURPOSES, LOAN_AMOUNT_LIMITS, LOAN_TENURE_LIMITS, LOAN_INTEREST_RATES, LOAN_TYPE_LABELS } from '@/utils/constants'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { CurrencyInput } from '@/components/common/CurrencyInput'
import type { LoanType } from '@/types'

const LOAN_TYPE_OPTIONS = [
  {
    type: 'personal' as LoanType,
    label: 'Personal Loan',
    icon: '👤',
    description: 'For personal expenses, medical, travel, or emergencies',
    rate: '10.5%',
  },
  {
    type: 'home' as LoanType,
    label: 'Home Loan',
    icon: '🏠',
    description: 'Purchase, construct, or renovate your home',
    rate: '8.5%',
  },
  {
    type: 'business' as LoanType,
    label: 'Business Loan',
    icon: '💼',
    description: 'Working capital, expansion, or equipment financing',
    rate: '14%',
  },
]

interface Step1Props {
  onNext: (data: Step1Data) => void
}

export function Step1LoanType({ onNext }: Step1Props) {
  const { formData } = useFormStore()
  const saved = formData.loanBasicInfo

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1Data>({
    resolver: zodResolver(step1Schema),
    defaultValues: saved?.loanType
      ? {
          loanType: saved.loanType,
          loanAmount: saved.loanAmount,
          loanTenure: saved.loanTenure,
          loanPurpose: saved.loanPurpose,
          referralCode: saved.referralCode ?? '',
        }
      : { loanType: 'personal', loanAmount: undefined, loanTenure: undefined, loanPurpose: '' },
  })

  const loanType = watch('loanType') as LoanType | undefined
  const loanAmount = watch('loanAmount')

  const limits = loanType ? LOAN_AMOUNT_LIMITS[loanType] : null
  const tenureLimits = loanType ? LOAN_TENURE_LIMITS[loanType] : null
  const purposes = loanType ? LOAN_PURPOSES[loanType] : []
  const rate = loanType ? LOAN_INTEREST_RATES[loanType] : null

  const purposeOptions = purposes.map((p) => ({ value: p, label: p }))

  const tenureOptions = tenureLimits
    ? Array.from({ length: Math.floor((tenureLimits.max - tenureLimits.min) / 12) + 1 }, (_, i) => {
        const months = tenureLimits.min + i * 12
        if (months > tenureLimits.max) return null
        const years = Math.floor(months / 12)
        const label = years > 0 ? `${years} Year${years > 1 ? 's' : ''} (${months} months)` : `${months} months`
        return { value: String(months), label }
      }).filter(Boolean) as { value: string; label: string }[]
    : []

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-6">
        <div>
          <Input.Label required>Select Loan Type</Input.Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            {LOAN_TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                onClick={() => {
                  setValue('loanType', opt.type, { shouldValidate: true })
                  setValue('loanPurpose', '')
                  setValue('loanAmount', undefined as unknown as number)
                  setValue('loanTenure', undefined as unknown as number)
                }}
                className={`
                  text-left p-4 rounded-xl border-2 transition-all duration-150 focus-visible:outline-none
                  focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
                  ${loanType === opt.type
                    ? 'border-primary bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }
                `}
                aria-pressed={loanType === opt.type}
              >
                <span className="text-2xl block mb-2" aria-hidden="true">{opt.icon}</span>
                <span className="font-semibold text-sm text-gray-800 block">{opt.label}</span>
                <span className="text-xs text-gray-500 block mt-1">{opt.description}</span>
                <span className="text-xs font-semibold text-primary mt-2 block">Rate: {opt.rate} p.a.</span>
              </button>
            ))}
          </div>
          {errors.loanType && <Input.Error>{errors.loanType.message}</Input.Error>}
        </div>

        {loanType && (
          <>
            <div>
              <Input.Label htmlFor="loanAmount" required>
                Loan Amount
                {limits && (
                  <span className="text-gray-400 font-normal ml-1 text-xs">
                    (₹{limits.min.toLocaleString('en-IN')} – ₹{limits.max.toLocaleString('en-IN')})
                  </span>
                )}
              </Input.Label>
              <CurrencyInput
                id="loanAmount"
                value={loanAmount ?? ''}
                onChange={(val) => setValue('loanAmount', val as number, { shouldValidate: true })}
                hasError={!!errors.loanAmount}
                placeholder="Enter loan amount"
              />
              {errors.loanAmount && <Input.Error>{errors.loanAmount.message}</Input.Error>}
              {rate && loanAmount && (
                <Input.HelpText>
                  Interest rate: {rate}% p.a. | {LOAN_TYPE_LABELS[loanType]}
                </Input.HelpText>
              )}
            </div>

            <div>
              <Input.Label htmlFor="loanTenure" required>Loan Tenure</Input.Label>
              <Select
                id="loanTenure"
                placeholder="Select tenure"
                options={tenureOptions}
                hasError={!!errors.loanTenure}
                {...register('loanTenure', { valueAsNumber: true })}
              />
              {errors.loanTenure && <Input.Error>{errors.loanTenure.message}</Input.Error>}
            </div>

            <div>
              <Input.Label htmlFor="loanPurpose" required>Loan Purpose</Input.Label>
              <Select
                id="loanPurpose"
                placeholder="Select purpose"
                options={purposeOptions}
                hasError={!!errors.loanPurpose}
                {...register('loanPurpose')}
              />
              {errors.loanPurpose && <Input.Error>{errors.loanPurpose.message}</Input.Error>}
            </div>

            <div>
              <Input.Label htmlFor="referralCode">Referral Code (Optional)</Input.Label>
              <Input.Field
                id="referralCode"
                placeholder="Enter referral code"
                className="uppercase"
                {...register('referralCode')}
              />
            </div>
          </>
        )}

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="px-8 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  )
}
