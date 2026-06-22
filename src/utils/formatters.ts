export function formatCurrency(amount: number | string): string {
  const num = Number(amount)
  if (!amount || isNaN(num)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
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

export function formatOrdinal(n: number): string {
  const suffixes = ['th', 'st', 'nd', 'rd']
  const mod100 = n % 100
  const suffix = suffixes[((mod100 - 11) % 10 - 1)] ?? suffixes[0]
  return `${n}${suffix}`
}

export function generateReferenceNumber(): string {
  return `LN${Date.now().toString().slice(-8).toUpperCase()}`
}

export function generateApplicationId(): string {
  return `APP${Date.now()}`
}
