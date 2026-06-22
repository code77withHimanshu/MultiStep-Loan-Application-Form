import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import AddressInfo from '@/components/steps/AddressInfo'
import { useFormStore, initialFormData } from '@/store/formStore'

function resetStore() {
  useFormStore.setState({ currentStep: 1, formData: initialFormData, submitted: false, submissionResult: null, eligibility: null, savedAt: null, hasSavedData: false })
}

describe('AddressInfo component', () => {
  beforeEach(resetStore)

  it('renders current address fields', () => {
    render(<AddressInfo />)
    expect(screen.getByText('Address Information')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('House/Flat No., Building Name, Street')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('6-digit PIN code')).toBeInTheDocument()
  })

  it('shows permanent address section by default', () => {
    render(<AddressInfo />)
    const checkbox = screen.getByRole('checkbox')
    expect(checkbox).not.toBeChecked()
    expect(screen.getByText('Permanent Address')).toBeInTheDocument()
  })

  it('hides permanent address when sameAsPermanent is checked', async () => {
    const user = userEvent.setup()
    render(<AddressInfo />)
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    await waitFor(() => {
      expect(screen.queryByText('Permanent Address')).not.toBeInTheDocument()
    })
  })

  it('copies current address fields to permanent when checkbox is checked', async () => {
    const user = userEvent.setup()
    render(<AddressInfo />)
    const inputs = document.querySelectorAll('[name="currentAddressLine1"]')
    await user.type(inputs[0] as HTMLElement, '123 MG Road')
    const checkbox = screen.getByRole('checkbox')
    await user.click(checkbox)
    expect(checkbox).toBeChecked()
  })

  it('shows validation errors for empty required fields', async () => {
    const user = userEvent.setup()
    render(<AddressInfo />)
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getAllByRole('alert').length).toBeGreaterThan(0)
    })
  })

  it('validates PIN code format', async () => {
    const user = userEvent.setup()
    render(<AddressInfo />)
    const pinInputs = document.querySelectorAll('[name="currentZip"]')
    await user.type(pinInputs[0] as HTMLElement, '12345')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(screen.getByText(/6-digit PIN code/i)).toBeInTheDocument()
    })
  })

  it('navigates back when Back is clicked', async () => {
    const user = userEvent.setup()
    render(<AddressInfo />)
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(useFormStore.getState().currentStep).toBe(0)
  })
})
