import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { ApplicationFormData, EligibilityResult, SubmissionResponse } from '@/types'
import { STORAGE_KEY, TOTAL_STEPS } from '@/utils/constants'

export const initialFormData: ApplicationFormData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    panNumber: '',
    nationality: 'Indian',
  },
  addressInfo: {
    currentAddressLine1: '',
    currentAddressLine2: '',
    currentCity: '',
    currentState: '',
    currentZip: '',
    currentCountry: 'India',
    sameAsPermanent: false,
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentCity: '',
    permanentState: '',
    permanentZip: '',
    permanentCountry: 'India',
  },
  employmentInfo: {
    employmentType: '',
    employerName: '',
    jobTitle: '',
    monthlyGrossIncome: '',
    monthlyNetIncome: '',
    workExperience: '',
    employmentStartDate: '',
  },
  loanDetails: {
    loanType: '',
    loanAmount: '',
    loanPurpose: '',
    tenure: '',
    preferredEMIDate: '',
  },
  documents: {
    idProof: null,
    addressProof: null,
    incomeProof: null,
    photo: null,
  },
  signature: {
    dataUrl: null,
  },
}

interface FormState {
  currentStep: number
  formData: ApplicationFormData
  submitted: boolean
  submissionResult: SubmissionResponse | null
  eligibility: EligibilityResult | null
  savedAt: string | null
  hasSavedData: boolean
}

interface FormActions {
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  updateFormData: <K extends keyof ApplicationFormData>(
    section: K,
    data: Partial<ApplicationFormData[K]>
  ) => void
  setSubmitted: (submitted: boolean, result?: SubmissionResponse) => void
  setEligibility: (result: EligibilityResult | null) => void
  resetForm: () => void
  acknowledgeResume: () => void
}

export type FormStore = FormState & FormActions

const initialState: FormState = {
  currentStep: 0,
  formData: initialFormData,
  submitted: false,
  submissionResult: null,
  eligibility: null,
  savedAt: null,
  hasSavedData: false,
}

export const useFormStore = create<FormStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      nextStep: () =>
        set((s) => ({ currentStep: Math.min(s.currentStep + 1, TOTAL_STEPS - 1) })),

      prevStep: () =>
        set((s) => ({ currentStep: Math.max(s.currentStep - 1, 0) })),

      goToStep: (step: number) =>
        set({ currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),

      updateFormData: <K extends keyof ApplicationFormData>(
        section: K,
        data: Partial<ApplicationFormData[K]>
      ) =>
        set((s) => ({
          formData: {
            ...s.formData,
            [section]: { ...s.formData[section], ...data },
          },
          savedAt: new Date().toISOString(),
        })),

      setSubmitted: (submitted: boolean, result?: SubmissionResponse) =>
        set({ submitted, submissionResult: result ?? null }),

      setEligibility: (result: EligibilityResult | null) =>
        set({ eligibility: result }),

      resetForm: () => {
        set({ ...initialState, hasSavedData: false, savedAt: null })
        try {
          localStorage.removeItem(STORAGE_KEY)
        } catch {
          /* ignore */
        }
      },

      acknowledgeResume: () => set({ hasSavedData: false }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentStep: state.currentStep,
        formData: {
          personalInfo: state.formData.personalInfo,
          addressInfo: state.formData.addressInfo,
          employmentInfo: state.formData.employmentInfo,
          loanDetails: state.formData.loanDetails,
          documents: initialFormData.documents,
          signature: initialFormData.signature,
        },
        savedAt: state.savedAt,
        hasSavedData: get().currentStep > 0 || Object.values(state.formData.personalInfo).some((v) => v !== ''),
      }),
      onRehydrateStorage: () => (state) => {
        if (state && state.currentStep > 0) {
          state.hasSavedData = true
        }
      },
    }
  )
)
