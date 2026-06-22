import { useState } from 'react'
import { useFormStore } from '@/store/formStore'
import { apiService } from '@/services/api'
import { LOAN_TYPE_LABELS, EMPLOYMENT_TYPE_LABELS, GENDER_LABELS, MARITAL_STATUS_LABELS } from '@/utils/constants'
import { formatCurrency, formatDate, formatMonthYear, formatOrdinal } from '@/utils/formatters'
import { calculateEMI, getInterestRate } from '@/utils/calculations'

function Section({ title, step, children }: { title: string; step: number; children: React.ReactNode }) {
  const goToStep = useFormStore((s) => s.goToStep)
  return (
    <div className="review-section">
      <div className="review-section-title">
        <span>{title}</span>
        <button onClick={() => goToStep(step)} className="text-xs font-medium text-blue-700 border-none bg-none cursor-pointer underline hover:no-underline">Edit</button>
      </div>
      {children}
    </div>
  )
}

function Row({ label, value, wide }: { label: string; value?: string | null; wide?: boolean }) {
  if (!value && value !== '0') return null
  return (
    <div className={`review-item ${wide ? 'col-span-2' : ''}`}>
      <span className="review-item-label">{label}</span>
      <span className="review-item-value">{value}</span>
    </div>
  )
}

export default function ReviewSubmit() {
  const { formData, prevStep, setSubmitted } = useFormStore()
  const [agreed, setAgreed] = useState(false)
  const [agreementError, setAgreementError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const { personalInfo, addressInfo, employmentInfo, loanDetails, documents, signature } = formData
  const interestRate = getInterestRate(loanDetails.loanType)
  const emi = calculateEMI(loanDetails.loanAmount, interestRate, loanDetails.tenure)

  const currentAddr = [addressInfo.currentAddressLine1, addressInfo.currentAddressLine2, addressInfo.currentCity, addressInfo.currentState, addressInfo.currentZip, addressInfo.currentCountry].filter(Boolean).join(', ')
  const permanentAddr = addressInfo.sameAsPermanent
    ? 'Same as current address'
    : [addressInfo.permanentAddressLine1, addressInfo.permanentAddressLine2, addressInfo.permanentCity, addressInfo.permanentState, addressInfo.permanentZip, addressInfo.permanentCountry].filter(Boolean).join(', ')

  const handleSubmit = async () => {
    if (!agreed) {
      setAgreementError('You must agree to the declaration before submitting.')
      return
    }
    setSubmitting(true)
    setSubmitError('')
    try {
      const response = await apiService.submitApplication(formData)
      if (response.success && response.data) {
        setSubmitted(true, response.data)
      } else {
        setSubmitError('Submission failed. Please try again.')
      }
    } catch {
      setSubmitError('An unexpected error occurred. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <div className="px-10 py-9">
        <div className="mb-7">
          <h2 className="text-xl font-bold text-slate-900 mb-1.5">Review &amp; Submit</h2>
          <p className="text-sm text-slate-500">Please review all details carefully before submitting your application.</p>
        </div>

        <Section title="Personal Information" step={0}>
          <div className="review-grid">
            <Row label="Full Name" value={`${personalInfo.firstName} ${personalInfo.lastName}`} />
            <Row label="Email" value={personalInfo.email} />
            <Row label="Mobile" value={`+91 ${personalInfo.phone}`} />
            <Row label="Date of Birth" value={formatDate(personalInfo.dateOfBirth)} />
            <Row label="Gender" value={GENDER_LABELS[personalInfo.gender] ?? personalInfo.gender} />
            <Row label="Marital Status" value={MARITAL_STATUS_LABELS[personalInfo.maritalStatus] ?? personalInfo.maritalStatus} />
            <Row label="Nationality" value={personalInfo.nationality} />
            <Row label="PAN Number" value={personalInfo.panNumber} />
          </div>
        </Section>

        <Section title="Address Information" step={1}>
          <div className="review-grid">
            <Row label="Current Address" value={currentAddr} wide />
            <Row label="Permanent Address" value={permanentAddr} wide />
          </div>
        </Section>

        <Section title="Employment &amp; Income" step={2}>
          <div className="review-grid">
            <Row label="Employment Type" value={EMPLOYMENT_TYPE_LABELS[employmentInfo.employmentType] ?? employmentInfo.employmentType} />
            <Row label="Work Experience" value={employmentInfo.workExperience ? `${employmentInfo.workExperience} years` : undefined} />
            <Row label="Employer / Business" value={employmentInfo.employerName} />
            <Row label="Job Title" value={employmentInfo.jobTitle} />
            <Row label="Employment Since" value={formatMonthYear(employmentInfo.employmentStartDate)} />
            <Row label="Monthly Gross Income" value={employmentInfo.monthlyGrossIncome ? formatCurrency(employmentInfo.monthlyGrossIncome) : undefined} />
            <Row label="Monthly Net Income" value={employmentInfo.monthlyNetIncome ? formatCurrency(employmentInfo.monthlyNetIncome) : undefined} />
          </div>
        </Section>

        <Section title="Loan Details" step={3}>
          <div className="review-grid">
            <Row label="Loan Type" value={LOAN_TYPE_LABELS[loanDetails.loanType as keyof typeof LOAN_TYPE_LABELS] ?? loanDetails.loanType} />
            <Row label="Loan Amount" value={loanDetails.loanAmount ? formatCurrency(loanDetails.loanAmount) : undefined} />
            <Row label="Tenure" value={loanDetails.tenure ? `${loanDetails.tenure} months (${(Number(loanDetails.tenure) / 12).toFixed(1)} years)` : undefined} />
            <Row label="Interest Rate" value={interestRate ? `${interestRate}% per annum` : undefined} />
            <Row label="Monthly EMI" value={emi ? formatCurrency(emi) : undefined} />
            <Row label="Preferred EMI Date" value={loanDetails.preferredEMIDate ? `${formatOrdinal(Number(loanDetails.preferredEMIDate))} of every month` : undefined} />
            <Row label="Loan Purpose" value={loanDetails.loanPurpose} wide />
          </div>
        </Section>

        <Section title="Documents" step={4}>
          <div className="grid grid-cols-2 gap-2.5">
            {([['idProof', 'Identity Proof'], ['addressProof', 'Address Proof'], ['incomeProof', 'Income Proof'], ['photo', 'Passport Photo']] as const).map(([key, label]) =>
              documents[key] ? (
                <div key={key} className="flex items-center gap-2 p-2.5 bg-green-50 border border-green-200 rounded-lg">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                  <span className="text-xs font-medium text-green-700">{label} — {documents[key]!.name}</span>
                </div>
              ) : null
            )}
          </div>
        </Section>

        <Section title="Digital Signature" step={5}>
          {signature.dataUrl ? (
            <div className="border border-slate-200 rounded-lg overflow-hidden inline-block" data-testid="signature-preview">
              <img src={signature.dataUrl} alt="Your signature" className="max-h-24 object-contain bg-white p-2" />
            </div>
          ) : (
            <span className="text-sm text-slate-400 italic">No signature provided</span>
          )}
        </Section>

        <div className="declaration-box">
          <p className="text-xs text-slate-600 leading-relaxed">
            I hereby declare that all the information provided in this application is true, correct, and complete to the best of my knowledge. I authorise LoanEase Financial Services to verify the information provided and to make enquiries with credit bureaus, employers, and any other relevant agencies. I understand that providing false or misleading information may result in rejection of my application and legal action.
          </p>
          <label className="flex items-start gap-2.5 mt-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => { setAgreed(e.target.checked); if (e.target.checked) setAgreementError('') }}
              className="w-4 h-4 mt-0.5 accent-blue-700 cursor-pointer shrink-0"
              data-testid="declaration-checkbox"
            />
            <span className="text-xs font-medium text-slate-800">
              I have read and agree to the above declaration and the Terms &amp; Conditions of LoanEase Financial Services.
            </span>
          </label>
          {agreementError && <p className="text-xs text-red-600 mt-2" role="alert">{agreementError}</p>}
        </div>

        {submitError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700" role="alert">
            {submitError}
          </div>
        )}
      </div>

      <div className="flex justify-between items-center px-10 py-6 border-t border-slate-200 bg-slate-50">
        <button className="btn-secondary" onClick={prevStep} disabled={submitting}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </button>
        <button className="btn-success" onClick={handleSubmit} disabled={submitting} data-testid="submit-btn">
          {submitting ? (
            <>
              <svg className="w-4 h-4 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
              Submitting…
            </>
          ) : (
            <>
              Submit Application
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
            </>
          )}
        </button>
      </div>
    </>
  )
}
