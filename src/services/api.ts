import type { ApplicationFormData, SubmissionResponse } from '@/types'
import { generateApplicationId, generateReferenceNumber } from '@/utils/formatters'

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

export const apiService = {
  async submitApplication(
    formData: ApplicationFormData,
  ): Promise<ApiResponse<SubmissionResponse>> {
    await new Promise((resolve) => setTimeout(resolve, 800))
    return {
      success: true,
      data: {
        applicationId: generateApplicationId(),
        referenceNumber: generateReferenceNumber(),
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        loanType: formData.loanBasicInfo?.loanType ?? formData.loanDetails?.loanType as never,
        loanAmount: typeof formData.loanBasicInfo?.loanAmount === 'number'
          ? formData.loanBasicInfo.loanAmount
          : parseFloat(String(formData.loanDetails?.loanAmount ?? 0)),
      },
    }
  },
}
