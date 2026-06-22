import { useState } from 'react'
import { useFormStore } from '@/store/formStore'
import SignatureCapture from '@/components/SignatureCapture'

export default function SignatureStep() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore()
  const [dataUrl, setDataUrl] = useState<string | null>(formData.signature.dataUrl)
  const [error, setError] = useState('')

  const handleChange = (url: string | null) => {
    setDataUrl(url)
    if (url) setError('')
  }

  const handleNext = () => {
    if (!dataUrl) {
      setError('Please provide your signature before continuing.')
      return
    }
    updateFormData('signature', { dataUrl })
    nextStep()
  }

  const handleBack = () => {
    updateFormData('signature', { dataUrl })
    prevStep()
  }

  return (
    <>
      <div className="px-10 py-9">
        <div className="mb-7">
          <h2 className="text-xl font-bold text-slate-900 mb-1.5">Digital Signature</h2>
          <p className="text-sm text-slate-500">
            Please provide your signature in the box below. This will be used to authenticate your application.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 mb-5">
            <div className="flex items-start gap-3 mb-5 text-sm text-slate-600">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true">
                <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
              <span>Draw your signature using mouse or touchscreen. Your signature confirms that all information provided is accurate.</span>
            </div>

            <SignatureCapture value={dataUrl} onChange={handleChange} error={error} />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-xs text-amber-800 leading-relaxed">
            <strong>Legal Notice:</strong> By providing your digital signature you certify that all information in this application is accurate and you authorise LoanEase to verify the details provided. Electronic signatures are legally binding under the Information Technology Act, 2000.
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center px-10 py-6 border-t border-slate-200 bg-slate-50">
        <button className="btn-secondary" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </button>
        <button className="btn-primary" onClick={handleNext} data-testid="signature-continue-btn">
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </>
  )
}
