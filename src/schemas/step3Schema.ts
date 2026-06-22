import { z } from 'zod'

export const step3Schema = z.object({
  panNumber: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN must be in format: ABCDE1234F'),
  panVerified: z.boolean().refine((val) => val === true, {
    message: 'PAN verification is required before proceeding',
  }),
  aadhaarNumber: z
    .string()
    .regex(/^\d{12}$/, 'Aadhaar number must be exactly 12 digits'),
  aadhaarVerified: z.boolean().refine((val) => val === true, {
    message: 'Aadhaar verification is required before proceeding',
  }),
  aadhaarConsent: z.boolean().refine((val) => val === true, {
    message: 'You must provide consent for Aadhaar verification',
  }),
  voterId: z
    .string()
    .regex(/^[A-Z]{3}[0-9]{7}$/, 'Voter ID must be in format: ABC1234567')
    .optional()
    .or(z.literal('')),
  passport: z
    .string()
    .regex(/^[A-Z][0-9]{7}$/, 'Passport must be in format: A1234567')
    .optional()
    .or(z.literal('')),
})

export type Step3Data = z.infer<typeof step3Schema>
