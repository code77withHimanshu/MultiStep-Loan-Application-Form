import { useState, useEffect, useRef, useCallback } from 'react'
import type { EligibilityResult, LoanType } from '@/types'
import { fetchEligibility } from '@/services/eligibility'

interface EligibilityParams {
  netIncome: string
  loanAmount: string
  loanType: LoanType | ''
  tenure: string
  workExperience: string
}

interface UseEligibilityReturn {
  result: EligibilityResult | null
  loading: boolean
  error: string | null
}

export function useEligibility(params: EligibilityParams): UseEligibilityReturn {
  const [result, setResult] = useState<EligibilityResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const calculate = useCallback(async () => {
    const income = Number(params.netIncome)
    const amount = Number(params.loanAmount)
    const months = Number(params.tenure)
    const exp = Number(params.workExperience)

    if (!income || !amount || !months || !params.loanType) {
      setResult(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const res = await fetchEligibility(income, amount, params.loanType as LoanType, months, exp)
      setResult(res)
    } catch {
      setError('Unable to calculate eligibility. Please try again.')
      setResult(null)
    } finally {
      setLoading(false)
    }
  }, [params.netIncome, params.loanAmount, params.loanType, params.tenure, params.workExperience])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(calculate, 500)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [calculate])

  return { result, loading, error }
}
