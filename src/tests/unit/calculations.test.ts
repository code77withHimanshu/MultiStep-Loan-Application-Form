import { describe, it, expect } from 'vitest'
import {
  calculateEMI,
  calculateTotalPayable,
  calculateTotalInterest,
  calculateCostOfBorrowing,
  calculateProcessingFee,
  getInterestRate,
  calculateAge,
  foirRatio,
  maxEligibleLoan,
} from '@/utils/calculations'

describe('calculateEMI', () => {
  it('returns correct EMI for standard inputs', () => {
    const emi = calculateEMI(500000, 10.5, 60)
    expect(emi).toBeCloseTo(10747, 0)
  })

  it('returns 0 when principal is 0', () => {
    expect(calculateEMI(0, 10.5, 60)).toBe(0)
  })

  it('returns principal/tenure when rate is 0', () => {
    expect(calculateEMI(60000, 0, 60)).toBe(1000)
  })

  it('returns 0 when tenure is 0', () => {
    expect(calculateEMI(500000, 10.5, 0)).toBe(0)
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
    expect(calculateTotalInterest(500000, 637000)).toBeCloseTo(137000, 0)
  })

  it('returns 0 when total payable equals principal', () => {
    expect(calculateTotalInterest(500000, 500000)).toBe(0)
  })

  it('returns 0 when total payable is less than principal', () => {
    expect(calculateTotalInterest(500000, 400000)).toBe(0)
  })
})

describe('calculateCostOfBorrowing', () => {
  it('calculates total cost correctly', () => {
    const emi = calculateEMI(300000, 10.5, 36)
    const cost = calculateCostOfBorrowing(emi, 36, 300000)
    expect(cost).toBeGreaterThan(0)
    expect(cost).toBeLessThan(300000 * 0.5)
  })

  it('returns 0 for zero loan', () => {
    expect(calculateCostOfBorrowing(0, 36, 0)).toBe(0)
  })
})

describe('calculateProcessingFee', () => {
  it('returns 1% for standard loan amount', () => {
    expect(calculateProcessingFee(300000)).toBe(3000)
  })

  it('applies minimum fee of ₹2,000', () => {
    expect(calculateProcessingFee(50000)).toBe(2000)
  })

  it('applies maximum fee of ₹25,000', () => {
    expect(calculateProcessingFee(10000000)).toBe(25000)
  })

  it('calculates exactly at max boundary', () => {
    expect(calculateProcessingFee(2500000)).toBe(25000)
  })

  it('calculates at min boundary', () => {
    expect(calculateProcessingFee(200000)).toBe(2000)
  })
})

describe('getInterestRate', () => {
  it('returns correct rate for personal loan', () => {
    expect(getInterestRate('personal')).toBe(10.5)
  })

  it('returns correct rate for home loan', () => {
    expect(getInterestRate('home')).toBe(8.5)
  })

  it('returns correct rate for business loan', () => {
    expect(getInterestRate('business')).toBe(14.0)
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

  it('age 21 is valid', () => {
    const dob = new Date()
    dob.setFullYear(dob.getFullYear() - 21)
    expect(calculateAge(dob.toISOString().split('T')[0])).toBe(21)
  })

  it('age 65 is valid', () => {
    const dob = new Date()
    dob.setFullYear(dob.getFullYear() - 65)
    expect(calculateAge(dob.toISOString().split('T')[0])).toBe(65)
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
    const max = maxEligibleLoan(50000, 10.5, 60)
    expect(max).toBeGreaterThan(0)
    const maxEmi = 50000 * 0.5
    const emiOnMaxLoan = calculateEMI(max, 10.5, 60)
    expect(emiOnMaxLoan).toBeLessThanOrEqual(maxEmi + 1)
  })

  it('handles zero rate', () => {
    const max = maxEligibleLoan(50000, 0, 60)
    expect(max).toBe(50000 * 0.5 * 60)
  })
})
