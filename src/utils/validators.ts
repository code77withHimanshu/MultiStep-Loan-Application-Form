import type { LoanType } from '@/types'

// Verhoeff checksum tables
const VERHOEFF_D = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

const VERHOEFF_P = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]

export function verhoeffChecksum(num: string): boolean {
  let c = 0
  const reversed = num.split('').reverse().map(Number)
  reversed.forEach((digit, i) => {
    c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]]
  })
  return c === 0
}

export function validateAadhaar(aadhaar: string): boolean {
  if (!/^\d{12}$/.test(aadhaar)) return false
  return verhoeffChecksum(aadhaar)
}

export function validatePAN(pan: string, loanType: LoanType): boolean {
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return false
  const entityChar = pan[3]
  if (loanType === 'business') {
    return ['P', 'C', 'F'].includes(entityChar)
  }
  return entityChar === 'P'
}

export function validateGST(gst: string): boolean {
  // 15-character format: 2-digit state code + 10-char PAN + entity digit + Z + checksum
  return /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(gst)
}

export function validateMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile)
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validatePinCode(pin: string): boolean {
  return /^\d{6}$/.test(pin)
}

export function getPANEntityType(pan: string): string {
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(pan)) return ''
  const map: Record<string, string> = {
    P: 'Individual',
    C: 'Company',
    H: 'HUF',
    F: 'Firm',
    A: 'AOP',
    T: 'Trust',
    B: 'BOI',
    L: 'Local Authority',
    J: 'Artificial Juridical Person',
    G: 'Government',
  }
  return map[pan[3]] ?? 'Unknown'
}
