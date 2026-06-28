import { useState } from 'react'
import { useFormStore } from '@/store/formStore'
import { MAX_FILE_SIZE_MB } from '@/utils/constants'
import type { DocumentFile } from '@/types'

interface DocKey {
  key: 'idProof' | 'addressProof' | 'incomeProof' | 'photo'
  label: string
  required?: boolean
}

const DOC_KEYS: DocKey[] = [
  { key: 'idProof', label: 'Identity Proof', required: true },
  { key: 'addressProof', label: 'Address Proof', required: true },
  { key: 'incomeProof', label: 'Income Proof', required: true },
  { key: 'photo', label: 'Passport Photo', required: true },
]

const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf']
const MAX_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

interface UploadAreaProps {
  docKey: DocKey['key']
  label: string
  required?: boolean
  file: DocumentFile | null | undefined
  error: string
  onFile: (key: DocKey['key'], file: DocumentFile | null) => void
  onError: (key: DocKey['key'], msg: string) => void
}

function UploadArea({ docKey, label, required, file, error, onFile, onError }: UploadAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    if (!ACCEPTED_TYPES.includes(selected.type)) {
      onError(docKey, 'Only JPG, PNG, and PDF files are accepted')
      onFile(docKey, null)
      return
    }
    if (selected.size > MAX_BYTES) {
      onError(docKey, `File must be under ${MAX_FILE_SIZE_MB} MB`)
      onFile(docKey, null)
      return
    }
    onError(docKey, '')
    onFile(docKey, { file: selected, originalSize: selected.size })
  }

  if (file) {
    return (
      <div
        data-testid={`file-uploaded-${docKey}`}
        className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
      >
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-800">{file.file.name}</span>
        </div>
        <button
          type="button"
          data-testid={`remove-file-${docKey}`}
          onClick={() => onFile(docKey, null)}
          className="text-xs text-red-500 hover:text-red-700 font-medium"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div
      data-testid={`upload-area-${docKey}`}
      className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors"
    >
      <input
        type="file"
        id={`file-${docKey}`}
        data-testid={`file-input-${docKey}`}
        accept=".jpg,.jpeg,.png,.pdf"
        onChange={handleChange}
        className="sr-only"
      />
      <label htmlFor={`file-${docKey}`} className="cursor-pointer">
        <div className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-600" aria-hidden="true">*</span>}
        </div>
        <div className="text-xs text-gray-500 mt-1">JPG, PNG, PDF up to {MAX_FILE_SIZE_MB}MB</div>
        <div className="mt-2 text-xs text-primary font-medium underline">Click to upload</div>
      </label>
      {error && <p role="alert" className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}

export default function DocumentUpload() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore()
  const saved = formData.documentsAndSignature

  const [files, setFiles] = useState<Record<DocKey['key'], DocumentFile | null>>({
    idProof: (saved?.idProof as DocumentFile | null) ?? null,
    addressProof: (saved?.addressProof as DocumentFile | null) ?? null,
    incomeProof: (saved?.incomeProof as DocumentFile | null) ?? null,
    photo: (saved?.photo as DocumentFile | null) ?? null,
  })
  const [errors, setErrors] = useState<Record<DocKey['key'], string>>({
    idProof: '',
    addressProof: '',
    incomeProof: '',
    photo: '',
  })
  const [submitError, setSubmitError] = useState('')

  const handleFile = (key: DocKey['key'], file: DocumentFile | null) => {
    setFiles((prev) => ({ ...prev, [key]: file }))
  }

  const handleError = (key: DocKey['key'], msg: string) => {
    setErrors((prev) => ({ ...prev, [key]: msg }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const missing = DOC_KEYS.filter((d) => d.required && !files[d.key])
    if (missing.length > 0) {
      setSubmitError('Please upload all required documents')
      return
    }
    setSubmitError('')
    updateFormData('documentsAndSignature', {
      idProof: files.idProof,
      addressProof: files.addressProof,
      incomeProof: files.incomeProof,
      photo: files.photo,
    })
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Upload Documents</h2>

      <div className="space-y-4">
        {DOC_KEYS.map((doc) => (
          <UploadArea
            key={doc.key}
            docKey={doc.key}
            label={doc.label}
            required={doc.required}
            file={files[doc.key]}
            error={errors[doc.key]}
            onFile={handleFile}
            onError={handleError}
          />
        ))}
      </div>

      {submitError && (
        <p role="alert" className="mt-3 text-xs text-red-600">{submitError}</p>
      )}

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>Your documents are <strong>encrypted</strong> and stored securely. We never share them with third parties.</span>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  )
}
