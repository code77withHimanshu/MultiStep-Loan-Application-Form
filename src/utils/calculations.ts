import { LOAN_INTEREST_RATES, PROCESSING_FEE_MIN, PROCESSING_FEE_MAX, PROCESSING_FEE_RATE } from '@/utils/constants'
import type { LoanType } from '@/types'

export function calculateEMI(
  principal: number,
  annualRatePercent: number,
  tenureMonths: number,
): number {
  if (!principal || !annualRatePercent || !tenureMonths || principal <= 0 || tenureMonths <= 0) return 0
  const r = annualRatePercent / 12 / 100
  if (r === 0) return principal / tenureMonths
  return (principal * r * Math.pow(1 + r, tenureMonths)) / (Math.pow(1 + r, tenureMonths) - 1)
}

export function calculateTotalPayable(emi: number, tenureMonths: number): number {
  return emi * tenureMonths
}

export function calculateTotalInterest(principal: number, totalPayable: number): number {
  return Math.max(0, totalPayable - principal)
}

export function calculateCostOfBorrowing(emi: number, tenureMonths: number, principal: number): number {
  return Math.max(0, emi * tenureMonths - principal)
}

export function calculateProcessingFee(loanAmount: number): number {
  return Math.min(Math.max(loanAmount * PROCESSING_FEE_RATE, PROCESSING_FEE_MIN), PROCESSING_FEE_MAX)
}

export function getInterestRate(loanType: LoanType | ''): number {
  if (!loanType) return 0
  return LOAN_INTEREST_RATES[loanType as LoanType] ?? 0
}

export function calculateAge(dateOfBirth: string): number {
  if (!dateOfBirth) return 0
  const dob = new Date(dateOfBirth)
  if (isNaN(dob.getTime())) return 0
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const m = today.getMonth() - dob.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--
  return age
}

export function foirRatio(emi: number, netIncome: number): number {
  if (!netIncome || netIncome <= 0) return Infinity
  return emi / netIncome
}

export function maxEligibleLoan(netIncome: number, annualRatePercent: number, tenureMonths: number): number {
  const r = annualRatePercent / 12 / 100
  const maxEmi = netIncome * 0.5
  if (r === 0) return maxEmi * tenureMonths
  return Math.floor(
    (maxEmi * (Math.pow(1 + r, tenureMonths) - 1)) / (r * Math.pow(1 + r, tenureMonths)),
  )
}
