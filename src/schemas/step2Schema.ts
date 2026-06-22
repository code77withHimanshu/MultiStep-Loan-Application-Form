import { z } from 'zod'
import { calculateAge } from '@/utils/calculations'
import { MIN_AGE, MAX_AGE } from '@/utils/constants'

export const step2Schema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be less than 100 characters')
      .regex(/^[a-zA-Z\s.'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
    dateOfBirth: z
      .string()
      .min(1, 'Date of birth is required')
      .refine(
        (dob) => {
          const age = calculateAge(dob)
          return age >= MIN_AGE && age <= MAX_AGE
        },
        { message: `Applicant must be between ${MIN_AGE} and ${MAX_AGE} years old` },
      ),
    gender: z.enum(['male', 'female', 'other'], {
      required_error: 'Please select your gender',
    }),
    maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], {
      required_error: 'Please select your marital status',
    }),
    fatherName: z
      .string()
      .min(2, "Father's name must be at least 2 characters")
      .max(100, "Father's name must be less than 100 characters"),
    motherName: z
      .string()
      .min(2, "Mother's name must be at least 2 characters")
      .max(100, "Mother's name must be less than 100 characters"),
    email: z.string().email('Please enter a valid email address'),
    mobileNumber: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Mobile number must be 10 digits starting with 6-9'),
    alternateMobile: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Alternate mobile must be 10 digits starting with 6-9')
      .optional()
      .or(z.literal('')),
  })
  .refine(
    (data) => !data.alternateMobile || data.alternateMobile !== data.mobileNumber,
    {
      message: 'Alternate mobile number must be different from primary mobile',
      path: ['alternateMobile'],
    },
  )

export type Step2Data = z.infer<typeof step2Schema>
