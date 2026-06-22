import type { ApplicationFormData, SubmissionResponse, ApiResponse } from '@/types'
import { generateApplicationId, generateReferenceNumber } from '@/utils/formatters'

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const apiService = {
  async submitApplication(
    _data: ApplicationFormData
  ): Promise<ApiResponse<SubmissionResponse>> {
    await delay(1800)

    const response: SubmissionResponse = {
      applicationId: generateApplicationId(),
      referenceNumber: generateReferenceNumber(),
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    }

    return { success: true, data: response, message: 'Application submitted successfully' }
  },

  async saveProgress(_data: Partial<ApplicationFormData>): Promise<ApiResponse<{ savedAt: string }>> {
    await delay(200)
    return { success: true, data: { savedAt: new Date().toISOString() } }
  },
}
