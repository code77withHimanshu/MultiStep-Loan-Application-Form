import { z } from 'zod'

const salariedSchema = z.object({
  employmentType: z.literal('salaried'),
  companyName: z.string().min(2, 'Company name must be at least 2 characters'),
  designation: z.string().min(2, 'Designation must be at least 2 characters'),
  monthlyNetSalary: z
    .number({ invalid_type_error: 'Monthly salary is required' })
    .min(15000, 'Minimum monthly net salary is ₹15,000'),
  yearsOfExperience: z
    .number({ invalid_type_error: 'Years of experience is required' })
    .min(0)
    .max(50),
})

const selfEmployedSchema = z.object({
  employmentType: z.literal('self_employed'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.string().min(1, 'Business type is required'),
  annualTurnover: z
    .number({ invalid_type_error: 'Annual turnover is required' })
    .min(300000, 'Minimum annual turnover is ₹3,00,000'),
  yearsInBusiness: z
    .number({ invalid_type_error: 'Years in business is required' })
    .min(2, 'Minimum 2 years in business required'),
  monthlyIncome: z
    .number({ invalid_type_error: 'Monthly income is required' })
    .min(1, 'Monthly income is required'),
  yearsOfExperience: z
    .number({ invalid_type_error: 'Years of experience is required' })
    .min(0)
    .max(50),
})

const businessOwnerSchema = z.object({
  employmentType: z.literal('business_owner'),
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  businessType: z.string().min(1, 'Business type is required'),
  annualTurnover: z
    .number({ invalid_type_error: 'Annual turnover is required' })
    .min(300000, 'Minimum annual turnover is ₹3,00,000'),
  yearsInBusiness: z
    .number({ invalid_type_error: 'Years in business is required' })
    .min(2, 'Minimum 2 years in business required'),
  monthlyIncome: z
    .number({ invalid_type_error: 'Monthly income is required' })
    .min(1, 'Monthly income is required'),
  gstNumber: z
    .string()
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/, 'Invalid GST number format')
    .optional()
    .or(z.literal('')),
  officeAddress: z.string().optional(),
  yearsOfExperience: z
    .number({ invalid_type_error: 'Years of experience is required' })
    .min(0)
    .max(50),
})

export const step5Schema = z.discriminatedUnion('employmentType', [
  salariedSchema,
  selfEmployedSchema,
  businessOwnerSchema,
])

export type Step5Data = z.infer<typeof step5Schema>
