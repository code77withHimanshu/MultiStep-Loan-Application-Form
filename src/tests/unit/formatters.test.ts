import { describe, it, expect } from 'vitest'
import {
  formatCurrency,
  formatIndianNumber,
  formatFileSize,
  formatDate,
  formatMonthYear,
  maskPAN,
  maskAadhaar,
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

describe('formatIndianNumber', () => {
  it('formats 1,00,000 in Indian style', () => {
    const result = formatIndianNumber(100000)
    expect(result).toContain('1,00,000')
  })

  it('formats 10,00,000 correctly', () => {
    const result = formatIndianNumber(1000000)
    expect(result).toContain('10,00,000')
  })

  it('formats small numbers without commas', () => {
    expect(formatIndianNumber(999)).toBe('999')
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

describe('maskPAN', () => {
  it('masks middle characters of PAN', () => {
    const masked = maskPAN('ABCPE1234F')
    expect(masked).not.toBe('ABCPE1234F')
    expect(masked).toContain('ABC')
    expect(masked).toContain('F')
  })

  it('returns short PAN unchanged', () => {
    expect(maskPAN('ABC')).toBe('ABC')
  })
})

describe('maskAadhaar', () => {
  it('masks first 8 digits of Aadhaar', () => {
    const masked = maskAadhaar('499118665120')
    expect(masked).toContain('5120')
    expect(masked).toContain('XXXX XXXX')
    expect(masked).not.toContain('4991')
  })

  it('returns short Aadhaar unchanged', () => {
    expect(maskAadhaar('123')).toBe('123')
  })
})

describe('generateReferenceNumber', () => {
  it('starts with LS', () => {
    expect(generateReferenceNumber()).toMatch(/^LS/)
  })

  it('is 10 characters total (LS + 8)', () => {
    expect(generateReferenceNumber()).toHaveLength(10)
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
