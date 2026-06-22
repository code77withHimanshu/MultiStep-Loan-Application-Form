export function formatCurrency(amount: number | string): string {
  const num = Number(amount)
  if (!amount || isNaN(num)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

export function formatIndianNumber(amount: number): string {
  if (isNaN(amount)) return '0'
  return new Intl.NumberFormat('en-IN').format(amount)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', options ?? { day: '2-digit', month: 'long', year: 'numeric' })
}

export function formatMonthYear(dateStr: string): string {
  return formatDate(dateStr, { month: 'long', year: 'numeric' })
}

export function maskPAN(pan: string): string {
  if (pan.length < 10) return pan
  return `${pan.substring(0, 3)}XX${pan[pan.length - 1]}`
}

export function maskAadhaar(aadhaar: string): string {
  if (aadhaar.length < 12) return aadhaar
  return `XXXX XXXX ${aadhaar.slice(-4)}`
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
}

export function generateReferenceNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const random = Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  return `LS${random}`
}

export function generateApplicationId(): string {
  return `APP${Date.now()}`
}
