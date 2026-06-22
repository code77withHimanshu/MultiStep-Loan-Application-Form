import { useState, useCallback } from 'react'
import type { LoanType } from '@/types'
import { validatePAN, validateAadhaar } from '@/utils/validators'
import { VERIFICATION_DELAY_MS } from '@/utils/constants'

type VerificationType = 'PAN' | 'AADHAAR'

interface VerificationState {
  isVerifying: boolean
  isVerified: boolean
  error: string | null
}

interface UseVerificationReturn extends VerificationState {
  verify: (value: string) => void
  reset: () => void
}

export function useVerification(
  type: VerificationType,
  loanType?: LoanType,
): UseVerificationReturn {
  const [state, setState] = useState<VerificationState>({
    isVerifying: false,
    isVerified: false,
    error: null,
  })

  const verify = useCallback(
    (value: string) => {
      if (!value) return

      let isValid = false
      let errorMsg = ''

      if (type === 'PAN') {
        if (!loanType) {
          errorMsg = 'Loan type must be selected before PAN verification'
        } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value)) {
          errorMsg = 'PAN must be in format: ABCDE1234F'
        } else if (!validatePAN(value, loanType)) {
          const entityMap: Record<LoanType, string> = {
            personal: 'Individual (P)',
            home: 'Individual (P)',
            business: 'Company (C), Firm (F), or Individual (P)',
          }
          errorMsg = `PAN entity type not valid for ${loanType} loan. Required: ${entityMap[loanType]}`
        } else {
          isValid = true
        }
      } else {
        if (!/^\d{12}$/.test(value)) {
          errorMsg = 'Aadhaar number must be exactly 12 digits'
        } else if (!validateAadhaar(value)) {
          errorMsg = 'Invalid Aadhaar number (checksum failed)'
        } else {
          isValid = true
        }
      }

      if (!isValid) {
        setState({ isVerifying: false, isVerified: false, error: errorMsg })
        return
      }

      setState({ isVerifying: true, isVerified: false, error: null })
      setTimeout(() => {
        setState({ isVerifying: false, isVerified: true, error: null })
      }, VERIFICATION_DELAY_MS)
    },
    [type, loanType],
  )

  const reset = useCallback(() => {
    setState({ isVerifying: false, isVerified: false, error: null })
  }, [])

  return { ...state, verify, reset }
}
