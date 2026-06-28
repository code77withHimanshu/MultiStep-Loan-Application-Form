import { useState } from 'react'
import { useFormStore } from '@/store/formStore'
import SignatureCapture from '@/components/SignatureCapture'

export default function SignatureStep() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore()
  const [signature, setSignature] = useState<string | null>(
    formData.documentsAndSignature?.eSignature ?? null,
  )
  const [error, setError] = useState('')

  const handleContinue = () => {
    if (!signature) {
      setError('Please provide your signature to continue')
      return
    }
    setError('')
    updateFormData('documentsAndSignature', { eSignature: signature })
    nextStep()
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-800">Digital Signature</h2>

      <p className="text-sm text-gray-600">
        Please sign in the box below using your mouse or finger. Your signature confirms that all
        provided information is accurate.
      </p>

      <SignatureCapture
        value={signature}
        onChange={(val) => {
          setSignature(val)
          if (val) setError('')
        }}
        error={error}
      />

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
        <strong>Legal Notice:</strong> By signing above, you consent to electronic verification of your
        identity and authorise LendSwift to process your loan application. Your electronic signature
        carries the same legal weight as a handwritten signature.
      </div>

      <div className="flex gap-3 mt-4">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="button"
          data-testid="signature-continue-btn"
          onClick={handleContinue}
          className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
