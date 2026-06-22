import { useRef, useEffect, useCallback } from 'react'
import SignaturePad from 'signature_pad'

interface UseSignatureReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>
  clear: () => void
  isEmpty: () => boolean
  getDataUrl: () => string | null
  loadDataUrl: (url: string) => void
}

export function useSignature(
  onChange: (dataUrl: string | null) => void
): UseSignatureReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const padRef = useRef<SignaturePad | null>(null)

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !padRef.current) return
    const ratio = Math.max(window.devicePixelRatio ?? 1, 1)
    const data = padRef.current.toData()
    canvas.width = canvas.offsetWidth * ratio
    canvas.height = canvas.offsetHeight * ratio
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.scale(ratio, ratio)
    padRef.current.clear()
    if (data.length > 0) padRef.current.fromData(data)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    padRef.current = new SignaturePad(canvas, {
      backgroundColor: 'rgb(255, 255, 255)',
      penColor: '#1d4ed8',
      minWidth: 1,
      maxWidth: 3,
    })

    padRef.current.addEventListener('endStroke', () => {
      if (padRef.current && !padRef.current.isEmpty()) {
        onChange(padRef.current.toDataURL('image/png'))
      }
    })

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      padRef.current?.off()
    }
  }, [onChange, resizeCanvas])

  const clear = useCallback(() => {
    padRef.current?.clear()
    onChange(null)
  }, [onChange])

  const isEmpty = useCallback((): boolean => {
    return padRef.current?.isEmpty() ?? true
  }, [])

  const getDataUrl = useCallback((): string | null => {
    if (!padRef.current || padRef.current.isEmpty()) return null
    return padRef.current.toDataURL('image/png')
  }, [])

  const loadDataUrl = useCallback((url: string) => {
    padRef.current?.fromDataURL(url)
  }, [])

  return { canvasRef, clear, isEmpty, getDataUrl, loadDataUrl }
}
