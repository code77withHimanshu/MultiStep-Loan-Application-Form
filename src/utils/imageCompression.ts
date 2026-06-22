import {
  IMAGE_MAX_DIMENSION,
  IMAGE_INITIAL_QUALITY,
  IMAGE_MIN_QUALITY,
  IMAGE_QUALITY_STEP,
  IMAGE_SIZE_THRESHOLD_BYTES,
} from '@/utils/constants'

export interface CompressionResult {
  compressed: File
  originalSize: number
  compressedSize: number
}

async function compressWithQuality(
  canvas: HTMLCanvasElement,
  fileName: string,
  quality: number,
): Promise<File> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas toBlob failed'))
          return
        }
        resolve(new File([blob], fileName, { type: 'image/jpeg' }))
      },
      'image/jpeg',
      quality,
    )
  })
}

async function drawImageOnCanvas(file: File): Promise<HTMLCanvasElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      let { width, height } = img
      if (width > IMAGE_MAX_DIMENSION || height > IMAGE_MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * IMAGE_MAX_DIMENSION) / width)
          width = IMAGE_MAX_DIMENSION
        } else {
          width = Math.round((width * IMAGE_MAX_DIMENSION) / height)
          height = IMAGE_MAX_DIMENSION
        }
      }
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) {
        reject(new Error('Could not get canvas context'))
        return
      }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

export async function compressImage(file: File): Promise<CompressionResult> {
  const originalSize = file.size
  if (!['image/jpeg', 'image/png'].includes(file.type)) {
    return { compressed: file, originalSize, compressedSize: file.size }
  }

  const canvas = await drawImageOnCanvas(file)
  let quality = IMAGE_INITIAL_QUALITY
  let compressed = await compressWithQuality(canvas, file.name, quality)

  while (compressed.size > IMAGE_SIZE_THRESHOLD_BYTES && quality > IMAGE_MIN_QUALITY) {
    quality = Math.max(quality - IMAGE_QUALITY_STEP, IMAGE_MIN_QUALITY)
    // eslint-disable-next-line no-await-in-loop
    compressed = await compressWithQuality(canvas, file.name, quality)
    if (quality <= IMAGE_MIN_QUALITY) break
  }

  return {
    compressed,
    originalSize,
    compressedSize: compressed.size,
  }
}
