import { describe, it, expect } from 'vitest'
import {
  calculateEMI,
  calculateTotalPayable,
  calculateTotalInterest,
  getInterestRate,
  calculateAge,
  foirRatio,
  maxEligibleLoan,
} from '@/utils/calculations'

describe('calculateEMI', () => {
  it('returns correct EMI for standard inputs', () => {
    const emi = calculateEMI(500000, 10, 60)
    expect(emi).toBeCloseTo(10624.28, 0)
  })

  it('returns 0 when principal is 0', () => {
    expect(calculateEMI(0, 10, 60)).toBe(0)
  })

  it('returns 0 when rate is 0', () => {
    expect(calculateEMI(60000, 0, 60)).toBe(1000)
  })

  it('returns 0 when tenure is 0', () => {
    expect(calculateEMI(500000, 10, 0)).toBe(0)
  })

  it('handles string inputs correctly', () => {
    const emi = calculateEMI('500000', 10, '60')
    expect(emi).toBeGreaterThan(0)
  })

  it('returns 0 when inputs are invalid', () => {
    expect(calculateEMI('', 10, '')).toBe(0)
  })
})

describe('calculateTotalPayable', () => {
  it('multiplies EMI by tenure', () => {
    expect(calculateTotalPayable(10000, 12)).toBe(120000)
  })

  it('returns 0 for zero tenure', () => {
    expect(calculateTotalPayable(10000, 0)).toBe(0)
  })
})

describe('calculateTotalInterest', () => {
  it('subtracts principal from total payable', () => {
    expect(calculateTotalInterest(500000, 637457)).toBeCloseTo(137457, 0)
  })

  it('returns 0 when total payable equals principal', () => {
    expect(calculateTotalInterest(500000, 500000)).toBe(0)
  })

  it('returns 0 when total payable is less than principal', () => {
    expect(calculateTotalInterest(500000, 400000)).toBe(0)
  })
})

describe('getInterestRate', () => {
  it('returns rate for each loan type', () => {
    expect(getInterestRate('home')).toBe(8.5)
    expect(getInterestRate('personal')).toBe(14.0)
    expect(getInterestRate('car')).toBe(10.0)
    expect(getInterestRate('education')).toBe(11.0)
    expect(getInterestRate('business')).toBe(16.0)
  })

  it('returns 0 for empty string', () => {
    expect(getInterestRate('')).toBe(0)
  })
})

describe('calculateAge', () => {
  it('calculates correct age', () => {
    const dob = new Date()
    dob.setFullYear(dob.getFullYear() - 30)
    expect(calculateAge(dob.toISOString().split('T')[0])).toBe(30)
  })

  it('returns 0 for empty string', () => {
    expect(calculateAge('')).toBe(0)
  })

  it('returns 0 for invalid date', () => {
    expect(calculateAge('invalid')).toBe(0)
  })

  it('accounts for month/day boundary', () => {
    const today = new Date()
    const dob = new Date(today.getFullYear() - 25, today.getMonth() + 1, today.getDate())
    const age = calculateAge(dob.toISOString().split('T')[0])
    expect(age).toBe(24)
  })
})

describe('foirRatio', () => {
  it('calculates FOIR correctly', () => {
    expect(foirRatio(10000, 50000)).toBeCloseTo(0.2, 2)
  })

  it('returns Infinity when income is 0', () => {
    expect(foirRatio(10000, 0)).toBe(Infinity)
  })

  it('returns Infinity when income is negative', () => {
    expect(foirRatio(10000, -1000)).toBe(Infinity)
  })
})

describe('maxEligibleLoan', () => {
  it('calculates max loan correctly', () => {
    const max = maxEligibleLoan(50000, 10, 60)
    expect(max).toBeGreaterThan(0)
    const maxEmi = 50000 * 0.5
    const emiOnMaxLoan = calculateEMI(max, 10, 60)
    expect(emiOnMaxLoan).toBeLessThanOrEqual(maxEmi + 1)
  })

  it('handles zero rate', () => {
    const max = maxEligibleLoan(50000, 0, 60)
    expect(max).toBe(50000 * 0.5 * 60)
  })
})
