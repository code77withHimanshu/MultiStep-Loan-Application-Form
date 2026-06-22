import { describe, it, expect, beforeEach } from 'vitest'
import { useFormStore } from '@/store/formStore'

function resetStore() {
  useFormStore.setState({
    currentStep: 0,
    formData: {
      loanBasicInfo: {},
      personalInfo: {},
      kycInfo: {},
      addressInfo: {},
      employmentInfo: {},
      coApplicantInfo: {},
      documentsAndSignature: {},
      consentInfo: {},
    },
    submitted: false,
    submissionResult: null,
    hasSavedData: false,
    savedLoanType: null,
  })
}

describe('formStore navigation', () => {
  beforeEach(resetStore)

  it('starts at step 0', () => {
    expect(useFormStore.getState().currentStep).toBe(0)
  })

  it('increments step on nextStep (step 6 not active)', () => {
    useFormStore.getState().nextStep()
    expect(useFormStore.getState().currentStep).toBe(1)
  })

  it('decrements step on prevStep', () => {
    useFormStore.setState({ currentStep: 3 })
    useFormStore.getState().prevStep()
    expect(useFormStore.getState().currentStep).toBe(2)
  })

  it('does not go below step 0', () => {
    useFormStore.getState().prevStep()
    expect(useFormStore.getState().currentStep).toBe(0)
  })

  it('does not exceed TOTAL_STEPS - 1', () => {
    useFormStore.setState({ currentStep: 7 })
    useFormStore.getState().nextStep()
    expect(useFormStore.getState().currentStep).toBe(7)
  })

  it('goToStep sets exact step', () => {
    useFormStore.getState().goToStep(4)
    expect(useFormStore.getState().currentStep).toBe(4)
  })

  it('goToStep clamps to valid range', () => {
    useFormStore.getState().goToStep(-1)
    expect(useFormStore.getState().currentStep).toBe(0)
    useFormStore.getState().goToStep(100)
    expect(useFormStore.getState().currentStep).toBe(7)
  })
})

describe('formStore isStep6Active', () => {
  beforeEach(resetStore)

  it('returns true for home loan regardless of amount', () => {
    useFormStore.setState({
      formData: {
        loanBasicInfo: { loanType: 'home', loanAmount: 500000 },
        personalInfo: {}, kycInfo: {}, addressInfo: {}, employmentInfo: {},
        coApplicantInfo: {}, documentsAndSignature: {}, consentInfo: {},
      },
    })
    expect(useFormStore.getState().isStep6Active()).toBe(true)
  })

  it('returns false for personal loan at or below ₹5,00,000', () => {
    useFormStore.setState({
      formData: {
        loanBasicInfo: { loanType: 'personal', loanAmount: 500000 },
        personalInfo: {}, kycInfo: {}, addressInfo: {}, employmentInfo: {},
        coApplicantInfo: {}, documentsAndSignature: {}, consentInfo: {},
      },
    })
    expect(useFormStore.getState().isStep6Active()).toBe(false)
  })

  it('returns true for personal loan above ₹5,00,000', () => {
    useFormStore.setState({
      formData: {
        loanBasicInfo: { loanType: 'personal', loanAmount: 500001 },
        personalInfo: {}, kycInfo: {}, addressInfo: {}, employmentInfo: {},
        coApplicantInfo: {}, documentsAndSignature: {}, consentInfo: {},
      },
    })
    expect(useFormStore.getState().isStep6Active()).toBe(true)
  })

  it('returns false for business loan at or below ₹20,00,000', () => {
    useFormStore.setState({
      formData: {
        loanBasicInfo: { loanType: 'business', loanAmount: 2000000 },
        personalInfo: {}, kycInfo: {}, addressInfo: {}, employmentInfo: {},
        coApplicantInfo: {}, documentsAndSignature: {}, consentInfo: {},
      },
    })
    expect(useFormStore.getState().isStep6Active()).toBe(false)
  })

  it('returns true for business loan above ₹20,00,000', () => {
    useFormStore.setState({
      formData: {
        loanBasicInfo: { loanType: 'business', loanAmount: 2000001 },
        personalInfo: {}, kycInfo: {}, addressInfo: {}, employmentInfo: {},
        coApplicantInfo: {}, documentsAndSignature: {}, consentInfo: {},
      },
    })
    expect(useFormStore.getState().isStep6Active()).toBe(true)
  })
})

describe('formStore updateFormData', () => {
  beforeEach(resetStore)

  it('updates personalInfo', () => {
    useFormStore.getState().updateFormData('personalInfo', { fullName: 'Priya Singh' })
    const { formData } = useFormStore.getState()
    expect(formData.personalInfo.fullName).toBe('Priya Singh')
  })

  it('merges partial updates', () => {
    useFormStore.getState().updateFormData('personalInfo', { fullName: 'Rahul' })
    useFormStore.getState().updateFormData('personalInfo', { email: 'rahul@example.com' })
    const { personalInfo } = useFormStore.getState().formData
    expect(personalInfo.fullName).toBe('Rahul')
    expect(personalInfo.email).toBe('rahul@example.com')
  })

  it('updates loanBasicInfo', () => {
    useFormStore.getState().updateFormData('loanBasicInfo', { loanType: 'home', loanAmount: 5000000 })
    expect(useFormStore.getState().formData.loanBasicInfo.loanType).toBe('home')
    expect(useFormStore.getState().formData.loanBasicInfo.loanAmount).toBe(5000000)
  })
})

describe('formStore submission', () => {
  beforeEach(resetStore)

  it('marks form as submitted', () => {
    useFormStore.getState().setSubmitted(true)
    expect(useFormStore.getState().submitted).toBe(true)
  })

  it('stores submission result', () => {
    const result = {
      applicationId: 'APP123',
      referenceNumber: 'LS12345678',
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
      loanType: 'personal' as const,
      loanAmount: 300000,
    }
    useFormStore.getState().setSubmitted(true, result)
    expect(useFormStore.getState().submissionResult?.referenceNumber).toBe('LS12345678')
  })

  it('resets form on resetForm', () => {
    useFormStore.getState().updateFormData('personalInfo', { fullName: 'Test' })
    useFormStore.setState({ currentStep: 3 })
    useFormStore.getState().resetForm()
    expect(useFormStore.getState().currentStep).toBe(0)
    expect(useFormStore.getState().formData.personalInfo.fullName).toBeUndefined()
    expect(useFormStore.getState().submitted).toBe(false)
  })
})
