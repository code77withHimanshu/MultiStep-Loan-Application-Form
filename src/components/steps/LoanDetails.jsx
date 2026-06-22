import { useState, useMemo } from 'react'
import { useForm } from '../../context/FormContext.jsx'
import { validateLoanDetails, formatCurrency, calculateEMI, LOAN_INTEREST_RATES } from '../../utils/validators.js'
import FormField from '../FormField.jsx'

const LOAN_TYPES = [
  { value: 'home', label: 'Home Loan', icon: '🏠', desc: 'Purchase or construct a home' },
  { value: 'personal', label: 'Personal Loan', icon: '👤', desc: 'For personal expenses' },
  { value: 'car', label: 'Car Loan', icon: '🚗', desc: 'Buy a new or used vehicle' },
  { value: 'education', label: 'Education Loan', icon: '🎓', desc: 'Fund your education' },
  { value: 'business', label: 'Business Loan', icon: '💼', desc: 'Grow your business' },
]

const EMI_DATES = Array.from({ length: 28 }, (_, i) => i + 1)

export default function LoanDetails() {
  const { formData, updateFormData, nextStep, prevStep } = useForm()
  const [data, setData] = useState(formData.loanDetails)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleLoanTypeSelect = (type) => {
    setData(prev => ({ ...prev, loanType: type }))
    if (errors.loanType) setErrors(prev => ({ ...prev, loanType: '' }))
  }

  const handleNext = () => {
    const validationErrors = validateLoanDetails(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    updateFormData('loanDetails', data)
    nextStep()
  }

  const handleBack = () => {
    updateFormData('loanDetails', data)
    prevStep()
  }

  const interestRate = LOAN_INTEREST_RATES[data.loanType] || 0
  const emi = useMemo(
    () => calculateEMI(data.loanAmount, interestRate, data.tenure),
    [data.loanAmount, interestRate, data.tenure]
  )
  const totalPayable = emi * Number(data.tenure || 0)
  const totalInterest = totalPayable - Number(data.loanAmount || 0)

  const showEMI = data.loanAmount && data.tenure && data.loanType && emi > 0

  return (
    <>
      <div className="step-content">
        <div className="step-heading">
          <h2>Loan Details</h2>
          <p>Select the type of loan and specify the amount and repayment period.</p>
        </div>

        <div className="form-grid">
          <FormField
            label="Loan Type"
            required
            error={errors.loanType}
            className="col-span-2"
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginTop: '4px' }}>
              {LOAN_TYPES.map(lt => (
                <button
                  key={lt.value}
                  type="button"
                  onClick={() => handleLoanTypeSelect(lt.value)}
                  style={{
                    padding: '12px 8px',
                    border: `2px solid ${data.loanType === lt.value ? 'var(--primary)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-md)',
                    background: data.loanType === lt.value ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all var(--transition)',
                    fontFamily: 'var(--font)',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{lt.icon}</div>
                  <div style={{ fontSize: '12px', fontWeight: '600', color: data.loanType === lt.value ? 'var(--primary)' : 'var(--text-primary)' }}>{lt.label}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{lt.desc}</div>
                </button>
              ))}
            </div>
          </FormField>

          {data.loanType && (
            <div
              style={{
                gridColumn: 'span 2',
                background: 'var(--primary-light)',
                border: '1px solid #bfdbfe',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: 'var(--primary-dark)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              Indicative interest rate for {LOAN_TYPES.find(l => l.value === data.loanType)?.label}: <strong>{interestRate}% per annum</strong>
            </div>
          )}

          <FormField
            label="Loan Amount"
            required
            error={errors.loanAmount}
            hint="Min ₹50,000 — Max ₹5,00,00,000"
          >
            <div className="input-with-prefix">
              <span className="input-prefix">₹</span>
              <input
                className={`form-input ${errors.loanAmount ? 'has-error' : ''}`}
                type="number"
                name="loanAmount"
                value={data.loanAmount}
                onChange={handleChange}
                placeholder="e.g. 500000"
                min="50000"
                max="50000000"
                step="10000"
              />
            </div>
          </FormField>

          <FormField
            label="Loan Tenure"
            required
            error={errors.tenure}
            hint="Between 6 and 360 months"
          >
            <div className="input-with-prefix">
              <input
                className={`form-input ${errors.tenure ? 'has-error' : ''}`}
                type="number"
                name="tenure"
                value={data.tenure}
                onChange={handleChange}
                placeholder="e.g. 60"
                min="6"
                max="360"
              />
              <span className="input-prefix" style={{ borderLeft: 'none', borderRight: '1.5px solid var(--border)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>months</span>
            </div>
          </FormField>

          <FormField label="Loan Purpose" required error={errors.loanPurpose} className="col-span-2">
            <textarea
              className={`form-textarea ${errors.loanPurpose ? 'has-error' : ''}`}
              name="loanPurpose"
              value={data.loanPurpose}
              onChange={handleChange}
              placeholder="Briefly describe why you need this loan (e.g., purchase of residential property in Bangalore)"
              rows={3}
            />
          </FormField>

          <FormField
            label="Preferred EMI Date"
            required
            error={errors.preferredEMIDate}
            hint="Day of month for EMI deduction"
          >
            <select
              className={`form-select ${errors.preferredEMIDate ? 'has-error' : ''}`}
              name="preferredEMIDate"
              value={data.preferredEMIDate}
              onChange={handleChange}
            >
              <option value="">Select date</option>
              {EMI_DATES.map(d => (
                <option key={d} value={d}>{d}{['st','nd','rd'][((d%100-11)%10-1)] || 'th'} of every month</option>
              ))}
            </select>
          </FormField>

          {showEMI && (
            <div className="emi-card">
              <div className="emi-item">
                <div className="emi-label">Monthly EMI</div>
                <div className="emi-value large">{formatCurrency(emi)}</div>
              </div>
              <div className="emi-item">
                <div className="emi-label">Total Interest</div>
                <div className="emi-value">{formatCurrency(totalInterest)}</div>
              </div>
              <div className="emi-item">
                <div className="emi-label">Total Payable</div>
                <div className="emi-value">{formatCurrency(totalPayable)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="step-nav">
        <button className="btn btn-secondary" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  )
}
