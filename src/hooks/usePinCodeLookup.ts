import { useState, useEffect } from 'react'
import type { PinCodeEntry } from '@/types'
import { lookupPinCode } from '@/utils/pinCodeData'
import { PIN_LOOKUP_DELAY_MS } from '@/utils/constants'

interface PinCodeLookupState {
  city: string
  state: string
  postOffice: string
  isLoading: boolean
  error: string | null
}

export function usePinCodeLookup(pinCode: string): PinCodeLookupState {
  const [result, setResult] = useState<PinCodeLookupState>({
    city: '',
    state: '',
    postOffice: '',
    isLoading: false,
    error: null,
  })

  useEffect(() => {
    if (!pinCode || !/^\d{6}$/.test(pinCode)) {
      setResult({ city: '', state: '', postOffice: '', isLoading: false, error: null })
      return
    }

    setResult((prev) => ({ ...prev, isLoading: true, error: null }))

    const timer = setTimeout(() => {
      const entry: PinCodeEntry | null = lookupPinCode(pinCode)
      if (entry) {
        setResult({
          city: entry.city,
          state: entry.state,
          postOffice: entry.postOffice,
          isLoading: false,
          error: null,
        })
      } else {
        setResult({
          city: '',
          state: '',
          postOffice: '',
          isLoading: false,
          error: 'PIN code not found. Please enter city and state manually.',
        })
      }
    }, PIN_LOOKUP_DELAY_MS)

    return () => clearTimeout(timer)
  }, [pinCode])

  return result
}
