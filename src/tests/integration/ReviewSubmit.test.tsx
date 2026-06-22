import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import ReviewSubmit from '@/components/steps/ReviewSubmit'
import { useFormStore, initialFormData } from '@/store/formStore'

vi.mock('@/services/api', () => ({
  apiService: {
    submitApplication: vi.fn().mockResolvedValue({
      success: true,
      data: {
        applicationId: 'APP123456',
        referenceNumber: 'LN12345678',
        status: 'submitted',
        submittedAt: new Date().toISOString(),
      },
    }),
  },
}))

const filledFormData = {
  ...initialFormData,
  personalInfo: {
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    dateOfBirth: '1990-05-15',
    gender: 'male' as const,
    maritalStatus: 'single' as const,
    panNumber: 'ABCDE1234F',
    nationality: 'Indian' as const,
  },
  employmentInfo: {
    employmentType: 'salaried' as const,
    employerName: 'Acme Corp',
    jobTitle: 'Engineer',
    monthlyGrossIncome: '80000',
    monthlyNetIncome: '65000',
    workExperience: '5',
    employmentStartDate: '2019-01-01',
  },
  loanDetails: {
    loanType: 'personal' as const,
    loanAmount: '500000',
    loanPurpose: 'Medical expenses',
    tenure: '60',
    preferredEMIDate: '5',
  },
}

function resetStore() {
  useFormStore.setState({
    currentStep: 6,
    formData: filledFormData,
    submitted: false, submissionResult: null, eligibility: null, savedAt: null, hasSavedData: false,
  })
}

describe('ReviewSubmit component', () => {
  beforeEach(resetStore)

  it('renders all review sections', () => {
    render(<ReviewSubmit />)
    expect(screen.getByText(/Review.*Submit/i)).toBeInTheDocument()
    expect(screen.getByText(/Personal Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Employment.*Income/i)).toBeInTheDocument()
    expect(screen.getByText(/Loan Details/i)).toBeInTheDocument()
  })

  it('displays applicant name', () => {
    render(<ReviewSubmit />)
    expect(screen.getByText('Rahul Sharma')).toBeInTheDocument()
  })

  it('displays email address', () => {
    render(<ReviewSubmit />)
    expect(screen.getByText('rahul@example.com')).toBeInTheDocument()
  })

  it('displays loan type as Personal Loan', () => {
    render(<ReviewSubmit />)
    expect(screen.getByText('Personal Loan')).toBeInTheDocument()
  })

  it('requires agreement checkbox before submission', async () => {
    const user = userEvent.setup()
    render(<ReviewSubmit />)
    await user.click(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/agree/i)
    })
  })

  it('submits successfully when checkbox is checked', async () => {
    const user = userEvent.setup()
    render(<ReviewSubmit />)
    await user.click(screen.getByTestId('declaration-checkbox'))
    await user.click(screen.getByTestId('submit-btn'))
    await waitFor(() => {
      expect(useFormStore.getState().submitted).toBe(true)
    }, { timeout: 5000 })
  })

  it('navigates back to signature step', async () => {
    const user = userEvent.setup()
    render(<ReviewSubmit />)
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(useFormStore.getState().currentStep).toBe(5)
  })

  it('Edit buttons navigate to correct steps', async () => {
    const user = userEvent.setup()
    render(<ReviewSubmit />)
    const editButtons = screen.getAllByText('Edit')
    await user.click(editButtons[0])
    expect(useFormStore.getState().currentStep).toBe(0)
  })

  it('shows PAN number in review', () => {
    render(<ReviewSubmit />)
    expect(screen.getByText('ABCDE1234F')).toBeInTheDocument()
  })
})
