import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStore } from '@/store/formStore'
import { step6Schema, type Step6Data } from '@/schemas/step6Schema'
import { useVerification } from '@/hooks/useVerification'
import { CO_APPLICANT_RELATIONSHIP_LABELS } from '@/utils/constants'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Checkbox } from '@/components/common/Checkbox'
import { CurrencyInput } from '@/components/common/CurrencyInput'
import { VerificationBadge } from '@/components/common/VerificationBadge'
import type { LoanType } from '@/types'

const relationshipOptions = Object.entries(CO_APPLICANT_RELATIONSHIP_LABELS).map(([value, label]) => ({
  value,
  label,
}))

interface Step6Props {
  onNext: (data: Step6Data) => void
  onPrev: () => void
}

export function Step6CoApplicant({ onNext, onPrev }: Step6Props) {
  const { formData } = useFormStore()
  const saved = formData.coApplicantInfo
  const loanType = formData.loanBasicInfo?.loanType as LoanType | undefined
  const loanAmount = formData.loanBasicInfo?.loanAmount ?? 0

  const panVerification = useVerification('PAN', loanType)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step6Data>({
    resolver: zodResolver(step6Schema),
    defaultValues: {
      coApplicantName: saved?.coApplicantName ?? '',
      relationship: saved?.relationship ?? undefined,
      coApplicantPAN: saved?.coApplicantPAN ?? '',
      coApplicantPANVerified: saved?.coApplicantPANVerified ?? false,
      coApplicantIncome: saved?.coApplicantIncome ?? undefined,
      coApplicantConsent: saved?.coApplicantConsent ?? false,
    },
  })

  const panValue = watch('coApplicantPAN')

  const handlePANBlur = () => {
    const upper = panValue?.toUpperCase() ?? ''
    setValue('coApplicantPAN', upper)
    panVerification.verify(upper)
  }

  if (panVerification.isVerified && !watch('coApplicantPANVerified')) {
    setValue('coApplicantPANVerified', true)
  }

  const formatAmount = (amount: number) =>
    amount > 0 ? `₹${amount.toLocaleString('en-IN')}` : ''

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
          <strong>Co-Applicant Required:</strong>{' '}
          {loanType === 'home' && 'A co-applicant is mandatory for Home Loans.'}
          {loanType === 'personal' && `Co-applicant required for Personal Loans above ₹5,00,000 (your amount: ${formatAmount(loanAmount)}).`}
          {loanType === 'business' && `Co-applicant required for Business Loans above ₹20,00,000 (your amount: ${formatAmount(loanAmount)}).`}
        </div>

        <div>
          <Input.Label htmlFor="coApplicantName" required>Co-Applicant Full Name</Input.Label>
          <Input.Field
            id="coApplicantName"
            placeholder="Co-applicant's full name"
            hasError={!!errors.coApplicantName}
            {...register('coApplicantName')}
          />
          {errors.coApplicantName && <Input.Error>{errors.coApplicantName.message}</Input.Error>}
        </div>

        <div>
          <Input.Label htmlFor="relationship" required>Relationship with Applicant</Input.Label>
          <Select
            id="relationship"
            placeholder="Select relationship"
            options={relationshipOptions}
            hasError={!!errors.relationship}
            value={watch('relationship') ?? ''}
            onChange={(e) => setValue('relationship', e.target.value as Step6Data['relationship'], { shouldValidate: true })}
          />
          {errors.relationship && <Input.Error>{errors.relationship.message}</Input.Error>}
        </div>

        <div>
          <Input.Label htmlFor="coApplicantPAN" required>Co-Applicant PAN Number</Input.Label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input.Field
                id="coApplicantPAN"
                placeholder="ABCDE1234F"
                maxLength={10}
                hasError={!!errors.coApplicantPAN}
                {...register('coApplicantPAN', { setValueAs: (v: string) => v.toUpperCase() })}
                onBlur={handlePANBlur}
                className="font-mono uppercase"
              />
            </div>
            <VerificationBadge
              isVerifying={panVerification.isVerifying}
              isVerified={panVerification.isVerified}
              error={null}
            />
          </div>
          {panVerification.error && <Input.Error>{panVerification.error}</Input.Error>}
          {errors.coApplicantPAN && <Input.Error>{errors.coApplicantPAN.message}</Input.Error>}
          {errors.coApplicantPANVerified && !panVerification.error && (
            <Input.Error>{errors.coApplicantPANVerified.message}</Input.Error>
          )}
        </div>

        <div>
          <Input.Label htmlFor="coApplicantIncome" required>Co-Applicant Monthly Income</Input.Label>
          <Controller
            name="coApplicantIncome"
            control={control}
            render={({ field }) => (
              <CurrencyInput
                id="coApplicantIncome"
                value={field.value ?? ''}
                onChange={(val) => field.onChange(val)}
                hasError={!!errors.coApplicantIncome}
                placeholder="Monthly income"
              />
            )}
          />
          {errors.coApplicantIncome && <Input.Error>{errors.coApplicantIncome.message}</Input.Error>}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Controller
            name="coApplicantConsent"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="coApplicantConsent"
                label="The co-applicant has consented to be added to this loan application and authorises LendSwift to perform a credit check"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                hasError={!!errors.coApplicantConsent}
              />
            )}
          />
          {errors.coApplicantConsent && <Input.Error>{errors.coApplicantConsent.message}</Input.Error>}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-colors"
          >
            Back
          </button>
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
