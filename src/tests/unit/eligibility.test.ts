import { describe, it, expect } from 'vitest'
import { calculateEligibility } from '@/services/eligibility'

describe('calculateEligibility', () => {
  it('returns approved for strong profile', () => {
    const result = calculateEligibility(100000, 3000000, 'home', 240, 10)
    expect(result.verdict).toBe('approved')
    expect(result.eligible).toBe(true)
    expect(result.creditScore).toBeGreaterThanOrEqual(600)
    expect(result.maxLoanAmount).toBeGreaterThan(0)
    expect(result.reasons.length).toBeGreaterThan(0)
  })

  it('returns conditional for borderline profile', () => {
    const result = calculateEligibility(40000, 3000000, 'personal', 60, 2)
    expect(['conditional', 'rejected']).toContain(result.verdict)
  })

  it('returns rejected for high FOIR profile', () => {
    const result = calculateEligibility(15000, 2000000, 'business', 24, 0)
    expect(result.verdict).toBe('rejected')
    expect(result.eligible).toBe(false)
  })

  it('includes reasons array with content', () => {
    const result = calculateEligibility(80000, 2000000, 'home', 180, 8)
    expect(Array.isArray(result.reasons)).toBe(true)
    expect(result.reasons.length).toBeGreaterThan(0)
  })

  it('returns suggested interest rate matching loan type', () => {
    const homeResult = calculateEligibility(100000, 2000000, 'home', 240, 10)
    expect(homeResult.suggestedInterestRate).toBe(8.5)

    const personalResult = calculateEligibility(100000, 500000, 'personal', 60, 10)
    expect(personalResult.suggestedInterestRate).toBe(14.0)

    const bizResult = calculateEligibility(100000, 1000000, 'business', 60, 10)
    expect(bizResult.suggestedInterestRate).toBe(16.0)
  })

  it('calculates maxLoanAmount based on income', () => {
    const result = calculateEligibility(60000, 500000, 'personal', 60, 5)
    expect(result.maxLoanAmount).toBeGreaterThan(0)
  })

  it('includes credit score between 300 and 900', () => {
    const result = calculateEligibility(60000, 1000000, 'home', 120, 5)
    expect(result.creditScore).toBeGreaterThanOrEqual(300)
    expect(result.creditScore).toBeLessThanOrEqual(900)
  })

  it('returns emiToIncomeRatio field', () => {
    const result = calculateEligibility(50000, 500000, 'personal', 60, 5)
    expect(typeof result.emiToIncomeRatio).toBe('number')
    expect(result.emiToIncomeRatio).toBeGreaterThan(0)
  })

  it('mentions stable employment when work exp >= 3 years', () => {
    const result = calculateEligibility(80000, 1000000, 'home', 120, 5)
    const hasStable = result.reasons.some((r) => r.toLowerCase().includes('stable'))
    expect(hasStable).toBe(true)
  })

  it('mentions limited experience when work exp is low', () => {
    const result = calculateEligibility(80000, 500000, 'personal', 60, 1)
    const hasLimited = result.reasons.some((r) => r.toLowerCase().includes('limited'))
    expect(hasLimited).toBe(true)
  })
})
