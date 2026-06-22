import { z } from 'zod'
import { LOAN_AMOUNT_LIMITS, LOAN_TENURE_LIMITS } from '@/utils/constants'

export const step1Schema = z.discriminatedUnion('loanType', [
  z.object({
    loanType: z.literal('personal'),
    loanAmount: z
      .number({ invalid_type_error: 'Loan amount is required' })
      .min(LOAN_AMOUNT_LIMITS.personal.min, `Minimum loan amount is ₹${LOAN_AMOUNT_LIMITS.personal.min.toLocaleString('en-IN')}`)
      .max(LOAN_AMOUNT_LIMITS.personal.max, `Maximum loan amount is ₹${LOAN_AMOUNT_LIMITS.personal.max.toLocaleString('en-IN')}`),
    loanTenure: z
      .number({ invalid_type_error: 'Loan tenure is required' })
      .min(LOAN_TENURE_LIMITS.personal.min, `Minimum tenure is ${LOAN_TENURE_LIMITS.personal.min} months`)
      .max(LOAN_TENURE_LIMITS.personal.max, `Maximum tenure is ${LOAN_TENURE_LIMITS.personal.max} months`),
    loanPurpose: z.string().min(1, 'Please select a loan purpose'),
    referralCode: z.string().optional(),
  }),
  z.object({
    loanType: z.literal('home'),
    loanAmount: z
      .number({ invalid_type_error: 'Loan amount is required' })
      .min(LOAN_AMOUNT_LIMITS.home.min, `Minimum loan amount is ₹${LOAN_AMOUNT_LIMITS.home.min.toLocaleString('en-IN')}`)
      .max(LOAN_AMOUNT_LIMITS.home.max, `Maximum loan amount is ₹${LOAN_AMOUNT_LIMITS.home.max.toLocaleString('en-IN')}`),
    loanTenure: z
      .number({ invalid_type_error: 'Loan tenure is required' })
      .min(LOAN_TENURE_LIMITS.home.min, `Minimum tenure is ${LOAN_TENURE_LIMITS.home.min} months`)
      .max(LOAN_TENURE_LIMITS.home.max, `Maximum tenure is ${LOAN_TENURE_LIMITS.home.max} months`),
    loanPurpose: z.string().min(1, 'Please select a loan purpose'),
    referralCode: z.string().optional(),
  }),
  z.object({
    loanType: z.literal('business'),
    loanAmount: z
      .number({ invalid_type_error: 'Loan amount is required' })
      .min(LOAN_AMOUNT_LIMITS.business.min, `Minimum loan amount is ₹${LOAN_AMOUNT_LIMITS.business.min.toLocaleString('en-IN')}`)
      .max(LOAN_AMOUNT_LIMITS.business.max, `Maximum loan amount is ₹${LOAN_AMOUNT_LIMITS.business.max.toLocaleString('en-IN')}`),
    loanTenure: z
      .number({ invalid_type_error: 'Loan tenure is required' })
      .min(LOAN_TENURE_LIMITS.business.min, `Minimum tenure is ${LOAN_TENURE_LIMITS.business.min} months`)
      .max(LOAN_TENURE_LIMITS.business.max, `Maximum tenure is ${LOAN_TENURE_LIMITS.business.max} months`),
    loanPurpose: z.string().min(1, 'Please select a loan purpose'),
    referralCode: z.string().optional(),
  }),
])

export type Step1Data = z.infer<typeof step1Schema>
