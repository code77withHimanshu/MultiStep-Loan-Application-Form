import { useFormStore } from '@/store/formStore'

const STEPS = [
  { label: 'Personal' },
  { label: 'Address' },
  { label: 'Employment' },
  { label: 'Loan Details' },
  { label: 'Documents' },
  { label: 'Signature' },
  { label: 'Review' },
]

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function StepIndicator() {
  const currentStep = useFormStore((s) => s.currentStep)
  const total = STEPS.length
  const progressPercent = (currentStep / (total - 1)) * 100

  return (
    <div>
      <div className="px-8 pt-7 pb-6 bg-slate-50 border-b border-slate-200">
        <div className="step-indicator-track relative flex items-start justify-between">
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStep
            const isActive = index === currentStep
            return (
              <div key={index} className="flex flex-col items-center gap-2 z-10 flex-1" aria-current={isActive ? 'step' : undefined}>
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-150 relative z-10 ${
                    isCompleted
                      ? 'bg-green-600 border-green-600 text-white'
                      : isActive
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'bg-white border-slate-200 text-slate-400'
                  }`}
                  style={isActive ? { boxShadow: '0 0 0 4px #dbeafe' } : undefined}
                >
                  {isCompleted ? <CheckIcon /> : index + 1}
                </div>
                <span
                  className={`text-[11px] font-medium text-center leading-tight max-w-[72px] hidden sm:block ${
                    isActive ? 'text-blue-700 font-semibold' : isCompleted ? 'text-green-600' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-8 pb-4 bg-slate-50 border-b border-slate-200">
        <div className="flex justify-between items-center mb-2 text-xs text-slate-500">
          <span>
            Step <strong className="text-blue-700">{currentStep + 1}</strong> of {total}
          </span>
          <span>
            <strong className="text-blue-700">{Math.round(progressPercent)}%</strong> complete
          </span>
        </div>
        <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #1d4ed8, #3b82f6)' }}
            role="progressbar"
            aria-valuenow={Math.round(progressPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>
    </div>
  )
}
