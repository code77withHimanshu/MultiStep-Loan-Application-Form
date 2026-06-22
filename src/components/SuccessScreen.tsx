import { useFormStore } from '@/store/formStore'
import { generateReferenceNumber } from '@/utils/formatters'

const ref = generateReferenceNumber()

export default function SuccessScreen() {
  const { formData, submissionResult, resetForm } = useFormStore()
  const name = `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`.trim()
  const refNum = submissionResult?.referenceNumber ?? ref

  return (
    <div className="py-16 px-10 text-center" data-testid="success-screen">
      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <h2 className="text-2xl font-bold text-slate-900 mb-3">Application Submitted!</h2>
      <p className="text-[15px] text-slate-500 max-w-md mx-auto mb-8">
        Thank you{name ? `, ${name}` : ''}. Your loan application has been received and is under review.
        Our team will contact you within 2–3 business days.
      </p>

      <div
        className="inline-block bg-blue-100 text-blue-900 text-lg font-bold px-7 py-3 rounded-xl tracking-widest mb-8"
        data-testid="reference-number"
      >
        {refNum}
      </div>

      <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto mb-8 text-left">
        {[
          'Application under review by our credit team',
          'Document verification & background check',
          'Loan approval & disbursement within 5–7 days',
        ].map((text, i) => (
          <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5">
            <div className="w-7 h-7 bg-blue-700 text-white rounded-full text-[13px] font-bold flex items-center justify-center mb-2">
              {i + 1}
            </div>
            <p className="text-xs text-slate-500">{text}</p>
          </div>
        ))}
      </div>

      {formData.personalInfo.email && (
        <p className="text-xs text-slate-400 mb-6">
          A confirmation email has been sent to <strong>{formData.personalInfo.email}</strong>
        </p>
      )}

      <button
        onClick={resetForm}
        className="btn-primary"
        data-testid="apply-again-btn"
      >
        Apply for Another Loan
      </button>
    </div>
  )
}
