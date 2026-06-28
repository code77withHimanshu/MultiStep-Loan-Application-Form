import type { EligibilityResult } from '@/types'

interface EligibilityParams {
  loanType: string
  loanAmount: number
  tenure: number
  monthlyNetIncome: number
}

export async function fetchEligibility(params: EligibilityParams): Promise<EligibilityResult> {
  const { loanType, loanAmount, tenure, monthlyNetIncome } = params
  const annualRate = loanType === 'home' ? 8.5 : loanType === 'personal' ? 14 : 12
  const r = annualRate / 12 / 100
  const emi =
    r > 0
      ? (loanAmount * r * Math.pow(1 + r, tenure)) / (Math.pow(1 + r, tenure) - 1)
      : loanAmount / tenure
  const ratio = monthlyNetIncome > 0 ? emi / monthlyNetIncome : Infinity
  const eligible = ratio <= 0.5 && loanAmount <= monthlyNetIncome * tenure * 0.5

  return {
    eligible,
    verdict: eligible ? 'approved' : 'rejected',
    creditScore: eligible ? 750 : 620,
    maxLoanAmount: Math.floor(monthlyNetIncome * 0.5 * tenure),
    suggestedInterestRate: annualRate,
    emiToIncomeRatio: Math.round(ratio * 100) / 100,
    reasons: eligible
      ? ['Profile meets eligibility criteria']
      : ['EMI exceeds 50% of net income'],
  }
}
