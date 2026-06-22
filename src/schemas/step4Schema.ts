import { z } from 'zod'

const addressSchema = z.object({
  currentAddressLine1: z.string().min(5, 'Address must be at least 5 characters'),
  currentAddressLine2: z.string().optional(),
  currentPinCode: z.string().regex(/^\d{6}$/, 'PIN code must be 6 digits'),
  currentCity: z.string().min(1, 'City is required'),
  currentState: z.string().min(1, 'State is required'),
  currentPostOffice: z.string().optional(),
  currentResidenceType: z.enum(['owned', 'rented', 'company', 'family'], {
    required_error: 'Please select residence type',
  }),
  currentRentAmount: z.number().min(0).optional(),
  yearsAtCurrentAddress: z
    .number({ invalid_type_error: 'Years at address is required' })
    .min(0, 'Cannot be negative')
    .max(99, 'Please enter a valid number of years'),
  sameAsPermanent: z.boolean(),
  permanentAddressLine1: z.string().optional(),
  permanentAddressLine2: z.string().optional(),
  permanentPinCode: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentState: z.string().optional(),
})

export const step4Schema = addressSchema
  .refine(
    (data) => {
      if (data.currentResidenceType === 'rented') {
        return data.currentRentAmount !== undefined && data.currentRentAmount > 0
      }
      return true
    },
    {
      message: 'Monthly rent amount is required for rented residence',
      path: ['currentRentAmount'],
    },
  )
  .refine(
    (data) => {
      if (!data.sameAsPermanent) {
        return !!(data.permanentAddressLine1 && data.permanentPinCode && data.permanentCity && data.permanentState)
      }
      return true
    },
    {
      message: 'Permanent address is required when different from current address',
      path: ['permanentAddressLine1'],
    },
  )
  .refine(
    (data) => {
      if (!data.sameAsPermanent && data.permanentPinCode) {
        return /^\d{6}$/.test(data.permanentPinCode)
      }
      return true
    },
    {
      message: 'Permanent PIN code must be 6 digits',
      path: ['permanentPinCode'],
    },
  )

export type Step4Data = z.infer<typeof step4Schema>
