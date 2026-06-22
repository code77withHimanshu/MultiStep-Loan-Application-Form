import { useEffect, useState, useCallback } from 'react'
import type { ApplicationFormData, LoanType, AutoSaveMetadata } from '@/types'
import { decrypt } from '@/utils/encryption'
import { STORAGE_KEY_PREFIX, STORAGE_TTL_HOURS } from '@/utils/constants'

interface ResumeInfo {
  metadata: AutoSaveMetadata
  loanType: LoanType
}

interface UseFormPersistenceReturn {
  hasSavedDraft: boolean
  resumeInfo: ResumeInfo | null
  loadSavedDraft: () => Promise<ApplicationFormData | null>
  dismissResume: () => void
}

const LOAN_TYPES: LoanType[] = ['personal', 'home', 'business']

export function useFormPersistence(): UseFormPersistenceReturn {
  const [hasSavedDraft, setHasSavedDraft] = useState(false)
  const [resumeInfo, setResumeInfo] = useState<ResumeInfo | null>(null)

  useEffect(() => {
    for (const loanType of LOAN_TYPES) {
      try {
        const metaRaw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${loanType}_meta`)
        if (!metaRaw) continue
        const meta: AutoSaveMetadata = JSON.parse(metaRaw)
        const ageHours = (Date.now() - meta.timestamp) / (1000 * 60 * 60)
        if (ageHours > STORAGE_TTL_HOURS) {
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}${loanType}`)
          localStorage.removeItem(`${STORAGE_KEY_PREFIX}${loanType}_meta`)
          continue
        }
        if (meta.step > 0) {
          setHasSavedDraft(true)
          setResumeInfo({ metadata: meta, loanType })
          break
        }
      } catch {
        /* ignore malformed data */
      }
    }
  }, [])

  const loadSavedDraft = useCallback(async (): Promise<ApplicationFormData | null> => {
    if (!resumeInfo) return null
    try {
      const encrypted = localStorage.getItem(`${STORAGE_KEY_PREFIX}${resumeInfo.loanType}`)
      if (!encrypted) return null
      const decrypted = await decrypt(encrypted)
      const { data } = JSON.parse(decrypted)
      return data as ApplicationFormData
    } catch {
      return null
    }
  }, [resumeInfo])

  const dismissResume = useCallback(() => {
    setHasSavedDraft(false)
    setResumeInfo(null)
  }, [])

  return { hasSavedDraft, resumeInfo, loadSavedDraft, dismissResume }
}
