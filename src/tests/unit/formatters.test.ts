import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatFileSize,
  formatDate,
  formatMonthYear,
  formatOrdinal,
  generateReferenceNumber,
  generateApplicationId,
} from '@/utils/formatters'

describe('formatCurrency', () => {
  it('formats Indian currency correctly', () => {
    const result = formatCurrency(500000)
    expect(result).toContain('5')
    expect(result).toContain('₹')
  })

  it('returns ₹0 for zero', () => {
    expect(formatCurrency(0)).toBe('₹0')
  })

  it('returns ₹0 for empty string', () => {
    expect(formatCurrency('')).toBe('₹0')
  })

  it('returns ₹0 for NaN', () => {
    expect(formatCurrency('abc')).toBe('₹0')
  })

  it('handles string number inputs', () => {
    const result = formatCurrency('100000')
    expect(result).toContain('₹')
  })
})

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B')
  })

  it('formats KB correctly', () => {
    expect(formatFileSize(1500)).toBe('1.5 KB')
  })

  it('formats MB correctly', () => {
    expect(formatFileSize(2 * 1024 * 1024)).toBe('2.0 MB')
  })

  it('formats exact 1024 bytes as 1.0 KB', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB')
  })
})

describe('formatDate', () => {
  it('formats date string in en-IN locale', () => {
    const result = formatDate('2000-05-15')
    expect(result).toContain('2000')
    expect(result).toContain('15')
  })

  it('returns empty string for empty input', () => {
    expect(formatDate('')).toBe('')
  })

  it('returns empty string for invalid date', () => {
    expect(formatDate('not-a-date')).toBe('')
  })

  it('accepts custom options', () => {
    const result = formatDate('2000-05-15', { month: 'long', year: 'numeric' })
    expect(result).toContain('2000')
    expect(result).toContain('May')
  })
})

describe('formatMonthYear', () => {
  it('formats as month and year', () => {
    const result = formatMonthYear('2020-03-01')
    expect(result).toContain('2020')
    expect(result).toContain('March')
  })
})

describe('formatOrdinal', () => {
  it('returns 1st correctly', () => { expect(formatOrdinal(1)).toBe('1st') })
  it('returns 2nd correctly', () => { expect(formatOrdinal(2)).toBe('2nd') })
  it('returns 3rd correctly', () => { expect(formatOrdinal(3)).toBe('3rd') })
  it('returns 4th correctly', () => { expect(formatOrdinal(4)).toBe('4th') })
  it('returns 11th correctly', () => { expect(formatOrdinal(11)).toBe('11th') })
  it('returns 21st correctly', () => { expect(formatOrdinal(21)).toBe('21st') })
  it('returns 12th correctly', () => { expect(formatOrdinal(12)).toBe('12th') })
})

describe('generateReferenceNumber', () => {
  it('starts with LN', () => {
    expect(generateReferenceNumber()).toMatch(/^LN/)
  })

  it('is unique each time', () => {
    const a = generateReferenceNumber()
    const b = generateReferenceNumber()
    expect(a).not.toBe(b)
  })
})

describe('generateApplicationId', () => {
  it('starts with APP', () => {
    expect(generateApplicationId()).toMatch(/^APP/)
  })
})
