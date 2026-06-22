import { LOAN_INTEREST_RATES } from '@/utils/constants'
import type { LoanType } from '@/types'

export function calculateEMI(
  principal: number | string,
  annualRatePercent: number,
  tenureMonths: number | string
): number {
  const p = Number(principal)
  const n = Number(tenureMonths)
  if (!p || !annualRatePercent || !n || p <= 0 || n <= 0) return 0
  const r = annualRatePercent / 12 / 100
  if (r === 0) return p / n
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export function calculateTotalPayable(emi: number, tenureMonths: number): number {
  return emi * tenureMonths
}

export function calculateTotalInterest(principal: number, totalPayable: number): number {
  return Math.max(0, totalPayable - principal)
}

export function getInterestRate(loanType: LoanType | ''): number {
  if (!loanType) return 0
  return LOAN_INTEREST_RATES[loanType] ?? 0
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
  return Math.floor((maxEmi * (Math.pow(1 + r, tenureMonths) - 1)) / (r * Math.pow(1 + r, tenureMonths)))
}
