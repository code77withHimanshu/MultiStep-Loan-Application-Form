import { describe, it, expect, beforeEach } from 'vitest'
import { useFormStore, initialFormData } from '@/store/formStore'

function resetStore() {
  useFormStore.setState({
    currentStep: 0,
    formData: initialFormData,
    submitted: false,
    submissionResult: null,
    eligibility: null,
    savedAt: null,
    hasSavedData: false,
  })
}

describe('formStore navigation', () => {
  beforeEach(resetStore)

  it('starts at step 0', () => {
    expect(useFormStore.getState().currentStep).toBe(0)
  })

  it('increments step on nextStep', () => {
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
    useFormStore.setState({ currentStep: 6 })
    useFormStore.getState().nextStep()
    expect(useFormStore.getState().currentStep).toBe(6)
  })

  it('goToStep sets exact step', () => {
    useFormStore.getState().goToStep(4)
    expect(useFormStore.getState().currentStep).toBe(4)
  })

  it('goToStep clamps to valid range', () => {
    useFormStore.getState().goToStep(-1)
    expect(useFormStore.getState().currentStep).toBe(0)
    useFormStore.getState().goToStep(100)
    expect(useFormStore.getState().currentStep).toBe(6)
  })
})

describe('formStore updateFormData', () => {
  beforeEach(resetStore)

  it('updates personalInfo', () => {
    useFormStore.getState().updateFormData('personalInfo', { firstName: 'Priya', lastName: 'Singh' })
    const { formData } = useFormStore.getState()
    expect(formData.personalInfo.firstName).toBe('Priya')
    expect(formData.personalInfo.lastName).toBe('Singh')
  })

  it('merges partial updates', () => {
    useFormStore.getState().updateFormData('personalInfo', { firstName: 'Rahul' })
    useFormStore.getState().updateFormData('personalInfo', { lastName: 'Sharma' })
    const { personalInfo } = useFormStore.getState().formData
    expect(personalInfo.firstName).toBe('Rahul')
    expect(personalInfo.lastName).toBe('Sharma')
  })

  it('updates loanDetails', () => {
    useFormStore.getState().updateFormData('loanDetails', { loanType: 'home', loanAmount: '5000000' })
    expect(useFormStore.getState().formData.loanDetails.loanType).toBe('home')
    expect(useFormStore.getState().formData.loanDetails.loanAmount).toBe('5000000')
  })

  it('updates employmentInfo', () => {
    useFormStore.getState().updateFormData('employmentInfo', { employmentType: 'salaried', monthlyNetIncome: '80000' })
    expect(useFormStore.getState().formData.employmentInfo.employmentType).toBe('salaried')
  })

  it('sets savedAt when updating form data', () => {
    useFormStore.getState().updateFormData('personalInfo', { firstName: 'Test' })
    expect(useFormStore.getState().savedAt).not.toBeNull()
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
      referenceNumber: 'LN12345678',
      status: 'submitted' as const,
      submittedAt: new Date().toISOString(),
    }
    useFormStore.getState().setSubmitted(true, result)
    expect(useFormStore.getState().submissionResult?.referenceNumber).toBe('LN12345678')
  })

  it('resets form on resetForm', () => {
    useFormStore.getState().updateFormData('personalInfo', { firstName: 'Test' })
    useFormStore.setState({ currentStep: 3 })
    useFormStore.getState().resetForm()
    expect(useFormStore.getState().currentStep).toBe(0)
    expect(useFormStore.getState().formData.personalInfo.firstName).toBe('')
    expect(useFormStore.getState().submitted).toBe(false)
  })
})

describe('formStore eligibility', () => {
  beforeEach(resetStore)

  it('sets eligibility result', () => {
    const result = {
      eligible: true,
      verdict: 'approved' as const,
      creditScore: 750,
      maxLoanAmount: 3000000,
      suggestedInterestRate: 8.5,
      emiToIncomeRatio: 0.3,
      reasons: ['Good profile'],
    }
    useFormStore.getState().setEligibility(result)
    expect(useFormStore.getState().eligibility?.verdict).toBe('approved')
  })

  it('clears eligibility on null', () => {
    useFormStore.getState().setEligibility(null)
    expect(useFormStore.getState().eligibility).toBeNull()
  })
})
