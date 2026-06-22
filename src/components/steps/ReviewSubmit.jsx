import { useState } from 'react'
import { useForm } from '../../context/FormContext.jsx'
import { formatCurrency, calculateEMI, LOAN_INTEREST_RATES } from '../../utils/validators.js'

const LOAN_TYPE_LABELS = {
  home: 'Home Loan',
  personal: 'Personal Loan',
  car: 'Car Loan',
  education: 'Education Loan',
  business: 'Business Loan',
}

const EMPLOYMENT_TYPE_LABELS = {
  salaried: 'Salaried Employee',
  self_employed: 'Self-Employed / Freelancer',
  business: 'Business Owner',
  retired: 'Retired',
}

const GENDER_LABELS = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
}

const MARITAL_LABELS = {
  single: 'Single',
  married: 'Married',
  divorced: 'Divorced',
  widowed: 'Widowed',
  separated: 'Separated',
}

function ReviewSection({ title, stepIndex, children }) {
  const { goToStep } = useForm()
  return (
    <div className="review-section">
      <div className="review-section-title">
        <span>{title}</span>
        <button onClick={() => goToStep(stepIndex)}>Edit</button>
      </div>
      {children}
    </div>
  )
}

function ReviewRow({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div className="review-item">
      <span className="review-item-label">{label}</span>
      <span className="review-item-value">{value}</span>
    </div>
  )
}

export default function ReviewSubmit() {
  const { formData, prevStep, setSubmitted } = useForm()
  const [agreed, setAgreed] = useState(false)
  const [agreementError, setAgreementError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { personalInfo, addressInfo, employmentInfo, loanDetails, documents } = formData

  const handleSubmit = async () => {
    if (!agreed) {
      setAgreementError('You must agree to the declaration before submitting.')
      return
    }

    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1800))
    setSubmitted(true)
  }

  const interestRate = LOAN_INTEREST_RATES[loanDetails.loanType] || 0
  const emi = calculateEMI(loanDetails.loanAmount, interestRate, loanDetails.tenure)

  const currentAddr = [
    addressInfo.currentAddressLine1,
    addressInfo.currentAddressLine2,
    addressInfo.currentCity,
    addressInfo.currentState,
    addressInfo.currentZip,
    addressInfo.currentCountry,
  ].filter(Boolean).join(', ')

  const permanentAddr = addressInfo.sameAsPermanent
    ? 'Same as current address'
    : [
        addressInfo.permanentAddressLine1,
        addressInfo.permanentAddressLine2,
        addressInfo.permanentCity,
        addressInfo.permanentState,
        addressInfo.permanentZip,
        addressInfo.permanentCountry,
      ].filter(Boolean).join(', ')

  return (
    <>
      <div className="step-content">
        <div className="step-heading">
          <h2>Review &amp; Submit</h2>
          <p>Please review all details carefully before submitting your application.</p>
        </div>

        <ReviewSection title="Personal Information" stepIndex={0}>
          <div className="review-grid">
            <ReviewRow label="Full Name" value={`${personalInfo.firstName} ${personalInfo.lastName}`} />
            <ReviewRow label="Email" value={personalInfo.email} />
            <ReviewRow label="Mobile" value={`+91 ${personalInfo.phone}`} />
            <ReviewRow label="Date of Birth" value={personalInfo.dateOfBirth ? new Date(personalInfo.dateOfBirth).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : ''} />
            <ReviewRow label="Gender" value={GENDER_LABELS[personalInfo.gender] || personalInfo.gender} />
            <ReviewRow label="Marital Status" value={MARITAL_LABELS[personalInfo.maritalStatus] || personalInfo.maritalStatus} />
            <ReviewRow label="Nationality" value={personalInfo.nationality} />
            <ReviewRow label="PAN Number" value={personalInfo.panNumber} />
          </div>
        </ReviewSection>

        <ReviewSection title="Address Information" stepIndex={1}>
          <div className="review-grid">
            <div className="review-item" style={{ gridColumn: 'span 2' }}>
              <span className="review-item-label">Current Address</span>
              <span className="review-item-value">{currentAddr}</span>
            </div>
            <div className="review-item" style={{ gridColumn: 'span 2' }}>
              <span className="review-item-label">Permanent Address</span>
              <span className="review-item-value">{permanentAddr}</span>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Employment &amp; Income" stepIndex={2}>
          <div className="review-grid">
            <ReviewRow label="Employment Type" value={EMPLOYMENT_TYPE_LABELS[employmentInfo.employmentType] || employmentInfo.employmentType} />
            <ReviewRow label="Work Experience" value={employmentInfo.workExperience ? `${employmentInfo.workExperience} years` : ''} />
            <ReviewRow label="Employer / Business" value={employmentInfo.employerName} />
            <ReviewRow label="Job Title" value={employmentInfo.jobTitle} />
            <ReviewRow label="Employment Since" value={employmentInfo.employmentStartDate ? new Date(employmentInfo.employmentStartDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : ''} />
            <ReviewRow label="Monthly Gross Income" value={employmentInfo.monthlyGrossIncome ? formatCurrency(employmentInfo.monthlyGrossIncome) : ''} />
            <ReviewRow label="Monthly Net Income" value={employmentInfo.monthlyNetIncome ? formatCurrency(employmentInfo.monthlyNetIncome) : ''} />
          </div>
        </ReviewSection>

        <ReviewSection title="Loan Details" stepIndex={3}>
          <div className="review-grid">
            <ReviewRow label="Loan Type" value={LOAN_TYPE_LABELS[loanDetails.loanType] || loanDetails.loanType} />
            <ReviewRow label="Loan Amount" value={loanDetails.loanAmount ? formatCurrency(loanDetails.loanAmount) : ''} />
            <ReviewRow label="Tenure" value={loanDetails.tenure ? `${loanDetails.tenure} months (${(loanDetails.tenure / 12).toFixed(1)} years)` : ''} />
            <ReviewRow label="Interest Rate" value={interestRate ? `${interestRate}% per annum` : ''} />
            <ReviewRow label="Monthly EMI" value={emi ? formatCurrency(emi) : ''} />
            <ReviewRow label="Preferred EMI Date" value={loanDetails.preferredEMIDate ? `${loanDetails.preferredEMIDate}th of every month` : ''} />
            <div className="review-item" style={{ gridColumn: 'span 2' }}>
              <span className="review-item-label">Loan Purpose</span>
              <span className="review-item-value">{loanDetails.loanPurpose}</span>
            </div>
          </div>
        </ReviewSection>

        <ReviewSection title="Documents" stepIndex={4}>
          <div className="review-docs">
            {documents.idProof && (
              <div className="review-doc-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Identity Proof — {documents.idProof.name}</span>
              </div>
            )}
            {documents.addressProof && (
              <div className="review-doc-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Address Proof — {documents.addressProof.name}</span>
              </div>
            )}
            {documents.incomeProof && (
              <div className="review-doc-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                </svg>
                <span>Income Proof — {documents.incomeProof.name}</span>
              </div>
            )}
            {documents.photo && (
              <div className="review-doc-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" />
                </svg>
                <span>Passport Photo — {documents.photo.name}</span>
              </div>
            )}
          </div>
        </ReviewSection>

        <div className="declaration-box">
          <p>
            I hereby declare that all the information provided in this application is true, correct, and complete to the best of my knowledge. I authorise LoanEase Financial Services to verify the information provided and to make enquiries with credit bureaus, employers, and any other relevant agencies. I understand that providing false or misleading information may result in rejection of my application and legal action.
          </p>
          <label className="declaration-checkbox">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => {
                setAgreed(e.target.checked)
                if (e.target.checked) setAgreementError('')
              }}
            />
            <span>I have read and agree to the above declaration and the Terms &amp; Conditions of LoanEase Financial Services.</span>
          </label>
          {agreementError && (
            <p style={{ fontSize: '12px', color: 'var(--error)', marginTop: '8px' }}>{agreementError}</p>
          )}
        </div>
      </div>

      <div className="step-nav">
        <button className="btn btn-secondary" onClick={prevStep} disabled={submitting}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <button
          className="btn btn-success"
          onClick={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Submitting…
            </>
          ) : (
            <>
              Submit Application
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </>
          )}
        </button>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  )
}
