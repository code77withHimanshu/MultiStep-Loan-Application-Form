import { useForm } from '../context/FormContext.jsx'

export default function SuccessScreen() {
  const { formData } = useForm()
  const refNumber = `LN${Date.now().toString().slice(-8).toUpperCase()}`
  const name = `${formData.personalInfo.firstName} ${formData.personalInfo.lastName}`

  return (
    <div className="success-screen">
      <div className="success-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <h2>Application Submitted!</h2>
      <p>
        Thank you, <strong>{name}</strong>. Your loan application has been received and is under review.
        Our team will contact you within 2–3 business days.
      </p>

      <div className="reference-number">{refNumber}</div>

      <div className="success-steps">
        <div className="success-step-item">
          <div className="success-step-number">1</div>
          <p>Application under review by our credit team</p>
        </div>
        <div className="success-step-item">
          <div className="success-step-number">2</div>
          <p>Document verification &amp; background check</p>
        </div>
        <div className="success-step-item">
          <div className="success-step-number">3</div>
          <p>Loan approval &amp; disbursement within 5–7 days</p>
        </div>
      </div>

      <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
        A confirmation email has been sent to <strong>{formData.personalInfo.email}</strong>
      </p>
    </div>
  )
}
