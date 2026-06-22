import { useEffect } from 'react'
import { useSignature } from '@/hooks/useSignature'

interface SignatureCaptureProps {
  value: string | null
  onChange: (dataUrl: string | null) => void
  error?: string
}

export default function SignatureCapture({ value, onChange, error }: SignatureCaptureProps) {
  const { canvasRef, clear, loadDataUrl } = useSignature(onChange)

  useEffect(() => {
    if (value) loadDataUrl(value)
  }, [])

  return (
    <div className="flex flex-col gap-3" data-testid="signature-capture">
      <div
        className={`border-2 rounded-xl overflow-hidden bg-white ${
          error ? 'border-red-500' : 'border-slate-200 hover:border-blue-400'
        } transition-colors`}
        style={{ height: '200px' }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          style={{ display: 'block' }}
          aria-label="Signature pad — draw your signature here"
          data-testid="signature-canvas"
        />
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400">
          Draw your signature above using mouse or touch
        </p>
        <button
          type="button"
          onClick={clear}
          className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 rounded-lg hover:bg-slate-200 transition-colors"
          data-testid="clear-signature-btn"
        >
          Clear
        </button>
      </div>

      {value && (
        <div className="flex items-center gap-2 text-xs text-green-700 font-medium" data-testid="signature-preview-label">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          Signature captured
        </div>
      )}

      {error && (
        <p className="text-xs text-red-600 flex items-center gap-1" role="alert">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round" />
          </svg>
          {error}
        </p>
      )}
    </div>
  )
}
