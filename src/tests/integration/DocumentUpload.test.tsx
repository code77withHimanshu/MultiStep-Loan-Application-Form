import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach } from 'vitest'
import DocumentUpload from '@/components/steps/DocumentUpload'
import { useFormStore, initialFormData } from '@/store/formStore'
import { MAX_FILE_SIZE_MB } from '@/utils/constants'

function resetStore() {
  useFormStore.setState({ currentStep: 4, formData: initialFormData, submitted: false, submissionResult: null, eligibility: null, savedAt: null, hasSavedData: false })
}

function createFile(name: string, type: string, sizeBytes: number): File {
  const content = new Uint8Array(sizeBytes).fill(0)
  return new File([content], name, { type })
}

describe('DocumentUpload component', () => {
  beforeEach(resetStore)

  it('renders all 4 upload areas', () => {
    render(<DocumentUpload />)
    expect(screen.getByTestId('upload-area-idProof')).toBeInTheDocument()
    expect(screen.getByTestId('upload-area-addressProof')).toBeInTheDocument()
    expect(screen.getByTestId('upload-area-incomeProof')).toBeInTheDocument()
    expect(screen.getByTestId('upload-area-photo')).toBeInTheDocument()
  })

  it('shows uploaded file name after selection', async () => {
    const user = userEvent.setup()
    render(<DocumentUpload />)
    const file = createFile('aadhaar.pdf', 'application/pdf', 100 * 1024)
    const input = screen.getByTestId('file-input-idProof')
    await user.upload(input, file)
    await waitFor(() => {
      expect(screen.getByTestId('file-uploaded-idProof')).toBeInTheDocument()
      expect(screen.getByText('aadhaar.pdf')).toBeInTheDocument()
    })
  })

  it('removes file when Remove is clicked', async () => {
    const user = userEvent.setup()
    render(<DocumentUpload />)
    const file = createFile('test.jpg', 'image/jpeg', 50 * 1024)
    const input = screen.getByTestId('file-input-idProof')
    await user.upload(input, file)
    await waitFor(() => screen.getByTestId('remove-file-idProof'))
    await user.click(screen.getByTestId('remove-file-idProof'))
    await waitFor(() => {
      expect(screen.queryByTestId('file-uploaded-idProof')).not.toBeInTheDocument()
      expect(screen.getByTestId('upload-area-idProof')).toBeInTheDocument()
    })
  })

  it('rejects file over size limit', async () => {
    const user = userEvent.setup()
    render(<DocumentUpload />)
    const oversized = createFile('big.pdf', 'application/pdf', (MAX_FILE_SIZE_MB + 1) * 1024 * 1024)
    const input = screen.getByTestId('file-input-idProof')
    await user.upload(input, oversized)
    await waitFor(() => {
      expect(screen.getByText(new RegExp(`${MAX_FILE_SIZE_MB} MB`))).toBeInTheDocument()
    })
  })

  it('rejects invalid file type', async () => {
    const user = userEvent.setup()
    render(<DocumentUpload />)
    const textFile = createFile('doc.txt', 'text/plain', 1024)
    const input = screen.getByTestId('file-input-idProof')
    await user.upload(input, textFile)
    await waitFor(() => {
      expect(screen.getByText(/JPG, PNG, and PDF/i)).toBeInTheDocument()
    })
  })

  it('advances step when all documents uploaded', async () => {
    const user = userEvent.setup()
    render(<DocumentUpload />)
    const file = createFile('doc.pdf', 'application/pdf', 50 * 1024)

    for (const key of ['idProof', 'addressProof', 'incomeProof', 'photo']) {
      const input = screen.getByTestId(`file-input-${key}`)
      await user.upload(input, createFile(`${key}.pdf`, 'application/pdf', 50 * 1024))
      await waitFor(() => screen.getByTestId(`file-uploaded-${key}`))
    }

    await user.click(screen.getByRole('button', { name: /continue/i }))
    await waitFor(() => {
      expect(useFormStore.getState().currentStep).toBe(5)
    })

    void file
  })

  it('shows security notice', () => {
    render(<DocumentUpload />)
    expect(screen.getByText(/encrypted/i)).toBeInTheDocument()
  })
})
