import { STORAGE_KEY } from '@/utils/constants'

export interface SavedFormState {
  currentStep: number
  formData: {
    personalInfo: Record<string, unknown>
    addressInfo: Record<string, unknown>
    employmentInfo: Record<string, unknown>
    loanDetails: Record<string, unknown>
  }
  savedAt: string
}

export const storageService = {
  save(state: SavedFormState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* Storage might be full or unavailable */
    }
  },

  load(): SavedFormState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      return JSON.parse(raw) as SavedFormState
    } catch {
      return null
    }
  },

  clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* Storage might be unavailable */
    }
  },

  hasData(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) !== null
    } catch {
      return false
    }
  },
}
