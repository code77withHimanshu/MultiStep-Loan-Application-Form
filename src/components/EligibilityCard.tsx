import type { EligibilityResult } from '@/types'
import { formatCurrency } from '@/utils/formatters'

interface EligibilityCardProps {
  result: EligibilityResult
  loading?: boolean
}

const VERDICT_CONFIG = {
  approved: {
    label: 'Pre-Approved',
    bg: 'bg-green-50',
    border: 'border-green-300',
    text: 'text-green-800',
    badge: 'bg-green-600 text-white',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  conditional: {
    label: 'Conditional Approval',
    bg: 'bg-amber-50',
    border: 'border-amber-300',
    text: 'text-amber-800',
    badge: 'bg-amber-500 text-white',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
  rejected: {
    label: 'Not Eligible',
    bg: 'bg-red-50',
    border: 'border-red-300',
    text: 'text-red-800',
    badge: 'bg-red-600 text-white',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="15" y1="9" x2="9" y2="15" />
        <line x1="9" y1="9" x2="15" y2="15" />
      </svg>
    ),
  },
}

function CreditScoreBar({ score }: { score: number }) {
  const percent = ((score - 300) / 600) * 100
  const color =
    score >= 750 ? '#16a34a' : score >= 650 ? '#d97706' : '#dc2626'
  return (
    <div>
      <div className="flex justify-between text-xs text-slate-500 mb-1">
        <span>300</span>
        <span className="font-bold" style={{ color }}>{score}</span>
        <span>900</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${percent}%`, background: color }}
        />
      </div>
    </div>
  )
}

export default function EligibilityCard({ result, loading = false }: EligibilityCardProps) {
  if (loading) {
    return (
      <div className="col-span-2 border border-slate-200 rounded-xl p-5 flex items-center gap-3 text-sm text-slate-500" data-testid="eligibility-loading">
        <svg className="w-5 h-5 animate-spin-slow text-blue-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
        Calculating eligibility…
      </div>
    )
  }

  const cfg = VERDICT_CONFIG[result.verdict]

  return (
    <div
      className={`col-span-2 border rounded-xl p-5 ${cfg.bg} ${cfg.border}`}
      data-testid="eligibility-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center gap-2 ${cfg.text}`}>
          {cfg.icon}
          <span className="font-bold text-base">Eligibility Assessment</span>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${cfg.badge}`} data-testid="eligibility-verdict">
          {cfg.label}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <div className="text-xs text-slate-500 mb-1">Max Loan Amount</div>
          <div className={`text-sm font-bold ${cfg.text}`} data-testid="max-loan-amount">
            {formatCurrency(result.maxLoanAmount)}
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">Interest Rate</div>
          <div className={`text-sm font-bold ${cfg.text}`}>
            {result.suggestedInterestRate}% p.a.
          </div>
        </div>
        <div>
          <div className="text-xs text-slate-500 mb-1">EMI-to-Income</div>
          <div className={`text-sm font-bold ${cfg.text}`}>
            {Math.round(result.emiToIncomeRatio * 100)}%
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="text-xs text-slate-500 mb-2">Simulated Credit Score</div>
        <CreditScoreBar score={result.creditScore} />
      </div>

      <ul className="space-y-1">
        {result.reasons.map((reason, i) => (
          <li key={i} className={`flex items-center gap-2 text-xs ${cfg.text}`}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  )
}
