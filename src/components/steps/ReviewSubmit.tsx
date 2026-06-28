import { useState } from 'react'
import { useFormStore } from '@/store/formStore'
import { apiService } from '@/services/api'

function ReviewRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null
  return (
    <div className="flex justify-between py-1.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  )
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string
  onEdit: () => void
  children: React.ReactNode
}) {
  return (
    <div className="border border-gray-200 rounded-xl p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">{title}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-xs text-primary hover:text-primary/80 font-medium"
        >
          Edit
        </button>
      </div>
      <div className="divide-y divide-gray-100">{children}</div>
    </div>
  )
}

const LOAN_TYPE_LABELS: Record<string, string> = {
  personal: 'Personal Loan',
  home: 'Home Loan',
  business: 'Business Loan',
  car: 'Car Loan',
  education: 'Education Loan',
}

export default function ReviewSubmit() {
  const { formData, prevStep, goToStep, setSubmitted } = useFormStore()
  const [agreed, setAgreed] = useState(false)
  const [declarationError, setDeclarationError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { personalInfo, employmentInfo, loanDetails } = formData

  const fullName = [personalInfo?.firstName, personalInfo?.lastName].filter(Boolean).join(' ')
    || personalInfo?.fullName
    || ''

  const loanTypeLabel = loanDetails?.loanType ? LOAN_TYPE_LABELS[loanDetails.loanType] ?? loanDetails.loanType : ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) {
      setDeclarationError('You must agree to the declaration to submit')
      return
    }
    setDeclarationError('')
    setIsSubmitting(true)
    try {
      const response = await apiService.submitApplication(formData)
      if (response.success) {
        setSubmitted(true, response.data)
      }
    } catch {
      setDeclarationError('Submission failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Review &amp; Submit</h2>

      <div className="space-y-4">
        <ReviewSection title="Personal Information" onEdit={() => goToStep(0)}>
          <ReviewRow label="Name" value={fullName} />
          <ReviewRow label="Email" value={personalInfo?.email} />
          <ReviewRow label="Phone" value={personalInfo?.phone ?? personalInfo?.mobileNumber} />
          <ReviewRow label="PAN" value={personalInfo?.panNumber} />
          <ReviewRow label="Date of Birth" value={personalInfo?.dateOfBirth} />
        </ReviewSection>

        <ReviewSection title="Employment &amp; Income" onEdit={() => goToStep(2)}>
          <ReviewRow label="Employment Type" value={employmentInfo?.employmentType} />
          <ReviewRow
            label="Employer"
            value={employmentInfo?.employerName ?? employmentInfo?.companyName}
          />
          <ReviewRow
            label="Monthly Net Income"
            value={
              employmentInfo?.monthlyNetIncome
                ? `₹${employmentInfo.monthlyNetIncome}`
                : employmentInfo?.monthlyNetSalary
                ? `₹${employmentInfo.monthlyNetSalary}`
                : undefined
            }
          />
        </ReviewSection>

        <ReviewSection title="Loan Details" onEdit={() => goToStep(3)}>
          <ReviewRow label="Loan Type" value={loanTypeLabel} />
          <ReviewRow
            label="Loan Amount"
            value={loanDetails?.loanAmount ? `₹${loanDetails.loanAmount}` : undefined}
          />
          <ReviewRow
            label="Tenure"
            value={loanDetails?.tenure ? `${loanDetails.tenure} months` : undefined}
          />
        </ReviewSection>
      </div>

      <div className="mt-5 flex items-start gap-2">
        <input
          type="checkbox"
          id="declaration"
          data-testid="declaration-checkbox"
          checked={agreed}
          onChange={(e) => {
            setAgreed(e.target.checked)
            if (e.target.checked) setDeclarationError('')
          }}
          className="mt-0.5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="declaration" className="text-xs text-gray-600 cursor-pointer">
          I declare that all information provided is accurate and complete. I authorise LendSwift to
          verify my details and process my loan application.
        </label>
      </div>
      {declarationError && (
        <p role="alert" className="mt-1 text-xs text-red-600">{declarationError}</p>
      )}

      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          data-testid="submit-btn"
          disabled={isSubmitting}
          className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </form>
  )
}
