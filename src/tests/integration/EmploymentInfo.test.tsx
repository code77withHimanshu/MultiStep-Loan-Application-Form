import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import EmploymentInfo from '@/components/steps/EmploymentInfo'
import { useFormStore, initialFormData } from '@/store/formStore'

function resetStore() {
  useFormStore.setState({ currentStep: 2, formData: initialFormData, submitted: false, submissionResult: null, eligibility: null, savedAt: null, hasSavedData: false })
}

describe('EmploymentInfo component', () => {
  beforeEach(resetStore)

  it('renders employment type select', () => {
    render(<EmploymentInfo />)
    expect(screen.getByText('Employment & Income')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /employment type/i })).toBeInTheDocument()
  })

  it('shows employer fields when salaried is selected', async () => {
    const user = userEvent.setup()
    render(<EmploymentInfo />)
    const select = screen.getByRole('combobox', { name: /employment type/i })
    await user.selectOptions(select, 'salaried')
    await waitFor(() => {
      expect(screen.getByText('Employer Name')).toBeInTheDocument()
      expect(screen.getByText('Job Title / Designation')).toBeInTheDocument()
    })
  })

  it('hides employer fields when retired is selected', async () => {
    const user = userEvent.setup()
    render(<EmploymentInfo />)
    const select = screen.getByRole('combobox', { name: /employment type/i })
    await user.selectOptions(select, 'retired')
    await waitFor(() => {
      expect(screen.queryByText('Employer Name')).not.toBeInTheDocument()
    })
  })

  it('shows income fields when employment type is selected', async () => {
    const user = userEvent.setup()
    render(<EmploymentInfo />)
    await user.selectOptions(screen.getByRole('combobox', { name: /employment type/i }), 'salaried')
    await waitFor(() => {
      expect(screen.getByText('Monthly Gross Income')).toBeInTheDocument()
      expect(screen.getByText('Monthly Net Income')).toBeInTheDocument()
    })
  })

  it('validates required fields on continue', async () => {
    const user = userEvent.setup()
    render(<EmploymentInfo />)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('shows self-employed labels correctly', async () => {
    const user = userEvent.setup()
    render(<EmploymentInfo />)
    await user.selectOptions(screen.getByRole('combobox', { name: /employment type/i }), 'self_employed')
    await waitFor(() => {
      expect(screen.getByText('Business / Firm Name')).toBeInTheDocument()
    })
  })
})
