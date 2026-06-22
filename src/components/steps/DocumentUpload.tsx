import { useFormStore } from '@/store/formStore'
import { validateSchema, documentsSchema } from '@/schemas'
import { useDocumentUpload } from '@/hooks/useDocumentUpload'
import { formatFileSize } from '@/utils/formatters'
import { MAX_FILE_SIZE_MB, ACCEPTED_FILE_TYPES } from '@/utils/constants'
import FormField from '@/components/FormField'
import type { Documents } from '@/types'

type DocKey = keyof Documents

const DOC_CONFIG: { key: DocKey; label: string; examples: string }[] = [
  { key: 'idProof', label: 'Identity Proof', examples: 'Aadhaar Card, PAN Card, Passport, Voter ID' },
  { key: 'addressProof', label: 'Address Proof', examples: 'Aadhaar Card, Passport, Utility Bill, Bank Statement' },
  { key: 'incomeProof', label: 'Income Proof', examples: 'Last 3 months salary slips, Form 16, ITR, Bank Statement' },
  { key: 'photo', label: 'Passport-Size Photo', examples: 'Recent photograph with white background (JPG/PNG only)' },
]

function UploadIcon({ uploaded }: { uploaded: boolean }) {
  if (uploaded) {
    return (
      <svg className="w-9 h-9 mx-auto mb-2 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  }
  return (
    <svg className="w-9 h-9 mx-auto mb-2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

export default function DocumentUpload() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore()
  const { files, errors, sizeErrors, handleFileChange, handleRemove, clearErrors } = useDocumentUpload(formData.documents)

  const validateAndProceed = () => {
    const validationErrors = validateSchema(documentsSchema, files as unknown as Record<string, unknown>)
    if (Object.keys(validationErrors).length > 0) {
      DOC_CONFIG.forEach(({ key }) => {
        if (!files[key]) clearErrors(key)
      })
      return
    }
    updateFormData('documents', files)
    nextStep()
  }

  const handleDocValidation = () => {
    const missingKeys = DOC_CONFIG.filter(({ key }) => !files[key]).map(({ key }) => key)
    if (missingKeys.length > 0) {
      const errs: Partial<Record<DocKey, string>> = {}
      missingKeys.forEach((key) => { errs[key] = `${DOC_CONFIG.find((d) => d.key === key)?.label} is required` })
      Object.entries(errs).forEach(([key]) => clearErrors(key as DocKey))
      return
    }
    validateAndProceed()
  }

  const handleNext = () => {
    const allUploaded = DOC_CONFIG.every(({ key }) => files[key] !== null)
    if (!allUploaded) {
      handleDocValidation()
      return
    }
    updateFormData('documents', files)
    nextStep()
  }

  const handleBack = () => { updateFormData('documents', files); prevStep() }

  return (
    <>
      <div className="px-10 py-9">
        <div className="mb-7">
          <h2 className="text-xl font-bold text-slate-900 mb-1.5">Document Upload</h2>
          <p className="text-sm text-slate-500">Upload clear, legible copies. Accepted formats: JPG, PNG, PDF (max {MAX_FILE_SIZE_MB} MB each).</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          {DOC_CONFIG.map((doc) => (
            <FormField
              key={doc.key}
              label={doc.label}
              required
              error={errors[doc.key] || sizeErrors[doc.key]}
              hint={doc.examples}
            >
              {files[doc.key] ? (
                <div className="file-upload-area has-file" style={{ cursor: 'default' }} data-testid={`file-uploaded-${doc.key}`}>
                  <UploadIcon uploaded />
                  <div className="text-sm font-semibold text-green-700 mb-1 truncate">{files[doc.key]!.name}</div>
                  <div className="text-xs text-slate-500 mb-2">{formatFileSize(files[doc.key]!.size)}</div>
                  <button
                    type="button"
                    onClick={() => handleRemove(doc.key)}
                    className="text-xs font-medium text-green-600 border border-green-500 rounded px-3 py-1 hover:bg-green-50 transition-colors"
                    data-testid={`remove-file-${doc.key}`}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className={`file-upload-area ${errors[doc.key] ? 'has-error' : ''}`} data-testid={`upload-area-${doc.key}`}>
                  <input
                    type="file"
                    accept={ACCEPTED_FILE_TYPES}
                    onChange={(e) => handleFileChange(doc.key, e.target.files?.[0] ?? null)}
                    aria-label={`Upload ${doc.label}`}
                    data-testid={`file-input-${doc.key}`}
                  />
                  <UploadIcon uploaded={false} />
                  <div className="text-sm font-semibold text-slate-700 mb-1">Click or drag file here</div>
                  <div className="text-xs text-slate-400">JPG, PNG, PDF up to {MAX_FILE_SIZE_MB} MB</div>
                </div>
              )}
            </FormField>
          ))}

          <div className="col-span-2 flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg items-start">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-xs text-blue-800 leading-relaxed">
              All documents are encrypted and stored securely. They will only be used for loan verification purposes. We do not share your documents with third parties.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-10 py-6 border-t border-slate-200 bg-slate-50">
        <button className="btn-secondary" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </button>
        <button className="btn-primary" onClick={handleNext}>
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </>
  )
}
