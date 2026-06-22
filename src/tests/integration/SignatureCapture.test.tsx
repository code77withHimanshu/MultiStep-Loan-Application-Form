import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import SignatureCapture from '@/components/SignatureCapture'
import SignatureStep from '@/components/steps/SignatureStep'
import { useFormStore, initialFormData } from '@/store/formStore'

vi.mock('signature_pad', () => {
  return {
    default: class MockSignaturePad {
      private _empty = true
      private _data: unknown[] = []
      private _handlers: Map<string, () => void> = new Map()

      constructor(_canvas: HTMLCanvasElement) {}

      addEventListener(event: string, handler: () => void) {
        this._handlers.set(event, handler)
      }

      on() {}
      off() {}

      clear() {
        this._empty = true
        this._data = []
      }

      isEmpty() { return this._empty }

      toDataURL() { return 'data:image/png;base64,mockSignatureData' }

      fromDataURL(_url: string) { this._empty = false }

      toData() { return this._data }

      fromData(_data: unknown[]) { this._empty = false }

      simulateStroke() {
        this._empty = false
        const handler = this._handlers.get('endStroke')
        if (handler) handler()
      }
    },
  }
})

function resetStore() {
  useFormStore.setState({ currentStep: 5, formData: initialFormData, submitted: false, submissionResult: null, eligibility: null, savedAt: null, hasSavedData: false })
}

describe('SignatureCapture component', () => {
  it('renders signature canvas', () => {
    render(<SignatureCapture value={null} onChange={vi.fn()} />)
    expect(screen.getByTestId('signature-canvas')).toBeInTheDocument()
  })

  it('renders clear button', () => {
    render(<SignatureCapture value={null} onChange={vi.fn()} />)
    expect(screen.getByTestId('clear-signature-btn')).toBeInTheDocument()
  })

  it('shows captured label when value is provided', () => {
    render(<SignatureCapture value="data:image/png;base64,test" onChange={vi.fn()} />)
    expect(screen.getByTestId('signature-preview-label')).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    render(<SignatureCapture value={null} onChange={vi.fn()} error="Signature is required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Signature is required')
  })

  it('calls onChange with null when Clear is clicked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<SignatureCapture value="data:image/png;base64,test" onChange={onChange} />)
    await user.click(screen.getByTestId('clear-signature-btn'))
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('does not show captured label when value is null', () => {
    render(<SignatureCapture value={null} onChange={vi.fn()} />)
    expect(screen.queryByTestId('signature-preview-label')).not.toBeInTheDocument()
  })
})

describe('SignatureStep component', () => {
  beforeEach(resetStore)

  it('renders digital signature heading', () => {
    render(<SignatureStep />)
    expect(screen.getByText('Digital Signature')).toBeInTheDocument()
  })

  it('shows error when Continue is clicked without signature', async () => {
    const user = userEvent.setup()
    render(<SignatureStep />)
    await user.click(screen.getByTestId('signature-continue-btn'))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
  })

  it('shows legal notice', () => {
    render(<SignatureStep />)
    expect(screen.getByText(/Legal Notice/i)).toBeInTheDocument()
  })

  it('navigates back when Back is clicked', async () => {
    const user = userEvent.setup()
    render(<SignatureStep />)
    await user.click(screen.getByRole('button', { name: /back/i }))
    expect(useFormStore.getState().currentStep).toBe(4)
  })
})
