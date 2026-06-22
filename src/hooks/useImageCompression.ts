import { useState, useCallback } from 'react'
import { compressImage, type CompressionResult } from '@/utils/imageCompression'

interface UseImageCompressionReturn {
  compress: (file: File) => Promise<CompressionResult>
  isCompressing: boolean
}

export function useImageCompression(): UseImageCompressionReturn {
  const [isCompressing, setIsCompressing] = useState(false)

  const compress = useCallback(async (file: File): Promise<CompressionResult> => {
    setIsCompressing(true)
    try {
      return await compressImage(file)
    } finally {
      setIsCompressing(false)
    }
  }, [])

  return { compress, isCompressing }
}
