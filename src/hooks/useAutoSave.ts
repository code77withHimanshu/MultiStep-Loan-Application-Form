import { useEffect, useRef, useCallback } from 'react'
import type { ApplicationFormData, LoanType, AutoSaveMetadata } from '@/types'
import { encrypt } from '@/utils/encryption'
import { STORAGE_KEY_PREFIX, STORAGE_VERSION, AUTO_SAVE_INTERVAL_MS, STORAGE_TTL_HOURS } from '@/utils/constants'

interface UseAutoSaveOptions {
  interval?: number
  onSave?: (time: Date) => void
}

export function useAutoSave(
  formData: ApplicationFormData,
  currentStep: number,
  options: UseAutoSaveOptions = {},
) {
  const { interval = AUTO_SAVE_INTERVAL_MS, onSave } = options
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const formDataRef = useRef(formData)
  const currentStepRef = useRef(currentStep)

  formDataRef.current = formData
  currentStepRef.current = currentStep

  const save = useCallback(async () => {
    const data = formDataRef.current
    const step = currentStepRef.current
    const loanType = data.loanBasicInfo?.loanType as LoanType | undefined
    if (!loanType || step === 0) return

    try {
      const metadata: AutoSaveMetadata = {
        version: STORAGE_VERSION,
        timestamp: Date.now(),
        step,
        loanType,
      }
      const payload = JSON.stringify({ data, metadata })
      const encrypted = await encrypt(payload)
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${loanType}`, encrypted)
      localStorage.setItem(`${STORAGE_KEY_PREFIX}${loanType}_meta`, JSON.stringify(metadata))
      onSave?.(new Date())
    } catch {
      /* silent fail on encryption errors */
    }
  }, [onSave])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(save, interval)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [formData, currentStep, interval, save])
}

export function checkSavedDraft(loanType: LoanType): AutoSaveMetadata | null {
  try {
    const metaRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${loanType}_meta`)
    if (!metaRaw) return null
    const meta: AutoSaveMetadata = JSON.parse(metaRaw)
    const ageHours = (Date.now() - meta.timestamp) / (1000 * 60 * 60)
    if (ageHours > STORAGE_TTL_HOURS) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${loanType}`)
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${loanType}_meta`)
      return null
    }
    return meta
  } catch {
    return null
  }
}

export function clearSavedDraft(loanType: LoanType): void {
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${loanType}`)
  localStorage.removeItem(`${STORAGE_KEY_PREFIX}${loanType}_meta`)
}
