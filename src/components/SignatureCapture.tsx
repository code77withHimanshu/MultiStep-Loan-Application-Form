import { useRef, useEffect } from 'react'
import SignaturePad from 'signature_pad'

interface SignatureCaptureProps {
  value: string | null
  onChange: (value: string | null) => void
  error?: string
}

export default function SignatureCapture({ value, onChange, error }: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePad | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    const pad = new SignaturePad(canvasRef.current)
    padRef.current = pad

    ;(pad as unknown as EventTarget).addEventListener('endStroke', () => {
      onChange(pad.isEmpty() ? null : pad.toDataURL())
    })

    if (value) {
      pad.fromDataURL(value)
    }

    return () => {
      pad.off()
    }
  }, [])

  useEffect(() => {
    if (!padRef.current) return
    if (!value) {
      padRef.current.clear()
    } else if (!padRef.current.isEmpty()) {
      // already has data
    } else {
      padRef.current.fromDataURL(value)
    }
  }, [value])

  const handleClear = () => {
    padRef.current?.clear()
    onChange(null)
  }

  return (
    <div className="space-y-2">
      <div className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          data-testid="signature-canvas"
          className="w-full touch-none"
          style={{ width: '100%', height: '160px' }}
        />
      </div>

      <div className="flex justify-between items-center">
        <div>
          {value && (
            <span
              data-testid="signature-preview-label"
              className="text-xs text-green-600 font-medium"
            >
              ✓ Signature captured
            </span>
          )}
        </div>
        <button
          type="button"
          data-testid="clear-signature-btn"
          onClick={handleClear}
          className="text-xs text-gray-500 hover:text-red-600 underline"
        >
          Clear
        </button>
      </div>

      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
