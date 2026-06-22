import { z } from 'zod'
import type { ApplicationFormData } from '@/types'
import { step1Schema } from './step1Schema'
import { step2Schema } from './step2Schema'
import { step3Schema } from './step3Schema'
import { step4Schema } from './step4Schema'
import { step5Schema } from './step5Schema'
import { step6Schema } from './step6Schema'
import { step7Schema } from './step7Schema'
import { step8Schema } from './step8Schema'

// Returns the Zod schema for a given step index (0-based).
// Cross-step dependencies are injected via formData.
export function getSchemaForStep(
  stepIndex: number,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _formData?: ApplicationFormData,
): z.ZodType {
  switch (stepIndex) {
    case 0:
      return step1Schema
    case 1:
      return step2Schema
    case 2:
      return step3Schema
    case 3:
      return step4Schema
    case 4:
      return step5Schema
    case 5:
      return step6Schema
    case 6:
      return step7Schema
    case 7:
      return step8Schema
    default:
      return z.object({})
  }
}
