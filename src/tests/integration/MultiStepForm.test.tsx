import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import MultiStepForm from '@/components/MultiStepForm'
import { useFormStore, initialFormData } from '@/store/formStore'

vi.mock('@/hooks/useFormPersistence', () => ({ useFormPersistence: vi.fn() }))
vi.mock('signature_pad', () => ({
  default: class {
    addEventListener() {}
    on() {}
    off() {}
    clear() {}
    isEmpty() { return true }
    toDataURL() { return '' }
    fromDataURL() {}
    toData() { return [] }
    fromData() {}
  },
}))

function resetStore() {
  useFormStore.setState({ currentStep: 0, formData: initialFormData, submitted: false, submissionResult: null, eligibility: null, savedAt: null, hasSavedData: false })
}

describe('MultiStepForm', () => {
  beforeEach(resetStore)

  it('renders step 1 (Personal Info) by default', () => {
    render(<MultiStepForm />)
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
  })

  it('renders StepIndicator', () => {
    render(<MultiStepForm />)
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('does not show ResumePrompt when hasSavedData is false', () => {
    render(<MultiStepForm />)
    expect(screen.queryByTestId('resume-prompt')).not.toBeInTheDocument()
  })

  it('shows ResumePrompt when hasSavedData is true', () => {
    useFormStore.setState({ hasSavedData: true, currentStep: 2 })
    render(<MultiStepForm />)
    expect(screen.getByTestId('resume-prompt')).toBeInTheDocument()
  })

  it('shows SuccessScreen when submitted', () => {
    useFormStore.setState({ submitted: true, submissionResult: null })
    render(<MultiStepForm />)
    expect(screen.getByTestId('success-screen')).toBeInTheDocument()
  })

  it('clicking Continue in resume prompt acknowledges and hides it', async () => {
    const user = userEvent.setup()
    useFormStore.setState({ hasSavedData: true, currentStep: 1 })
    render(<MultiStepForm />)
    await user.click(screen.getByTestId('resume-continue'))
    await waitFor(() => {
      expect(screen.queryByTestId('resume-prompt')).not.toBeInTheDocument()
    })
  })

  it('clicking Start New in resume prompt resets form', async () => {
    const user = userEvent.setup()
    useFormStore.setState({ hasSavedData: true, currentStep: 3, formData: { ...initialFormData, personalInfo: { ...initialFormData.personalInfo, firstName: 'Test' } } })
    render(<MultiStepForm />)
    await user.click(screen.getByTestId('resume-start-new'))
    await waitFor(() => {
      expect(useFormStore.getState().currentStep).toBe(0)
      expect(useFormStore.getState().formData.personalInfo.firstName).toBe('')
    })
  })

  it('renders Address step when currentStep is 1', () => {
    useFormStore.setState({ currentStep: 1 })
    render(<MultiStepForm />)
    expect(screen.getByText('Address Information')).toBeInTheDocument()
  })

  it('renders step indicator with 7 steps', () => {
    render(<MultiStepForm />)
    expect(screen.getByText('Step 1 of 7')).toBeInTheDocument()
  })
})

describe('SuccessScreen', () => {
  beforeEach(() => {
    useFormStore.setState({
      currentStep: 0,
      submitted: true,
      formData: {
        ...initialFormData,
        personalInfo: { ...initialFormData.personalInfo, firstName: 'Priya', lastName: 'Singh', email: 'priya@test.com' },
      },
      submissionResult: {
        applicationId: 'APP999',
        referenceNumber: 'LN99999999',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      },
      eligibility: null, savedAt: null, hasSavedData: false,
    })
  })

  it('shows reference number from submission result', () => {
    render(<MultiStepForm />)
    expect(screen.getByTestId('reference-number')).toHaveTextContent('LN99999999')
  })

  it('shows applicant name', () => {
    render(<MultiStepForm />)
    expect(screen.getByText(/Priya Singh/i)).toBeInTheDocument()
  })

  it('shows email', () => {
    render(<MultiStepForm />)
    expect(screen.getByText(/priya@test.com/i)).toBeInTheDocument()
  })

  it('Apply Again button resets form', async () => {
    const user = userEvent.setup()
    render(<MultiStepForm />)
    await user.click(screen.getByTestId('apply-again-btn'))
    expect(useFormStore.getState().submitted).toBe(false)
  })
})
