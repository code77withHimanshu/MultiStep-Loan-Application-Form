import type { EligibilityResult, LoanType } from '@/types'
import { LOAN_INTEREST_RATES } from '@/utils/constants'
import { calculateEMI, foirRatio, maxEligibleLoan } from '@/utils/calculations'

function simulateCreditScore(workExperience: number, netIncome: number): number {
  const expScore = Math.min(workExperience * 8, 150)
  const incomeScore = Math.min(Math.floor(netIncome / 10_000) * 5, 100)
  const base = 550
  return Math.min(900, base + expScore + incomeScore)
}

export function calculateEligibility(
  netIncome: number,
  loanAmount: number,
  loanType: LoanType,
  tenureMonths: number,
  workExperience: number
): EligibilityResult {
  const rate = LOAN_INTEREST_RATES[loanType]
  const emi = calculateEMI(loanAmount, rate, tenureMonths)
  const foir = foirRatio(emi, netIncome)
  const creditScore = simulateCreditScore(workExperience, netIncome)
  const maxLoan = maxEligibleLoan(netIncome, rate, tenureMonths)
  const reasons: string[] = []

  if (creditScore >= 750) {
    reasons.push('Excellent credit profile')
  } else if (creditScore >= 650) {
    reasons.push('Good credit profile')
  } else {
    reasons.push('Credit profile needs improvement')
  }

  if (foir <= 0.35) {
    reasons.push('Strong income-to-EMI ratio')
  } else if (foir <= 0.50) {
    reasons.push('Acceptable income-to-EMI ratio')
  } else {
    reasons.push('High EMI-to-income ratio — consider reducing loan amount or extending tenure')
  }

  if (loanAmount > maxLoan) {
    reasons.push(`Requested amount exceeds recommended limit of ₹${maxLoan.toLocaleString('en-IN')}`)
  }

  if (workExperience >= 3) {
    reasons.push('Stable employment history')
  } else if (workExperience > 0) {
    reasons.push('Limited work experience')
  }

  let verdict: EligibilityResult['verdict']
  let eligible = true

  if (foir <= 0.40 && creditScore >= 700 && loanAmount <= maxLoan) {
    verdict = 'approved'
  } else if (foir <= 0.55 && creditScore >= 600) {
    verdict = 'conditional'
  } else {
    verdict = 'rejected'
    eligible = false
  }

  return {
    eligible,
    verdict,
    creditScore,
    maxLoanAmount: maxLoan,
    suggestedInterestRate: rate,
    emiToIncomeRatio: foir,
    reasons,
  }
}

export async function fetchEligibility(
  netIncome: number,
  loanAmount: number,
  loanType: LoanType,
  tenureMonths: number,
  workExperience: number
): Promise<EligibilityResult> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return calculateEligibility(netIncome, loanAmount, loanType, tenureMonths, workExperience)
}
