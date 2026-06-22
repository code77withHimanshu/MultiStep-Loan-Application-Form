import { z } from 'zod'
import { calculateAge } from '@/utils/calculations'
import { MIN_LOAN_AMOUNT, MAX_LOAN_AMOUNT, MIN_TENURE_MONTHS, MAX_TENURE_MONTHS } from '@/utils/constants'

export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name contains invalid characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name contains invalid characters'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Enter a valid email address'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number'),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine((val) => {
      const age = calculateAge(val)
      return age >= 18
    }, 'You must be at least 18 years old')
    .refine((val) => {
      const age = calculateAge(val)
      return age <= 70
    }, 'Age must not exceed 70 years'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed', 'separated'], {
    errorMap: () => ({ message: 'Marital status is required' }),
  }),
  panNumber: z
    .string()
    .min(1, 'PAN number is required')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format (e.g., ABCDE1234F)'),
  nationality: z.enum(['Indian', 'NRI', 'OCI']),
})

export const addressInfoSchema = z
  .object({
    currentAddressLine1: z.string().min(1, 'Address line 1 is required'),
    currentAddressLine2: z.string().optional(),
    currentCity: z.string().min(1, 'City is required'),
    currentState: z.string().min(1, 'State is required'),
    currentZip: z
      .string()
      .min(1, 'PIN code is required')
      .regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
    currentCountry: z.string().default('India'),
    sameAsPermanent: z.boolean(),
    permanentAddressLine1: z.string(),
    permanentAddressLine2: z.string().optional(),
    permanentCity: z.string(),
    permanentState: z.string(),
    permanentZip: z.string(),
    permanentCountry: z.string().default('India'),
  })
  .superRefine((data, ctx) => {
    if (!data.sameAsPermanent) {
      if (!data.permanentAddressLine1.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Address line 1 is required', path: ['permanentAddressLine1'] })
      }
      if (!data.permanentCity.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'City is required', path: ['permanentCity'] })
      }
      if (!data.permanentState.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'State is required', path: ['permanentState'] })
      }
      if (!data.permanentZip.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'PIN code is required', path: ['permanentZip'] })
      } else if (!/^\d{6}$/.test(data.permanentZip)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Enter a valid 6-digit PIN code', path: ['permanentZip'] })
      }
    }
  })

export const employmentInfoSchema = z
  .object({
    employmentType: z.enum(['salaried', 'self_employed', 'business', 'retired'], {
      errorMap: () => ({ message: 'Employment type is required' }),
    }),
    employerName: z.string(),
    jobTitle: z.string(),
    monthlyGrossIncome: z
      .string()
      .min(1, 'Monthly gross income is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Enter a valid income amount'),
    monthlyNetIncome: z
      .string()
      .min(1, 'Monthly net income is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, 'Enter a valid income amount'),
    workExperience: z
      .string()
      .min(1, 'Total work experience is required')
      .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, 'Enter valid work experience in years')
      .refine((val) => Number(val) <= 50, 'Work experience cannot exceed 50 years'),
    employmentStartDate: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.monthlyNetIncome && data.monthlyGrossIncome) {
      if (Number(data.monthlyNetIncome) > Number(data.monthlyGrossIncome)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Net income cannot exceed gross income', path: ['monthlyNetIncome'] })
      }
    }
    if (data.employmentType !== 'retired') {
      if (!data.employerName.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Employer / business name is required', path: ['employerName'] })
      }
      if (!data.jobTitle.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Job title / designation is required', path: ['jobTitle'] })
      }
      if (!data.employmentStartDate) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Employment start date is required', path: ['employmentStartDate'] })
      } else if (new Date(data.employmentStartDate) >= new Date()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Start date must be in the past', path: ['employmentStartDate'] })
      }
    }
  })

export const loanDetailsSchema = z.object({
  loanType: z.enum(['home', 'personal', 'car', 'education', 'business'], {
    errorMap: () => ({ message: 'Loan type is required' }),
  }),
  loanAmount: z
    .string()
    .min(1, 'Loan amount is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= MIN_LOAN_AMOUNT, `Minimum loan amount is ₹${MIN_LOAN_AMOUNT.toLocaleString('en-IN')}`)
    .refine((val) => Number(val) <= MAX_LOAN_AMOUNT, `Maximum loan amount is ₹${MAX_LOAN_AMOUNT.toLocaleString('en-IN')}`),
  loanPurpose: z.string().min(1, 'Loan purpose is required'),
  tenure: z
    .string()
    .min(1, 'Loan tenure is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= MIN_TENURE_MONTHS, `Minimum tenure is ${MIN_TENURE_MONTHS} months`)
    .refine((val) => Number(val) <= MAX_TENURE_MONTHS, `Maximum tenure is ${MAX_TENURE_MONTHS} months`),
  preferredEMIDate: z.string().min(1, 'Preferred EMI date is required'),
})

export const documentsSchema = z.object({
  idProof: z.instanceof(File, { message: 'ID proof document is required' }),
  addressProof: z.instanceof(File, { message: 'Address proof document is required' }),
  incomeProof: z.instanceof(File, { message: 'Income proof document is required' }),
  photo: z.instanceof(File, { message: 'Passport-size photo is required' }),
})

export const signatureSchema = z.object({
  dataUrl: z.string().min(1, 'Signature is required').nullable().refine(
    (val) => val !== null && val.length > 0,
    'Signature is required'
  ),
})

export type PersonalInfoInput = z.input<typeof personalInfoSchema>
export type AddressInfoInput = z.input<typeof addressInfoSchema>
export type EmploymentInfoInput = z.input<typeof employmentInfoSchema>
export type LoanDetailsInput = z.input<typeof loanDetailsSchema>

export function validateSchema<T extends z.ZodType>(
  schema: T,
  data: z.input<T>
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
