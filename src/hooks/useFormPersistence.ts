import { useEffect } from 'react'
import { useFormStore } from '@/store/formStore'
import { storageService } from '@/services/storage'

export function useFormPersistence() {
  const { formData, currentStep, savedAt } = useFormStore()

  useEffect(() => {
    if (currentStep === 0 && !savedAt) return

    storageService.save({
      currentStep,
      formData: {
        personalInfo: formData.personalInfo as Record<string, unknown>,
        addressInfo: formData.addressInfo as Record<string, unknown>,
        employmentInfo: formData.employmentInfo as Record<string, unknown>,
        loanDetails: formData.loanDetails as Record<string, unknown>,
      },
      savedAt: savedAt ?? new Date().toISOString(),
    })
  }, [formData, currentStep, savedAt])
}
