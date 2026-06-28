import { useState, useEffect, useCallback } from 'react'
import { useFormStore } from '@/store/formStore'
import { fetchEligibility } from '@/services/eligibility'
import { calculateEMI } from '@/utils/calculations'
import { formatCurrency } from '@/utils/formatters'
import type { ExtendedLoanType, EligibilityResult } from '@/types'

interface LoanTypeOption {
  type: ExtendedLoanType
  label: string
  icon: string
  rate: number
}

const LOAN_OPTIONS: LoanTypeOption[] = [
  { type: 'home', label: 'Home Loan', icon: '🏠', rate: 8.5 },
  { type: 'personal', label: 'Personal Loan', icon: '👤', rate: 14 },
  { type: 'business', label: 'Business Loan', icon: '💼', rate: 12 },
  { type: 'car', label: 'Car Loan', icon: '🚗', rate: 10.5 },
  { type: 'education', label: 'Education Loan', icon: '🎓', rate: 9 },
]

export default function LoanDetails() {
  const { formData, updateFormData, nextStep, prevStep, setEligibility } = useFormStore()
  const saved = formData.loanDetails ?? {}

  const [selectedType, setSelectedType] = useState<ExtendedLoanType | ''>(
    (saved.loanType ?? '') as ExtendedLoanType | '',
  )
  const [loanAmount, setLoanAmount] = useState(String(saved.loanAmount ?? ''))
  const [tenure, setTenure] = useState(String(saved.tenure ?? ''))
  const [eligibility, setLocalEligibility] = useState<EligibilityResult | null>(null)
  const [error, setError] = useState('')

  const selectedOption = LOAN_OPTIONS.find((o) => o.type === selectedType)
  const amountNum = parseFloat(loanAmount) || 0
  const tenureNum = parseInt(tenure) || 0
  const emi =
    selectedOption && amountNum > 0 && tenureNum > 0
      ? calculateEMI(amountNum, selectedOption.rate, tenureNum)
      : 0

  const netIncome = parseFloat(
    String(
      formData.employmentInfo?.monthlyNetIncome ??
        formData.employmentInfo?.monthlyNetSalary ??
        0,
    ),
  )

  const fetchElig = useCallback(async () => {
    if (!selectedType || amountNum <= 0 || tenureNum <= 0 || netIncome <= 0) return
    try {
      const result = await fetchEligibility({
        loanType: selectedType,
        loanAmount: amountNum,
        tenure: tenureNum,
        monthlyNetIncome: netIncome,
      })
      setLocalEligibility(result)
      setEligibility(result)
    } catch {
      /* silent */
    }
  }, [selectedType, amountNum, tenureNum, netIncome, setEligibility])

  useEffect(() => {
    if (selectedType && amountNum > 0 && tenureNum > 0 && netIncome > 0) {
      void fetchElig()
    }
  }, [fetchElig])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedType) {
      setError('Please select a loan type')
      return
    }
    if (!amountNum) {
      setError('Please enter a loan amount')
      return
    }
    if (!tenureNum) {
      setError('Please enter the loan tenure')
      return
    }
    setError('')
    updateFormData('loanDetails', {
      loanType: selectedType as ExtendedLoanType,
      loanAmount: loanAmount,
      tenure: tenure,
    })
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Loan Details</h2>

      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-gray-700 mb-3">
            Select Loan Type <span className="text-red-600" aria-hidden="true">*</span>
          </p>
          <div className="grid grid-cols-3 gap-3">
            {LOAN_OPTIONS.map((opt) => (
              <button
                key={opt.type}
                type="button"
                data-testid={`loan-type-${opt.type}`}
                role="radio"
                aria-checked={selectedType === opt.type}
                onClick={() => setSelectedType(opt.type)}
                className={`
                  flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-colors text-sm
                  ${selectedType === opt.type
                    ? 'border-primary bg-blue-50 text-primary'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'}
                `}
              >
                <span className="text-xl">{opt.icon}</span>
                <span className="font-medium text-xs">{opt.label}</span>
              </button>
            ))}
          </div>
          {error && !selectedType && (
            <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>
          )}
        </div>

        {selectedOption && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-800">
            Interest rate: <strong>{selectedOption.rate}% per annum</strong>
          </div>
        )}

        <div>
          <label htmlFor="loanAmount" className="block text-sm font-medium text-gray-700 mb-1">
            Loan Amount <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="loanAmount"
            name="loanAmount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            placeholder="Enter loan amount"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1">
            Tenure (months) <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <input
            id="tenure"
            name="tenure"
            type="number"
            value={tenure}
            onChange={(e) => setTenure(e.target.value)}
            placeholder="Enter tenure in months"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {error && selectedType && (
          <p role="alert" className="text-xs text-red-600">{error}</p>
        )}

        {emi > 0 && (
          <div data-testid="emi-card" className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">EMI Estimate</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(emi)}<span className="text-sm font-normal text-gray-500">/month</span></p>
          </div>
        )}

        {eligibility && (
          <div data-testid="eligibility-card" className="border rounded-xl p-4">
            <p className="text-sm font-semibold text-gray-700 mb-2">Eligibility Result</p>
            <p className={`text-sm font-medium ${eligibility.eligible ? 'text-green-600' : 'text-red-600'}`}>
              {eligibility.eligible ? 'Eligible' : 'Not Eligible'} — {eligibility.verdict}
            </p>
            <p className="text-xs text-gray-500 mt-1">Credit Score: {eligibility.creditScore}</p>
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  )
}
