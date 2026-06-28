import { useRef, useEffect } from 'react'
import { useFormStore } from '@/store/formStore'
import { useAutoSave } from '@/hooks/useAutoSave'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import { clearSavedDraft } from '@/hooks/useAutoSave'
import StepIndicator from './StepIndicator'
import { Step1LoanType } from './steps/Step1LoanType'
import { Step2PersonalInfo } from './steps/Step2PersonalInfo'
import { Step3KYC } from './steps/Step3KYC'
import { Step4Address } from './steps/Step4Address'
import { Step5Employment } from './steps/Step5Employment'
import { Step6CoApplicant } from './steps/Step6CoApplicant'
import { Step7DocumentsSignature } from './steps/Step7DocumentsSignature'
import { Step8Review } from './steps/Step8Review'
import { Toast, useToast } from './common/Toast'
import { formatTime } from '@/utils/formatters'
import type { Step1Data } from '@/schemas/step1Schema'
import type { Step2Data } from '@/schemas/step2Schema'
import type { Step3Data } from '@/schemas/step3Schema'
import type { Step4Data } from '@/schemas/step4Schema'
import type { Step5Data } from '@/schemas/step5Schema'
import type { Step6Data } from '@/schemas/step6Schema'
import type { ApplicationFormData, LoanType, DocumentFile } from '@/types'

function ResumeModal({
  savedAt,
  loanType,
  onResume,
  onStartFresh,
}: {
  savedAt: number
  loanType: LoanType
  onResume: () => void
  onStartFresh: () => void
}) {
  const date = new Date(savedAt)
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resume-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4">
        <h2 id="resume-title" className="text-lg font-semibold text-gray-800 mb-2">
          Resume Your Application?
        </h2>
        <p className="text-sm text-gray-600 mb-1">
          You have a saved {loanType.charAt(0).toUpperCase() + loanType.slice(1)} Loan application from{' '}
          <strong>{date.toLocaleDateString('en-IN')}</strong> at{' '}
          <strong>{formatTime(date)}</strong>.
        </p>
        <p className="text-xs text-gray-400 mb-5">Saved drafts expire after 72 hours.</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onStartFresh}
            className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 transition-colors"
          >
            Start Fresh
          </button>
          <button
            type="button"
            onClick={onResume}
            className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
          >
            Resume Application
          </button>
        </div>
      </div>
    </div>
  )
}

function SuccessScreen() {
  const { submissionResult, resetForm } = useFormStore()
  if (!submissionResult) return null

  return (
    <div className="p-8 text-center">
      <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Application Submitted!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for applying with LendSwift. Your application is under review.
      </p>
      <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Reference Number</span>
          <span className="font-bold text-primary">{submissionResult.referenceNumber}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-500">Application ID</span>
          <span className="font-medium">{submissionResult.applicationId}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Status</span>
          <span className="text-accent font-medium capitalize">{submissionResult.status.replace('_', ' ')}</span>
        </div>
      </div>
      <button
        type="button"
        onClick={resetForm}
        className="px-6 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
      >
        Start New Application
      </button>
    </div>
  )
}

export default function MultiStepForm() {
  const {
    currentStep,
    submitted,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    isStep6Active,
    resetForm,
  } = useFormStore()

  const { toasts, showToast, dismissToast } = useToast()
  const { hasSavedDraft, resumeInfo, loadSavedDraft, dismissResume } = useFormPersistence()
  const firstInputRef = useRef<HTMLDivElement>(null)

  useAutoSave(formData, currentStep, {
    onSave: (time) => showToast(`Draft saved at ${formatTime(time)}`),
  })

  useEffect(() => {
    if (firstInputRef.current) {
      const first = firstInputRef.current.querySelector<HTMLElement>('input, select, textarea, button[type="submit"]')
      first?.focus()
    }
  }, [currentStep])

  const handleResume = async () => {
    const saved = await loadSavedDraft()
    if (saved && resumeInfo) {
      ;(Object.keys(saved) as Array<keyof ApplicationFormData>).forEach((section) => {
        updateFormData(section, saved[section] as never)
      })
      goToStep(resumeInfo.metadata.step)
    }
    dismissResume()
  }

  const handleStartFresh = () => {
    if (resumeInfo) clearSavedDraft(resumeInfo.loanType)
    dismissResume()
    resetForm()
  }

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
        <SuccessScreen />
      </div>
    )
  }

  const step6Active = isStep6Active()

  const stepProps = { onPrev: prevStep }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <Step1LoanType
            onNext={(data: Step1Data) => {
              updateFormData('loanBasicInfo', data)
              nextStep()
            }}
          />
        )
      case 1:
        return (
          <Step2PersonalInfo
            {...stepProps}
            onNext={(data: Step2Data) => {
              updateFormData('personalInfo', data)
              nextStep()
            }}
          />
        )
      case 2:
        return (
          <Step3KYC
            {...stepProps}
            onNext={(data: Step3Data) => {
              updateFormData('kycInfo', data)
              nextStep()
            }}
          />
        )
      case 3:
        return (
          <Step4Address
            {...stepProps}
            onNext={(data: Step4Data) => {
              updateFormData('addressInfo', data)
              nextStep()
            }}
          />
        )
      case 4:
        return (
          <Step5Employment
            {...stepProps}
            onNext={(data: Step5Data) => {
              updateFormData('employmentInfo', data as ApplicationFormData['employmentInfo'])
              nextStep()
            }}
          />
        )
      case 5:
        if (!step6Active) {
          nextStep()
          return null
        }
        return (
          <Step6CoApplicant
            {...stepProps}
            onNext={(data: Step6Data) => {
              updateFormData('coApplicantInfo', data)
              nextStep()
            }}
          />
        )
      case 6:
        return (
          <Step7DocumentsSignature
            onPrev={() => {
              if (!step6Active) {
                goToStep(4)
              } else {
                prevStep()
              }
            }}
            onNext={(data: { eSignature: string; documents: Record<string, DocumentFile | null> }) => {
              updateFormData('documentsAndSignature', {
                eSignature: data.eSignature,
                ...data.documents,
              } as ApplicationFormData['documentsAndSignature'])
              nextStep()
            }}
          />
        )
      case 7:
        return (
          <Step8Review
            onPrev={prevStep}
            onEditStep={goToStep}
          />
        )
      default:
        return null
    }
  }

  const STEP_LABELS = [
    'Loan Type & Amount',
    'Personal Information',
    'KYC Verification',
    'Address Details',
    'Employment & Income',
    ...(step6Active ? ['Co-Applicant Details'] : []),
    'Documents & Signature',
    'Review & Submit',
  ]

  const currentLabel = step6Active
    ? STEP_LABELS[currentStep]
    : currentStep < 5
    ? STEP_LABELS[currentStep]
    : currentStep === 6
    ? 'Documents & Signature'
    : 'Review & Submit'

  return (
    <>
      {hasSavedDraft && resumeInfo && (
        <ResumeModal
          savedAt={resumeInfo.metadata.timestamp}
          loanType={resumeInfo.loanType}
          onResume={handleResume}
          onStartFresh={handleStartFresh}
        />
      )}

      <div className="max-w-3xl mx-auto bg-white rounded-2xl overflow-hidden shadow-xl">
        <StepIndicator />
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-xl font-bold text-gray-800" aria-live="polite">
            {currentLabel}
          </h2>
        </div>
        <div ref={firstInputRef} className="px-6 py-5">
          {renderStep()}
        </div>
      </div>

      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </>
  )
}
