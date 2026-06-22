import { z } from 'zod'

export const step6Schema = z.object({
  coApplicantName: z
    .string()
    .min(2, "Co-applicant name must be at least 2 characters")
    .max(100, "Co-applicant name must be less than 100 characters"),
  relationship: z.enum(['spouse', 'parent', 'sibling', 'business_partner'], {
    required_error: 'Please select the relationship',
  }),
  coApplicantPAN: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]$/, 'PAN must be in format: ABCDE1234F'),
  coApplicantPANVerified: z.boolean().refine((val) => val === true, {
    message: "Co-applicant PAN verification is required",
  }),
  coApplicantIncome: z
    .number({ invalid_type_error: 'Co-applicant monthly income is required' })
    .min(1, 'Co-applicant income must be greater than 0'),
  coApplicantConsent: z.boolean().refine((val) => val === true, {
    message: "Co-applicant consent is required",
  }),
  coApplicantSignature: z.string().optional(),
})

export type Step6Data = z.infer<typeof step6Schema>
