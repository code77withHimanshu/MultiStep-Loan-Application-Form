import { useFormStore } from '@/store/formStore'
import { STEP_TITLES } from '@/utils/constants'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function StepIndicator() {
  const { currentStep, isStep6Active } = useFormStore()

  const steps = STEP_TITLES.map((label, index) => ({
    label,
    isVisible: index !== 5 || isStep6Active(),
  }))

  const visibleSteps = steps.filter((s) => s.isVisible)
  const total = visibleSteps.length
  const visibleIndex = isStep6Active() ? currentStep : currentStep > 5 ? currentStep - 1 : currentStep
  const progressPercent = total > 1 ? (visibleIndex / (total - 1)) * 100 : 0

  return (
    <div>
      <div className="px-6 pt-6 pb-5 bg-slate-50 border-b border-slate-200">
        <div className="relative flex items-start justify-between" role="list" aria-label="Application progress">
          {visibleSteps.map((step, index) => {
            const isCompleted = index < visibleIndex
            const isActive = index === visibleIndex
            const displayNum = index + 1

            return (
              <div
                key={step.label}
                className="flex flex-col items-center gap-2 z-10 flex-1"
                role="listitem"
                aria-current={isActive ? 'step' : undefined}
                aria-label={`Step ${displayNum} of ${total}: ${step.label}${isCompleted ? ' (completed)' : isActive ? ' (current)' : ''}`}
              >
                <div
                  className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2
                    transition-all duration-150 relative z-10
                    ${isCompleted
                      ? 'bg-accent border-accent text-white'
                      : isActive
                      ? 'bg-primary border-primary text-white'
                      : 'bg-white border-slate-200 text-slate-400'
                    }
                  `}
                  style={isActive ? { boxShadow: '0 0 0 4px rgba(31,78,121,0.15)' } : undefined}
                >
                  {isCompleted ? <CheckIcon /> : displayNum}
                </div>
                <span
                  className={`text-[10px] font-medium text-center leading-tight max-w-[64px] hidden sm:block ${
                    isActive ? 'text-primary font-semibold' : isCompleted ? 'text-accent' : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-6 pb-4 bg-slate-50 border-b border-slate-200">
        <div className="flex justify-between items-center mb-2 text-xs text-slate-500">
          <span>
            Step <strong className="text-primary">{visibleIndex + 1}</strong> of {total}
          </span>
          <span>
            <strong className="text-primary">{Math.round(progressPercent)}%</strong> complete
          </span>
        </div>
        <div
          className="h-1.5 bg-slate-200 rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Application completion progress"
        >
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, #1F4E79, #27AE60)' }}
          />
        </div>
      </div>
    </div>
  )
}
