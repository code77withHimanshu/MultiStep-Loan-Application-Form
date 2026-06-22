import { useState, useMemo } from 'react'
import { useFormStore } from '@/store/formStore'
import { loanDetailsSchema, validateSchema } from '@/schemas'
import { LOAN_TYPES } from '@/utils/constants'
import { calculateEMI, calculateTotalPayable, calculateTotalInterest, getInterestRate } from '@/utils/calculations'
import { formatCurrency } from '@/utils/formatters'
import { useEligibility } from '@/hooks/useEligibility'
import FormField from '@/components/FormField'
import EligibilityCard from '@/components/EligibilityCard'
import type { LoanDetails as LoanDetailsType, LoanType } from '@/types'

const EMI_DATES = Array.from({ length: 28 }, (_, i) => i + 1)

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

export default function LoanDetails() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore()
  const [data, setData] = useState<LoanDetailsType>({ ...formData.loanDetails })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleLoanTypeSelect = (type: LoanType) => {
    setData((prev) => ({ ...prev, loanType: type }))
    if (errors.loanType) setErrors((prev) => ({ ...prev, loanType: '' }))
  }

  const handleNext = () => {
    const errs = validateSchema(loanDetailsSchema, data)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    updateFormData('loanDetails', data)
    nextStep()
  }

  const handleBack = () => { updateFormData('loanDetails', data); prevStep() }

  const interestRate = getInterestRate(data.loanType)
  const emi = useMemo(() => calculateEMI(data.loanAmount, interestRate, data.tenure), [data.loanAmount, interestRate, data.tenure])
  const totalPayable = calculateTotalPayable(emi, Number(data.tenure))
  const totalInterest = calculateTotalInterest(Number(data.loanAmount), totalPayable)
  const showEMI = !!(data.loanAmount && data.tenure && data.loanType && emi > 0)

  const { result: eligibility, loading: eligLoading } = useEligibility({
    netIncome: formData.employmentInfo.monthlyNetIncome,
    loanAmount: data.loanAmount,
    loanType: data.loanType,
    tenure: data.tenure,
    workExperience: formData.employmentInfo.workExperience,
  })

  const showEligibility = !!(formData.employmentInfo.monthlyNetIncome && data.loanAmount && data.loanType && data.tenure)

  return (
    <>
      <div className="px-10 py-9">
        <div className="mb-7">
          <h2 className="text-xl font-bold text-slate-900 mb-1.5">Loan Details</h2>
          <p className="text-sm text-slate-500">Select the type of loan and specify the amount and repayment period.</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <FormField label="Loan Type" required error={errors.loanType} className="col-span-2">
            <div className="grid grid-cols-5 gap-2.5 mt-1" role="radiogroup" aria-label="Loan type">
              {LOAN_TYPES.map((lt) => (
                <button
                  key={lt.value}
                  type="button"
                  role="radio"
                  aria-checked={data.loanType === lt.value}
                  onClick={() => handleLoanTypeSelect(lt.value)}
                  className={`p-3 rounded-lg text-center cursor-pointer transition-all duration-150 border-2 ${
                    data.loanType === lt.value
                      ? 'border-blue-700 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50'
                  }`}
                  data-testid={`loan-type-${lt.value}`}
                >
                  <div className="text-2xl mb-1">{lt.icon}</div>
                  <div className={`text-xs font-semibold ${data.loanType === lt.value ? 'text-blue-700' : 'text-slate-800'}`}>{lt.label}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{lt.desc}</div>
                </button>
              ))}
            </div>
          </FormField>

          {data.loanType && (
            <div className="col-span-2 flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              Indicative rate for {LOAN_TYPES.find((l) => l.value === data.loanType)?.label}:{' '}
              <strong>{interestRate}% per annum</strong>
            </div>
          )}

          <FormField label="Loan Amount" required error={errors.loanAmount} hint="Min ₹50,000 — Max ₹5,00,00,000">
            <div className="input-with-prefix">
              <span className="input-prefix">₹</span>
              <input className={`form-input ${errors.loanAmount ? 'has-error' : ''}`} type="number" name="loanAmount" value={data.loanAmount} onChange={handleChange} placeholder="e.g. 500000" min="50000" max="50000000" step="10000" />
            </div>
          </FormField>

          <FormField label="Loan Tenure" required error={errors.tenure} hint="Between 6 and 360 months">
            <div className="input-with-prefix">
              <input className={`form-input ${errors.tenure ? 'has-error' : ''}`} type="number" name="tenure" value={data.tenure} onChange={handleChange} placeholder="e.g. 60" min="6" max="360" />
              <span className="input-suffix">months</span>
            </div>
          </FormField>

          <FormField label="Loan Purpose" required error={errors.loanPurpose} className="col-span-2">
            <textarea className={`form-textarea ${errors.loanPurpose ? 'has-error' : ''}`} name="loanPurpose" value={data.loanPurpose} onChange={handleChange} placeholder="Briefly describe why you need this loan" rows={3} />
          </FormField>

          <FormField label="Preferred EMI Date" required error={errors.preferredEMIDate} hint="Day of month for EMI deduction">
            <select className={`form-select ${errors.preferredEMIDate ? 'has-error' : ''}`} name="preferredEMIDate" value={data.preferredEMIDate} onChange={handleChange}>
              <option value="">Select date</option>
              {EMI_DATES.map((d) => <option key={d} value={d}>{ordinal(d)} of every month</option>)}
            </select>
          </FormField>

          {showEMI && (
            <div className="emi-card" data-testid="emi-card">
              <div className="text-center">
                <div className="text-xs opacity-75 uppercase tracking-wide mb-1.5">Monthly EMI</div>
                <div className="text-2xl font-bold">{formatCurrency(emi)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs opacity-75 uppercase tracking-wide mb-1.5">Total Interest</div>
                <div className="text-lg font-bold">{formatCurrency(totalInterest)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs opacity-75 uppercase tracking-wide mb-1.5">Total Payable</div>
                <div className="text-lg font-bold">{formatCurrency(totalPayable)}</div>
              </div>
            </div>
          )}

          {showEligibility && (
            <EligibilityCard result={eligibility!} loading={eligLoading || !eligibility} />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center px-10 py-6 border-t border-slate-200 bg-slate-50">
        <button className="btn-secondary" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </button>
        <button className="btn-primary" onClick={handleNext}>
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </>
  )
}
