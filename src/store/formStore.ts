import { create } from 'zustand'
import type {
  ApplicationFormData,
  LoanType,
  SubmissionResponse,
} from '@/types'
import { TOTAL_STEPS, CO_APPLICANT_THRESHOLDS, STORAGE_KEY_PREFIX } from '@/utils/constants'

const initialFormData: ApplicationFormData = {
  loanBasicInfo: {},
  personalInfo: {},
  kycInfo: {},
  addressInfo: {},
  employmentInfo: {},
  coApplicantInfo: {},
  documentsAndSignature: {},
  consentInfo: {},
}

interface FormState {
  currentStep: number
  formData: ApplicationFormData
  submitted: boolean
  submissionResult: SubmissionResponse | null
  hasSavedData: boolean
  savedLoanType: LoanType | null
}

interface FormActions {
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  updateFormData: <K extends keyof ApplicationFormData>(
    section: K,
    data: ApplicationFormData[K],
  ) => void
  setSubmitted: (submitted: boolean, result?: SubmissionResponse) => void
  resetForm: () => void
  setHasSavedData: (hasSaved: boolean, loanType?: LoanType | null) => void
  isStep6Active: () => boolean
  getEffectiveTotalSteps: () => number
}

export type FormStore = FormState & FormActions

const initialState: FormState = {
  currentStep: 0,
  formData: initialFormData,
  submitted: false,
  submissionResult: null,
  hasSavedData: false,
  savedLoanType: null,
}

export const useFormStore = create<FormStore>()((set, get) => ({
  ...initialState,

  nextStep: () => {
    const { currentStep, isStep6Active, getEffectiveTotalSteps } = get()
    const maxStep = getEffectiveTotalSteps() - 1
    // Skip step index 5 (Co-Applicant, 0-indexed) if not active
    if (currentStep === 4 && !isStep6Active()) {
      set({ currentStep: Math.min(6, maxStep) })
    } else {
      set({ currentStep: Math.min(currentStep + 1, maxStep) })
    }
  },

  prevStep: () => {
    const { currentStep, isStep6Active } = get()
    // Skip step index 5 when going back if not active
    if (currentStep === 6 && !isStep6Active()) {
      set({ currentStep: Math.max(4, 0) })
    } else {
      set({ currentStep: Math.max(currentStep - 1, 0) })
    }
  },

  goToStep: (step: number) =>
    set({ currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),

  updateFormData: <K extends keyof ApplicationFormData>(
    section: K,
    data: ApplicationFormData[K],
  ) =>
    set((s) => ({
      formData: {
        ...s.formData,
        [section]: { ...s.formData[section], ...data },
      },
    })),

  setSubmitted: (submitted: boolean, result?: SubmissionResponse) =>
    set({ submitted, submissionResult: result ?? null }),

  resetForm: () => {
    const { formData } = get()
    const loanType = formData.loanBasicInfo?.loanType
    if (loanType) {
      try {
        localStorage.removeItem(`${STORAGE_KEY_PREFIX}${loanType}`)
      } catch {
        /* ignore */
      }
    }
    set({ ...initialState })
  },

  setHasSavedData: (hasSaved: boolean, loanType?: LoanType | null) =>
    set({ hasSavedData: hasSaved, savedLoanType: loanType ?? null }),

  isStep6Active: (): boolean => {
    const { formData } = get()
    const { loanType, loanAmount } = formData.loanBasicInfo ?? {}
    if (!loanType || !loanAmount) return false
    if (loanType === 'home') return true
    const threshold = CO_APPLICANT_THRESHOLDS[loanType]
    if (threshold === null) return true
    return loanAmount > threshold
  },

  getEffectiveTotalSteps: (): number => TOTAL_STEPS,
}))
