import { z } from 'zod'

export { step1Schema } from './step1Schema'
export { step2Schema } from './step2Schema'
export { step3Schema } from './step3Schema'
export { step4Schema } from './step4Schema'
export { step5Schema } from './step5Schema'
export { step6Schema } from './step6Schema'
export { step7Schema } from './step7Schema'
export { step8Schema } from './step8Schema'
export { getSchemaForStep } from './schemaFactory'

export type { Step1Data } from './step1Schema'
export type { Step2Data } from './step2Schema'
export type { Step3Data } from './step3Schema'
export type { Step4Data } from './step4Schema'
export type { Step5Data } from './step5Schema'
export type { Step6Data } from './step6Schema'
export type { Step7Data } from './step7Schema'
export type { Step8Data } from './step8Schema'

export function validateSchema<T extends z.ZodType>(
  schema: T,
  data: z.input<T>,
): Record<string, string> {
  const result = schema.safeParse(data)
  if (result.success) return {}
  const errors: Record<string, string> = {}
  result.error.errors.forEach((err) => {
    const key = err.path.join('.')
    if (key && !errors[key]) {
      errors[key] = err.message
    }
  })
  return errors
}
