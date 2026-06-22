import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useFormStore } from '@/store/formStore'
import { step8Schema, type Step8Data } from '@/schemas/step8Schema'
import { calculateEMI, calculateCostOfBorrowing, calculateProcessingFee, getInterestRate } from '@/utils/calculations'
import { formatCurrency, formatDate, generateReferenceNumber, generateApplicationId } from '@/utils/formatters'
import { LOAN_TYPE_LABELS, EMPLOYMENT_TYPE_LABELS } from '@/utils/constants'
import { Input } from '@/components/common/Input'
import { Checkbox } from '@/components/common/Checkbox'
import type { LoanType, EmploymentType } from '@/types'

interface ReviewRowProps {
  label: string
  value: string | null | undefined
}

function ReviewRow({ label, value }: ReviewRowProps) {
  if (!value) return null
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-gray-500 min-w-0 flex-shrink-0 mr-4">{label}</span>
      <span className="text-gray-800 font-medium text-right">{value}</span>
    </div>
  )
}

interface ReviewSectionProps {
  title: string
  onEdit: () => void
  children: React.ReactNode
}

function ReviewSection({ title, onEdit, children }: ReviewSectionProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-primary hover:text-primary/80 font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded"
        >
          Edit
        </button>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  )
}

interface Step8Props {
  onPrev: () => void
  onEditStep: (step: number) => void
}

export function Step8Review({ onPrev, onEditStep }: Step8Props) {
  const { formData, setSubmitted } = useFormStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loanType = formData.loanBasicInfo?.loanType as LoanType | undefined
  const loanAmount = formData.loanBasicInfo?.loanAmount ?? 0
  const loanTenure = formData.loanBasicInfo?.loanTenure ?? 0
  const interestRate = loanType ? getInterestRate(loanType) : 0
  const emi = calculateEMI(loanAmount, interestRate, loanTenure)
  const costOfBorrowing = calculateCostOfBorrowing(emi, loanTenure, loanAmount)
  const processingFee = calculateProcessingFee(loanAmount)

  const employmentType = (formData.employmentInfo as { employmentType?: EmploymentType })?.employmentType
  const monthlyIncome =
    employmentType === 'salaried'
      ? (formData.employmentInfo as { monthlyNetSalary?: number })?.monthlyNetSalary ?? 0
      : (formData.employmentInfo as { monthlyIncome?: number })?.monthlyIncome ?? 0

  const coApplicantIncome = formData.coApplicantInfo?.coApplicantIncome ?? 0
  const combinedIncome = monthlyIncome + coApplicantIncome
  const foirPercent = combinedIncome > 0 ? Math.round((emi / combinedIncome) * 100) : 0
  const highFOIR = foirPercent > 50

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Step8Data>({
    resolver: zodResolver(step8Schema),
    defaultValues: {
      confirmAccuracy: false,
      authorizeCreditCheck: false,
      agreeTerms: false,
      consentCommunications: false,
    },
  })

  const onSubmit = async () => {
    setIsSubmitting(true)
    await new Promise((res) => setTimeout(res, 1200))
    setSubmitted(true, {
      applicationId: generateApplicationId(),
      referenceNumber: generateReferenceNumber(),
      status: 'submitted',
      submittedAt: new Date().toISOString(),
      loanType: loanType!,
      loanAmount,
    })
    setIsSubmitting(false)
  }

  const personal = formData.personalInfo
  const kyc = formData.kycInfo
  const address = formData.addressInfo
  const coApp = formData.coApplicantInfo
  const sig = formData.documentsAndSignature

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-4">
        {/* Pre-Approval Summary */}
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-5 text-white">
          <h3 className="text-sm font-semibold uppercase tracking-wide opacity-80 mb-3">Pre-Approval Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs opacity-70">Loan Amount</p>
              <p className="text-xl font-bold">{formatCurrency(loanAmount)}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Interest Rate</p>
              <p className="text-xl font-bold">{interestRate}% p.a.</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Tenure</p>
              <p className="text-lg font-semibold">
                {Math.floor(loanTenure / 12)}Y {loanTenure % 12 > 0 ? `${loanTenure % 12}M` : ''}
              </p>
            </div>
            <div>
              <p className="text-xs opacity-70">Monthly EMI</p>
              <p className="text-xl font-bold">{formatCurrency(Math.round(emi))}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Total Interest</p>
              <p className="text-base font-semibold">{formatCurrency(Math.round(costOfBorrowing))}</p>
            </div>
            <div>
              <p className="text-xs opacity-70">Processing Fee</p>
              <p className="text-base font-semibold">{formatCurrency(Math.round(processingFee))}</p>
            </div>
          </div>
          {highFOIR && (
            <div className="mt-3 bg-amber-400/20 border border-amber-300/40 rounded-lg p-2">
              <p className="text-xs text-amber-200">
                ⚠ EMI-to-income ratio is {foirPercent}% (above recommended 50%). Application may require additional scrutiny.
              </p>
            </div>
          )}
        </div>

        {/* Review Sections */}
        <ReviewSection title="Loan Details" onEdit={() => onEditStep(0)}>
          <ReviewRow label="Loan Type" value={loanType ? LOAN_TYPE_LABELS[loanType] : ''} />
          <ReviewRow label="Loan Amount" value={formatCurrency(loanAmount)} />
          <ReviewRow label="Tenure" value={`${loanTenure} months`} />
          <ReviewRow label="Purpose" value={formData.loanBasicInfo?.loanPurpose} />
        </ReviewSection>

        <ReviewSection title="Personal Information" onEdit={() => onEditStep(1)}>
          <ReviewRow label="Full Name" value={personal?.fullName} />
          <ReviewRow label="Date of Birth" value={personal?.dateOfBirth ? formatDate(personal.dateOfBirth) : ''} />
          <ReviewRow label="Gender" value={personal?.gender} />
          <ReviewRow label="Email" value={personal?.email} />
          <ReviewRow label="Mobile" value={personal?.mobileNumber} />
        </ReviewSection>

        <ReviewSection title="KYC Details" onEdit={() => onEditStep(2)}>
          <ReviewRow label="PAN" value={kyc?.panNumber ? `${kyc.panNumber.substring(0, 3)}XX${kyc.panNumber[9]}` : ''} />
          <ReviewRow label="Aadhaar" value={kyc?.aadhaarNumber ? `XXXX XXXX ${kyc.aadhaarNumber.slice(-4)}` : ''} />
          <ReviewRow label="PAN Status" value={kyc?.panVerified ? 'Verified' : 'Pending'} />
          <ReviewRow label="Aadhaar Status" value={kyc?.aadhaarVerified ? 'Verified' : 'Pending'} />
        </ReviewSection>

        <ReviewSection title="Address" onEdit={() => onEditStep(3)}>
          <ReviewRow label="Current Address" value={address?.currentAddressLine1} />
          <ReviewRow label="City" value={address?.currentCity} />
          <ReviewRow label="State" value={address?.currentState} />
          <ReviewRow label="PIN Code" value={address?.currentPinCode} />
        </ReviewSection>

        <ReviewSection title="Employment" onEdit={() => onEditStep(4)}>
          <ReviewRow
            label="Employment Type"
            value={employmentType ? EMPLOYMENT_TYPE_LABELS[employmentType] : ''}
          />
          {employmentType === 'salaried' && (
            <>
              <ReviewRow label="Company" value={(formData.employmentInfo as { companyName?: string })?.companyName} />
              <ReviewRow label="Monthly Salary" value={formatCurrency(monthlyIncome)} />
            </>
          )}
          {(employmentType === 'self_employed' || employmentType === 'business_owner') && (
            <>
              <ReviewRow label="Business" value={(formData.employmentInfo as { businessName?: string })?.businessName} />
              <ReviewRow label="Monthly Income" value={formatCurrency(monthlyIncome)} />
            </>
          )}
        </ReviewSection>

        {coApp?.coApplicantName && (
          <ReviewSection title="Co-Applicant" onEdit={() => onEditStep(5)}>
            <ReviewRow label="Name" value={coApp.coApplicantName} />
            <ReviewRow label="Relationship" value={coApp.relationship} />
            <ReviewRow label="Monthly Income" value={formatCurrency(coApp.coApplicantIncome ?? 0)} />
          </ReviewSection>
        )}

        {sig?.eSignature && (
          <div className="border border-gray-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">E-Signature</h3>
            <img
              src={sig.eSignature}
              alt="Your electronic signature"
              className="border border-gray-200 rounded max-h-20 bg-white"
            />
          </div>
        )}

        {/* 4 Consent Checkboxes */}
        <div className="border border-gray-200 rounded-xl p-4 space-y-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Declaration & Consent
          </h3>

          {[
            {
              name: 'confirmAccuracy' as const,
              label: 'I confirm that all information provided in this application is true, correct, and complete to the best of my knowledge.',
            },
            {
              name: 'authorizeCreditCheck' as const,
              label: 'I authorise LendSwift to check my credit score and credit history from CIBIL, Equifax, or other credit bureaus.',
            },
            {
              name: 'agreeTerms' as const,
              label: (
                <>
                  I have read and agree to the{' '}
                  <span className="text-primary underline cursor-pointer">Terms and Conditions</span>{' '}
                  and <span className="text-primary underline cursor-pointer">Privacy Policy</span> of LendSwift.
                </>
              ),
            },
            {
              name: 'consentCommunications' as const,
              label: 'I consent to receive communications (SMS, email, WhatsApp) from LendSwift regarding this application and future offers.',
            },
          ].map(({ name, label }) => (
            <div key={name}>
              <Controller
                name={name}
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id={name}
                    label={label}
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    hasError={!!errors[name]}
                    errorId={`${name}Error`}
                  />
                )}
              />
              {errors[name] && (
                <Input.Error id={`${name}Error`}>{errors[name]?.message}</Input.Error>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onPrev}
            disabled={isSubmitting}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-colors disabled:opacity-50"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting && (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            )}
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </div>
    </form>
  )
}
