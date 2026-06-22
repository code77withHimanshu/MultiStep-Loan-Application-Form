import { z } from 'zod'

export const step7Schema = z.object({
  eSignature: z
    .string({ required_error: 'Electronic signature is required' })
    .min(1, 'Please draw your signature'),
})

export type Step7Data = z.infer<typeof step7Schema>
