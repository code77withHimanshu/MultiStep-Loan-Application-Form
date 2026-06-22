import { describe, it, expect } from 'vitest'
import {
  verhoeffChecksum,
  validateAadhaar,
  validatePAN,
  validateGST,
  validateMobile,
  validateEmail,
  validatePinCode,
  getPANEntityType,
} from '@/utils/validators'

describe('verhoeffChecksum', () => {
  it('returns true for valid Aadhaar numbers', () => {
    // Known valid Aadhaar numbers with correct Verhoeff checksum
    expect(verhoeffChecksum('499118665120')).toBe(true)
  })

  it('returns false for numbers with bad checksum', () => {
    expect(verhoeffChecksum('123456789012')).toBe(false)
    expect(verhoeffChecksum('000000000000')).toBe(false)
  })

  it('single digit 0 has checksum 0', () => {
    expect(verhoeffChecksum('0')).toBe(true)
  })
})

describe('validateAadhaar', () => {
  it('returns true for a valid 12-digit Aadhaar with correct checksum', () => {
    expect(validateAadhaar('499118665120')).toBe(true)
  })

  it('returns false for less than 12 digits', () => {
    expect(validateAadhaar('12345678901')).toBe(false)
  })

  it('returns false for more than 12 digits', () => {
    expect(validateAadhaar('1234567890123')).toBe(false)
  })

  it('returns false for non-numeric characters', () => {
    expect(validateAadhaar('12345678901A')).toBe(false)
  })

  it('returns false for all zeros', () => {
    expect(validateAadhaar('000000000000')).toBe(false)
  })
})

describe('validatePAN', () => {
  it('accepts valid P-entity PAN for personal loan', () => {
    expect(validatePAN('ABCPE1234F', 'personal')).toBe(true)
  })

  it('accepts valid P-entity PAN for home loan', () => {
    expect(validatePAN('ABCPE1234F', 'home')).toBe(true)
  })

  it('accepts P, C, F entity for business loan', () => {
    expect(validatePAN('ABCPE1234F', 'business')).toBe(true)
    expect(validatePAN('ABCCE1234F', 'business')).toBe(true)
    expect(validatePAN('ABCFE1234F', 'business')).toBe(true)
  })

  it('rejects C-entity for personal loan', () => {
    expect(validatePAN('ABCCE1234F', 'personal')).toBe(false)
  })

  it('rejects C-entity for home loan', () => {
    expect(validatePAN('ABCCE1234F', 'home')).toBe(false)
  })

  it('rejects invalid PAN format', () => {
    expect(validatePAN('INVALID', 'personal')).toBe(false)
    expect(validatePAN('12345', 'personal')).toBe(false)
    expect(validatePAN('', 'personal')).toBe(false)
  })

  it('rejects lowercase PAN', () => {
    expect(validatePAN('abcpe1234f', 'personal')).toBe(false)
  })

  it('PAN must be exactly 10 characters', () => {
    expect(validatePAN('ABCPE1234', 'personal')).toBe(false)
    expect(validatePAN('ABCPE1234FX', 'personal')).toBe(false)
  })
})

describe('validateGST', () => {
  it('accepts valid GST number', () => {
    expect(validateGST('24ABCFC1234D1ZK')).toBe(true)
    expect(validateGST('27AABCU9603R1ZN')).toBe(true)
  })

  it('rejects invalid GST formats', () => {
    expect(validateGST('INVALID')).toBe(false)
    expect(validateGST('24ABCFC1234D1Z')).toBe(false)
    expect(validateGST('')).toBe(false)
  })

  it('requires state code as first 2 digits', () => {
    expect(validateGST('AA24ABCFC1234D1ZK')).toBe(false)
  })
})

describe('validateMobile', () => {
  it('accepts valid 10-digit mobile starting with 6-9', () => {
    expect(validateMobile('9876543210')).toBe(true)
    expect(validateMobile('8765432109')).toBe(true)
    expect(validateMobile('7654321098')).toBe(true)
    expect(validateMobile('6543210987')).toBe(true)
  })

  it('rejects mobile starting with 0-5', () => {
    expect(validateMobile('1234567890')).toBe(false)
    expect(validateMobile('5234567890')).toBe(false)
  })

  it('rejects mobile with wrong length', () => {
    expect(validateMobile('987654321')).toBe(false)
    expect(validateMobile('98765432101')).toBe(false)
  })
})

describe('validateEmail', () => {
  it('accepts valid email addresses', () => {
    expect(validateEmail('user@example.com')).toBe(true)
    expect(validateEmail('test.user+tag@domain.co.in')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(validateEmail('notanemail')).toBe(false)
    expect(validateEmail('@domain.com')).toBe(false)
    expect(validateEmail('user@')).toBe(false)
    expect(validateEmail('')).toBe(false)
  })
})

describe('validatePinCode', () => {
  it('accepts valid 6-digit PIN codes', () => {
    expect(validatePinCode('110001')).toBe(true)
    expect(validatePinCode('560001')).toBe(true)
    expect(validatePinCode('400001')).toBe(true)
  })

  it('rejects invalid PIN codes', () => {
    expect(validatePinCode('12345')).toBe(false)
    expect(validatePinCode('1234567')).toBe(false)
    expect(validatePinCode('ABCDEF')).toBe(false)
    expect(validatePinCode('')).toBe(false)
  })
})

describe('getPANEntityType', () => {
  it('returns Individual for P entity', () => {
    expect(getPANEntityType('ABCPE1234F')).toBe('Individual')
  })

  it('returns Company for C entity', () => {
    expect(getPANEntityType('ABCCE1234F')).toBe('Company')
  })

  it('returns Firm for F entity', () => {
    expect(getPANEntityType('ABCFE1234F')).toBe('Firm')
  })

  it('returns empty string for invalid PAN', () => {
    expect(getPANEntityType('INVALID')).toBe('')
  })
})
