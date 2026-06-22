interface VerificationBadgeProps {
  isVerifying: boolean
  isVerified: boolean
  error: string | null
}

export function VerificationBadge({ isVerifying, isVerified, error }: VerificationBadgeProps) {
  if (isVerifying) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-blue-600">
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        Verifying...
      </span>
    )
  }

  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-green-600" role="status" aria-live="polite">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
        Verified
      </span>
    )
  }

  if (error) {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-red-600" role="alert" aria-live="polite">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {error}
      </span>
    )
  }

  return null
}
