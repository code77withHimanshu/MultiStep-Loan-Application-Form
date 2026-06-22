import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStore } from '@/store/formStore'
import { step3Schema, type Step3Data } from '@/schemas/step3Schema'
import { useVerification } from '@/hooks/useVerification'
import { Input } from '@/components/common/Input'
import { Checkbox } from '@/components/common/Checkbox'
import { VerificationBadge } from '@/components/common/VerificationBadge'
import type { LoanType } from '@/types'

interface Step3Props {
  onNext: (data: Step3Data) => void
  onPrev: () => void
}

export function Step3KYC({ onNext, onPrev }: Step3Props) {
  const { formData } = useFormStore()
  const saved = formData.kycInfo
  const loanType = formData.loanBasicInfo?.loanType as LoanType | undefined

  const panVerification = useVerification('PAN', loanType)
  const aadhaarVerification = useVerification('AADHAAR')

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Step3Data>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      panNumber: saved?.panNumber ?? '',
      panVerified: saved?.panVerified ?? false,
      aadhaarNumber: saved?.aadhaarNumber ?? '',
      aadhaarVerified: saved?.aadhaarVerified ?? false,
      aadhaarConsent: saved?.aadhaarConsent ?? false,
      voterId: saved?.voterId ?? '',
      passport: saved?.passport ?? '',
    },
  })

  const panValue = watch('panNumber')
  const aadhaarValue = watch('aadhaarNumber')

  const handlePANBlur = () => {
    const upper = panValue?.toUpperCase() ?? ''
    setValue('panNumber', upper)
    panVerification.verify(upper)
    if (panVerification.isVerified) {
      setValue('panVerified', true)
    }
  }

  const handleAadhaarBlur = () => {
    aadhaarVerification.verify(aadhaarValue ?? '')
    if (aadhaarVerification.isVerified) {
      setValue('aadhaarVerified', true)
    }
  }

  // Sync verification state to form
  if (panVerification.isVerified && !watch('panVerified')) {
    setValue('panVerified', true)
  }
  if (aadhaarVerification.isVerified && !watch('aadhaarVerified')) {
    setValue('aadhaarVerified', true)
  }

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-5">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
          Your KYC details are encrypted and stored securely as per RBI guidelines.
        </div>

        <div>
          <Input.Label htmlFor="panNumber" required>PAN Number</Input.Label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input.Field
                id="panNumber"
                placeholder="ABCDE1234F"
                maxLength={10}
                hasError={!!errors.panNumber}
                {...register('panNumber', {
                  setValueAs: (v: string) => v.toUpperCase(),
                })}
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
          {errors.panNumber && <Input.Error>{errors.panNumber.message}</Input.Error>}
          {errors.panVerified && !panVerification.error && (
            <Input.Error>{errors.panVerified.message}</Input.Error>
          )}
          <Input.HelpText>Format: 5 letters + 4 digits + 1 letter (e.g., ABCDE1234F)</Input.HelpText>
        </div>

        <div>
          <div className="mb-2">
            <Controller
              name="aadhaarConsent"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="aadhaarConsent"
                  label="I consent to verification of my Aadhaar details with UIDAI as per the Aadhaar Act, 2016"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  hasError={!!errors.aadhaarConsent}
                  errorId="aadhaarConsentError"
                />
              )}
            />
            {errors.aadhaarConsent && (
              <Input.Error id="aadhaarConsentError">{errors.aadhaarConsent.message}</Input.Error>
            )}
          </div>
        </div>

        <div>
          <Input.Label htmlFor="aadhaarNumber" required>Aadhaar Number</Input.Label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Input.Field
                id="aadhaarNumber"
                placeholder="Enter 12-digit Aadhaar number"
                maxLength={12}
                inputMode="numeric"
                hasError={!!errors.aadhaarNumber}
                {...register('aadhaarNumber')}
                onBlur={handleAadhaarBlur}
                className="font-mono"
              />
            </div>
            <VerificationBadge
              isVerifying={aadhaarVerification.isVerifying}
              isVerified={aadhaarVerification.isVerified}
              error={null}
            />
          </div>
          {aadhaarVerification.error && <Input.Error>{aadhaarVerification.error}</Input.Error>}
          {errors.aadhaarNumber && <Input.Error>{errors.aadhaarNumber.message}</Input.Error>}
          {errors.aadhaarVerified && !aadhaarVerification.error && (
            <Input.Error>{errors.aadhaarVerified.message}</Input.Error>
          )}
          <Input.HelpText>Aadhaar number will be masked after verification</Input.HelpText>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Additional ID (Optional)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input.Label htmlFor="voterId">Voter ID</Input.Label>
              <Input.Field
                id="voterId"
                placeholder="ABC1234567"
                maxLength={10}
                hasError={!!errors.voterId}
                {...register('voterId')}
                className="font-mono uppercase"
              />
              {errors.voterId && <Input.Error>{errors.voterId.message}</Input.Error>}
            </div>
            <div>
              <Input.Label htmlFor="passport">Passport Number</Input.Label>
              <Input.Field
                id="passport"
                placeholder="A1234567"
                maxLength={8}
                hasError={!!errors.passport}
                {...register('passport')}
                className="font-mono uppercase"
              />
              {errors.passport && <Input.Error>{errors.passport.message}</Input.Error>}
            </div>
          </div>
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
