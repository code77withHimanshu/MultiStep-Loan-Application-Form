import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import PersonalInfo from '@/components/steps/PersonalInfo'
import { useFormStore, initialFormData } from '@/store/formStore'

function resetStore() {
  useFormStore.setState({ currentStep: 0, formData: initialFormData, submitted: false, submissionResult: null, eligibility: null, savedAt: null, hasSavedData: false })
}

describe('PersonalInfo component', () => {
  beforeEach(resetStore)

  it('renders all required fields', () => {
    render(<PersonalInfo />)
    expect(screen.getByText('Personal Information')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your first name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter your last name')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('9876543210')).toBeInTheDocument()
    expect(screen.getByText('Gender')).toBeInTheDocument()
    expect(screen.getByText('Marital Status')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('ABCDE1234F')).toBeInTheDocument()
  })

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup()
    render(<PersonalInfo />)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('clears error when field is corrected', async () => {
    const user = userEvent.setup()
    render(<PersonalInfo />)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => screen.getAllByRole('alert'))
    await user.type(screen.getByPlaceholderText('Enter your first name'), 'Rahul')
    await waitFor(() => {
      const firstNameError = screen.queryByText(/first name is required/i)
      expect(firstNameError).not.toBeInTheDocument()
    })
  })

  it('auto-uppercases PAN input', async () => {
    const user = userEvent.setup()
    render(<PersonalInfo />)
    const panInput = screen.getByPlaceholderText('ABCDE1234F')
    await user.type(panInput, 'abcde1234f')
    expect(panInput).toHaveValue('ABCDE1234F')
  })

  it('advances to next step with valid data', async () => {
    const user = userEvent.setup()
    render(<PersonalInfo />)

    await user.type(screen.getByPlaceholderText('Enter your first name'), 'Rahul')
    await user.type(screen.getByPlaceholderText('Enter your last name'), 'Sharma')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'rahul@example.com')
    await user.type(screen.getByPlaceholderText('9876543210'), '9876543210')

    const dobInput = document.querySelector('[name="dateOfBirth"]') as HTMLInputElement
    await user.type(dobInput, '1990-05-15')

    const genderSelect = document.querySelector('[name="gender"]') as HTMLSelectElement
    await user.selectOptions(genderSelect, 'male')

    const maritalSelect = document.querySelector('[name="maritalStatus"]') as HTMLSelectElement
    await user.selectOptions(maritalSelect, 'single')

    await user.type(screen.getByPlaceholderText('ABCDE1234F'), 'ABCDE1234F')

    await user.click(screen.getByRole('button', { name: /continue/i }))

    await waitFor(() => {
      expect(useFormStore.getState().currentStep).toBe(1)
    })
  })

  it('Back button is disabled on step 0', () => {
    render(<PersonalInfo />)
    expect(screen.getByRole('button', { name: /back/i })).toBeDisabled()
  })

  it('shows required marker for required fields', () => {
    render(<PersonalInfo />)
    const stars = document.querySelectorAll('.text-red-600')
    expect(stars.length).toBeGreaterThan(0)
  })
})
