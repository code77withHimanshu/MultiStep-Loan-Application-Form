import { useForm } from '../context/FormContext.jsx'

const STEPS = [
  { label: 'Personal Info' },
  { label: 'Address' },
  { label: 'Employment' },
  { label: 'Loan Details' },
  { label: 'Documents' },
  { label: 'Review' },
]

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function StepIndicator() {
  const { currentStep } = useForm()
  const total = STEPS.length
  const progressPercent = (currentStep / (total - 1)) * 100

  return (
    <>
      <div className="step-indicator">
        <div className="step-indicator-track">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep
            const isActive = index === currentStep
            return (
              <div
                key={index}
                className={`step-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <div className={`step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
                  {isCompleted ? <CheckIcon /> : index + 1}
                </div>
                <span className="step-label">{step.label}</span>
              </div>
            )
          })}
        </div>
      </div>
      <div className="progress-bar-wrap">
        <div className="progress-text">
          <span>Step <strong>{currentStep + 1}</strong> of {total}</span>
          <span><strong>{Math.round(progressPercent)}%</strong> complete</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </>
  )
}
