import { z } from 'zod'

export const step8Schema = z.object({
  confirmAccuracy: z.boolean().refine((val) => val === true, {
    message: 'You must confirm that all information provided is accurate',
  }),
  authorizeCreditCheck: z.boolean().refine((val) => val === true, {
    message: 'You must authorise LendSwift to check your credit score',
  }),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the Terms and Conditions',
  }),
  consentCommunications: z.boolean().refine((val) => val === true, {
    message: 'You must consent to receive communications regarding this application',
  }),
})

export type Step8Data = z.infer<typeof step8Schema>
