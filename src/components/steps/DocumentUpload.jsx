import { useState } from 'react'
import { useForm } from '../../context/FormContext.jsx'
import { validateDocuments } from '../../utils/validators.js'
import FormField from '../FormField.jsx'

const DOCUMENT_CONFIG = [
  {
    key: 'idProof',
    label: 'Identity Proof',
    required: true,
    examples: 'Aadhaar Card, PAN Card, Passport, Voter ID',
  },
  {
    key: 'addressProof',
    label: 'Address Proof',
    required: true,
    examples: 'Aadhaar Card, Passport, Utility Bill, Bank Statement',
  },
  {
    key: 'incomeProof',
    label: 'Income Proof',
    required: true,
    examples: 'Last 3 months salary slips, Form 16, ITR, Bank Statement',
  },
  {
    key: 'photo',
    label: 'Passport-Size Photo',
    required: true,
    examples: 'Recent photograph with white background (JPG/PNG only)',
  },
]

const MAX_FILE_SIZE_MB = 5
const ACCEPTED_TYPES = 'image/jpeg,image/png,application/pdf'

function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function UploadIcon({ hasFile }) {
  if (hasFile) {
    return (
      <svg className="file-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    )
  }
  return (
    <svg className="file-upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 16 12 12 8 16" />
      <line x1="12" y1="12" x2="12" y2="21" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

export default function DocumentUpload() {
  const { formData, updateFormData, nextStep, prevStep } = useForm()
  const [files, setFiles] = useState(formData.documents)
  const [errors, setErrors] = useState({})
  const [sizeErrors, setSizeErrors] = useState({})

  const handleFileChange = (key, e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setSizeErrors(prev => ({ ...prev, [key]: `File size must not exceed ${MAX_FILE_SIZE_MB} MB` }))
      e.target.value = ''
      return
    }

    setSizeErrors(prev => ({ ...prev, [key]: '' }))
    setFiles(prev => ({ ...prev, [key]: file }))
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const handleRemove = (key) => {
    setFiles(prev => ({ ...prev, [key]: null }))
  }

  const handleNext = () => {
    const validationErrors = validateDocuments(files)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    updateFormData('documents', files)
    nextStep()
  }

  const handleBack = () => {
    updateFormData('documents', files)
    prevStep()
  }

  return (
    <>
      <div className="step-content">
        <div className="step-heading">
          <h2>Document Upload</h2>
          <p>Please upload clear, legible copies of the required documents. Accepted formats: JPG, PNG, PDF (max {MAX_FILE_SIZE_MB} MB each).</p>
        </div>

        <div className="form-grid">
          {DOCUMENT_CONFIG.map(doc => (
            <FormField
              key={doc.key}
              label={doc.label}
              required={doc.required}
              error={errors[doc.key] || sizeErrors[doc.key]}
              hint={doc.examples}
            >
              {files[doc.key] ? (
                <div
                  className="file-upload-area has-file"
                  style={{ cursor: 'default' }}
                >
                  <UploadIcon hasFile />
                  <div className="file-upload-title" style={{ color: 'var(--success)' }}>
                    {files[doc.key].name}
                  </div>
                  <div className="file-upload-subtitle">
                    {formatFileSize(files[doc.key].size)}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(doc.key)}
                    style={{
                      marginTop: '8px',
                      padding: '4px 12px',
                      fontSize: '12px',
                      background: 'none',
                      border: '1px solid var(--success)',
                      borderRadius: 'var(--radius-sm)',
                      color: 'var(--success)',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className={`file-upload-area ${errors[doc.key] ? 'has-error' : ''}`}>
                  <input
                    type="file"
                    accept={ACCEPTED_TYPES}
                    onChange={(e) => handleFileChange(doc.key, e)}
                  />
                  <UploadIcon hasFile={false} />
                  <div className="file-upload-title">Click or drag file here</div>
                  <div className="file-upload-subtitle">JPG, PNG, PDF up to {MAX_FILE_SIZE_MB} MB</div>
                </div>
              )}
            </FormField>
          ))}

          <div
            className="col-span-2"
            style={{
              background: 'var(--primary-light)',
              border: '1px solid #bfdbfe',
              borderRadius: 'var(--radius-md)',
              padding: '14px 16px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
              marginTop: '4px',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}>
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p style={{ fontSize: '13px', color: 'var(--primary-dark)', lineHeight: '1.6' }}>
              All documents are encrypted and stored securely. They will only be used for loan verification purposes. We do not share your documents with third parties.
            </p>
          </div>
        </div>
      </div>

      <div className="step-nav">
        <button className="btn btn-secondary" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  )
}
