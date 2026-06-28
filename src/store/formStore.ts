import { create } from 'zustand'
import type {
  ApplicationFormData,
  LoanType,
  SubmissionResponse,
  EligibilityResult,
} from '@/types'
import { TOTAL_STEPS, STORAGE_KEY_PREFIX } from '@/utils/constants'

export const initialFormData: ApplicationFormData = {
  loanBasicInfo: {},
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    panNumber: '',
  },
  kycInfo: {},
  addressInfo: {},
  employmentInfo: {},
  coApplicantInfo: {},
  documentsAndSignature: {},
  consentInfo: {},
  loanDetails: {},
}

interface FormState {
  currentStep: number
  formData: ApplicationFormData
  submitted: boolean
  submissionResult: SubmissionResponse | null
  hasSavedData: boolean
  savedLoanType: LoanType | null
  eligibility: EligibilityResult | null
  savedAt: number | null
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
  setEligibility: (result: EligibilityResult | null) => void
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
  eligibility: null,
  savedAt: null,
}

export const useFormStore = create<FormStore>()((set, get) => ({
  ...initialState,

  nextStep: () => {
    const { currentStep, getEffectiveTotalSteps } = get()
    const maxStep = getEffectiveTotalSteps() - 1
    set({ currentStep: Math.min(currentStep + 1, maxStep) })
  },

  prevStep: () => {
    const { currentStep } = get()
    set({ currentStep: Math.max(currentStep - 1, 0) })
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

  setEligibility: (result: EligibilityResult | null) =>
    set({ eligibility: result }),

  isStep6Active: (): boolean => {
    const { formData } = get()
    const loanType =
      formData.loanBasicInfo?.loanType ??
      (formData.loanDetails?.loanType as LoanType | undefined)
    const rawAmount =
      formData.loanBasicInfo?.loanAmount ?? formData.loanDetails?.loanAmount
    const loanAmount =
      typeof rawAmount === 'string' ? parseFloat(rawAmount) : (rawAmount ?? 0)
    if (!loanType || !loanAmount) return false
    if (loanType === 'home') return true
    const { CO_APPLICANT_THRESHOLDS } = require('@/utils/constants') as typeof import('@/utils/constants')
    const threshold = CO_APPLICANT_THRESHOLDS[loanType as LoanType]
    if (threshold === null) return true
    return loanAmount > threshold
  },

  getEffectiveTotalSteps: (): number => TOTAL_STEPS,
}))
