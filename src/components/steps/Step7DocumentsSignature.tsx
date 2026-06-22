import { useRef, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDropzone } from 'react-dropzone'
import SignatureCanvas from 'react-signature-canvas'
import type SignatureCanvasType from 'react-signature-canvas'
import { useFormStore } from '@/store/formStore'
import { step7Schema, type Step7Data } from '@/schemas/step7Schema'
import { useImageCompression } from '@/hooks/useImageCompression'
import { Input } from '@/components/common/Input'
import { formatFileSize } from '@/utils/formatters'
import { MAX_FILE_SIZE_MB } from '@/utils/constants'
import type { LoanType, EmploymentType, DocumentFile } from '@/types'

interface DocumentZoneProps {
  label: string
  required?: boolean
  file: DocumentFile | null | undefined
  onUpload: (file: File, result: { originalSize: number; compressedSize?: number }) => void
  onRemove: () => void
  accept?: Record<string, string[]>
}

function DocumentZone({ label, required, file, onUpload, onRemove, accept }: DocumentZoneProps) {
  const { compress, isCompressing } = useImageCompression()
  const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: accept ?? {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: maxBytes,
    multiple: false,
    onDropAccepted: async ([accepted]) => {
      const result = await compress(accepted)
      onUpload(result.compressed, { originalSize: result.originalSize, compressedSize: result.compressedSize })
    },
  })

  if (file) {
    return (
      <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm font-medium text-gray-800">{file.file.name}</p>
            <p className="text-xs text-gray-500">
              {file.compressedSize
                ? `${formatFileSize(file.originalSize)} → ${formatFileSize(file.compressedSize)} (compressed)`
                : formatFileSize(file.originalSize)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 text-xs font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded"
        >
          Remove
        </button>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </p>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300 hover:border-primary hover:bg-gray-50'}
          ${isCompressing ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        <input {...getInputProps()} />
        {isCompressing ? (
          <p className="text-sm text-blue-600">Compressing image...</p>
        ) : (
          <p className="text-sm text-gray-500">
            {isDragActive ? 'Drop file here' : 'Drag & drop or click to upload'}
            <span className="block text-xs mt-1 text-gray-400">
              Max {MAX_FILE_SIZE_MB}MB · JPG, PNG, or PDF
            </span>
          </p>
        )}
      </div>
      {fileRejections.length > 0 && (
        <p className="text-xs text-red-600 mt-1">
          {fileRejections[0].errors[0]?.message ?? 'File rejected'}
        </p>
      )}
    </div>
  )
}

interface Step7Props {
  onNext: (data: Step7Data & { documents: Record<string, DocumentFile | null> }) => void
  onPrev: () => void
}

export function Step7DocumentsSignature({ onNext, onPrev }: Step7Props) {
  const { formData } = useFormStore()
  const loanType = formData.loanBasicInfo?.loanType as LoanType | undefined
  const employmentType = (formData.employmentInfo as { employmentType?: EmploymentType })?.employmentType
  const saved = formData.documentsAndSignature

  const sigCanvasRef = useRef<SignatureCanvasType>(null)
  const [sigError, setSigError] = useState<string | null>(null)

  const [docs, setDocs] = useState<Record<string, DocumentFile | null>>({
    panCardCopy: (saved?.panCardCopy as DocumentFile) ?? null,
    aadhaarFront: (saved?.aadhaarFront as DocumentFile) ?? null,
    aadhaarBack: (saved?.aadhaarBack as DocumentFile) ?? null,
    photograph: (saved?.photograph as DocumentFile) ?? null,
    bankStatements: (saved?.bankStatements as DocumentFile) ?? null,
    salarySlips: (saved?.salarySlips as unknown as DocumentFile) ?? null,
    itrDocuments: (saved?.itrDocuments as unknown as DocumentFile) ?? null,
    propertyDocuments: (saved?.propertyDocuments as DocumentFile) ?? null,
    businessRegistration: (saved?.businessRegistration as DocumentFile) ?? null,
    gstReturns: (saved?.gstReturns as unknown as DocumentFile) ?? null,
  })

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Step7Data>({
    resolver: zodResolver(step7Schema),
    defaultValues: {
      eSignature: saved?.eSignature ?? '',
    },
  })

  const setDoc = useCallback(
    (key: string, file: File | null, meta?: { originalSize: number; compressedSize?: number }) => {
      setDocs((prev) => ({
        ...prev,
        [key]: file
          ? { file, originalSize: meta?.originalSize ?? file.size, compressedSize: meta?.compressedSize }
          : null,
      }))
    },
    [],
  )

  const clearSignature = () => {
    sigCanvasRef.current?.clear()
    setValue('eSignature', '')
    setSigError(null)
  }

  const onSubmit = (data: Step7Data) => {
    const sigCanvas = sigCanvasRef.current
    if (!sigCanvas || sigCanvas.isEmpty()) {
      setSigError('Please draw your signature')
      return
    }
    const sigDataUrl = sigCanvas.toDataURL('image/png')
    setValue('eSignature', sigDataUrl)
    onNext({ ...data, eSignature: sigDataUrl, documents: docs })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Required Documents
          </h3>
          <div className="space-y-4">
            <DocumentZone
              label="PAN Card Copy"
              required
              file={docs.panCardCopy}
              onUpload={(f, m) => setDoc('panCardCopy', f, m)}
              onRemove={() => setDoc('panCardCopy', null)}
            />
            <DocumentZone
              label="Aadhaar Card (Front)"
              required
              file={docs.aadhaarFront}
              onUpload={(f, m) => setDoc('aadhaarFront', f, m)}
              onRemove={() => setDoc('aadhaarFront', null)}
            />
            <DocumentZone
              label="Aadhaar Card (Back)"
              required
              file={docs.aadhaarBack}
              onUpload={(f, m) => setDoc('aadhaarBack', f, m)}
              onRemove={() => setDoc('aadhaarBack', null)}
            />
            <DocumentZone
              label="Recent Photograph"
              required
              file={docs.photograph}
              onUpload={(f, m) => setDoc('photograph', f, m)}
              onRemove={() => setDoc('photograph', null)}
              accept={{ 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] }}
            />
            <DocumentZone
              label="Bank Statement (last 6 months)"
              required
              file={docs.bankStatements}
              onUpload={(f, m) => setDoc('bankStatements', f, m)}
              onRemove={() => setDoc('bankStatements', null)}
            />

            {employmentType === 'salaried' && (
              <DocumentZone
                label="Salary Slips (last 3 months)"
                required
                file={docs.salarySlips}
                onUpload={(f, m) => setDoc('salarySlips', f, m)}
                onRemove={() => setDoc('salarySlips', null)}
              />
            )}

            {(employmentType === 'self_employed' || employmentType === 'business_owner') && (
              <DocumentZone
                label="ITR Documents (last 2 years)"
                required
                file={docs.itrDocuments}
                onUpload={(f, m) => setDoc('itrDocuments', f, m)}
                onRemove={() => setDoc('itrDocuments', null)}
              />
            )}

            {loanType === 'home' && (
              <DocumentZone
                label="Property Documents"
                required
                file={docs.propertyDocuments}
                onUpload={(f, m) => setDoc('propertyDocuments', f, m)}
                onRemove={() => setDoc('propertyDocuments', null)}
              />
            )}

            {employmentType === 'business_owner' && (
              <DocumentZone
                label="Business Registration Certificate"
                required
                file={docs.businessRegistration}
                onUpload={(f, m) => setDoc('businessRegistration', f, m)}
                onRemove={() => setDoc('businessRegistration', null)}
              />
            )}
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
            Electronic Signature <span className="text-red-500" aria-hidden="true">*</span>
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Draw your signature in the box below. This will be used as your electronic signature on this application.
          </p>
          <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
            <SignatureCanvas
              ref={sigCanvasRef}
              canvasProps={{
                className: 'w-full',
                style: { width: '100%', height: '160px', touchAction: 'none' },
                'data-testid': 'signature-canvas',
              }}
              penColor="#1F4E79"
            />
          </div>
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-400">Use your finger or mouse to sign</p>
            <button
              type="button"
              onClick={clearSignature}
              data-testid="clear-signature-btn"
              className="text-xs text-gray-500 hover:text-red-600 underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded"
            >
              Clear Signature
            </button>
          </div>
          {(sigError || errors.eSignature) && (
            <Input.Error>{sigError ?? errors.eSignature?.message}</Input.Error>
          )}
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
          >
            Review Application
          </button>
        </div>
      </div>
    </form>
  )
}
