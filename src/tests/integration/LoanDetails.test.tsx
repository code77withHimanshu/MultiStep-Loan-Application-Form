import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import LoanDetails from '@/components/steps/LoanDetails'
import { useFormStore, initialFormData } from '@/store/formStore'

vi.mock('@/services/eligibility', () => ({
  fetchEligibility: vi.fn().mockResolvedValue({
    eligible: true,
    verdict: 'approved',
    creditScore: 750,
    maxLoanAmount: 3000000,
    suggestedInterestRate: 8.5,
    emiToIncomeRatio: 0.3,
    reasons: ['Good profile'],
  }),
}))

function resetStore(withIncome = false) {
  useFormStore.setState({
    currentStep: 3,
    formData: {
      ...initialFormData,
      employmentInfo: withIncome
        ? { ...initialFormData.employmentInfo, monthlyNetIncome: '80000', workExperience: '5' }
        : initialFormData.employmentInfo,
    },
    submitted: false, submissionResult: null, eligibility: null, savedAt: null, hasSavedData: false,
  })
}

describe('LoanDetails component', () => {
  beforeEach(() => resetStore())

  it('renders all loan type buttons', () => {
    render(<LoanDetails />)
    expect(screen.getByTestId('loan-type-home')).toBeInTheDocument()
    expect(screen.getByTestId('loan-type-personal')).toBeInTheDocument()
    expect(screen.getByTestId('loan-type-business')).toBeInTheDocument()
    expect(screen.getByTestId('loan-type-car')).toBeInTheDocument()
    expect(screen.getByTestId('loan-type-education')).toBeInTheDocument()
  })

  it('selects loan type on click', async () => {
    const user = userEvent.setup()
    render(<LoanDetails />)
    await user.click(screen.getByTestId('loan-type-personal'))
    expect(screen.getByTestId('loan-type-personal')).toHaveAttribute('aria-checked', 'true')
  })

  it('shows interest rate banner when loan type is selected', async () => {
    const user = userEvent.setup()
    render(<LoanDetails />)
    await user.click(screen.getByTestId('loan-type-personal'))
    await waitFor(() => {
      expect(screen.getByText(/14.*per annum/i)).toBeInTheDocument()
    })
  })

  it('shows EMI card when loan amount, type and tenure are provided', async () => {
    const user = userEvent.setup()
    render(<LoanDetails />)
    await user.click(screen.getByTestId('loan-type-personal'))
    await user.type(document.querySelector('[name="loanAmount"]') as HTMLElement, '500000')
    await user.type(document.querySelector('[name="tenure"]') as HTMLElement, '60')
    await waitFor(() => {
      expect(screen.getByTestId('emi-card')).toBeInTheDocument()
    })
  })

  it('shows validation errors when continue is clicked empty', async () => {
    const user = userEvent.setup()
    render(<LoanDetails />)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('shows eligibility card when income is available from store', async () => {
    resetStore(true)
    const user = userEvent.setup()
    render(<LoanDetails />)
    await user.click(screen.getByTestId('loan-type-home'))
    await user.type(document.querySelector('[name="loanAmount"]') as HTMLElement, '3000000')
    await user.type(document.querySelector('[name="tenure"]') as HTMLElement, '240')
    await waitFor(() => {
      expect(screen.getByTestId('eligibility-card')).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('navigates back to employment step', async () => {
    const user = userEvent.setup()
    render(<LoanDetails />)
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(useFormStore.getState().currentStep).toBe(2)
  })

  it('shows home loan interest rate of 8.5%', async () => {
    const user = userEvent.setup()
    render(<LoanDetails />)
    await user.click(screen.getByTestId('loan-type-home'))
    await waitFor(() => {
      expect(screen.getByText(/8\.5.*per annum/i)).toBeInTheDocument()
    })
  })
})
