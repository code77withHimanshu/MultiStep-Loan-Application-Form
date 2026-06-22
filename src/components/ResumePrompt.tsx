import { useFormStore } from '@/store/formStore'
import { formatDate } from '@/utils/formatters'

export default function ResumePrompt() {
  const { savedAt, acknowledgeResume, resetForm } = useFormStore()

  return (
    <div
      className="flex items-center justify-between gap-4 px-8 py-3 bg-amber-50 border-b border-amber-200 text-sm"
      role="alert"
      data-testid="resume-prompt"
    >
      <div className="flex items-center gap-2 text-amber-800">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <span>
          <strong>Saved application found</strong>
          {savedAt && ` — last saved ${formatDate(savedAt, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          onClick={acknowledgeResume}
          className="px-3 py-1 text-xs font-semibold text-amber-800 bg-amber-100 border border-amber-300 rounded-md hover:bg-amber-200 transition-colors"
          data-testid="resume-continue"
        >
          Continue
        </button>
        <button
          onClick={resetForm}
          className="px-3 py-1 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors"
          data-testid="resume-start-new"
        >
          Start new
        </button>
      </div>
    </div>
  )
}
