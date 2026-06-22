import { useState, useCallback } from 'react'
import type { Documents } from '@/types'
import { MAX_FILE_SIZE_MB, ACCEPTED_FILE_TYPES } from '@/utils/constants'

type DocumentKey = keyof Documents

interface UseDocumentUploadReturn {
  files: Documents
  errors: Partial<Record<DocumentKey, string>>
  sizeErrors: Partial<Record<DocumentKey, string>>
  handleFileChange: (key: DocumentKey, file: File | null) => void
  handleRemove: (key: DocumentKey) => void
  clearErrors: (key: DocumentKey) => void
}

export function useDocumentUpload(initial: Documents): UseDocumentUploadReturn {
  const [files, setFiles] = useState<Documents>(initial)
  const [errors, setErrors] = useState<Partial<Record<DocumentKey, string>>>({})
  const [sizeErrors, setSizeErrors] = useState<Partial<Record<DocumentKey, string>>>({})

  const handleFileChange = useCallback((key: DocumentKey, file: File | null) => {
    if (!file) return

    const maxBytes = MAX_FILE_SIZE_MB * 1024 * 1024
    if (file.size > maxBytes) {
      setSizeErrors((prev) => ({ ...prev, [key]: `File size must not exceed ${MAX_FILE_SIZE_MB} MB` }))
      return
    }

    const accepted = ACCEPTED_FILE_TYPES.split(',')
    if (!accepted.includes(file.type)) {
      setSizeErrors((prev) => ({ ...prev, [key]: 'Only JPG, PNG, and PDF files are accepted' }))
      return
    }

    setSizeErrors((prev) => ({ ...prev, [key]: undefined }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
    setFiles((prev) => ({ ...prev, [key]: file }))
  }, [])

  const handleRemove = useCallback((key: DocumentKey) => {
    setFiles((prev) => ({ ...prev, [key]: null }))
    setSizeErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [])

  const clearErrors = useCallback((key: DocumentKey) => {
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [])

  return { files, errors, sizeErrors, handleFileChange, handleRemove, clearErrors }
}
