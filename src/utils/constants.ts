import type { LoanType } from '@/types'

export const LOAN_INTEREST_RATES: Record<LoanType, number> = {
  personal: 10.5,
  home: 8.5,
  business: 14.0,
}

export const LOAN_AMOUNT_LIMITS: Record<LoanType, { min: number; max: number }> = {
  personal: { min: 50000, max: 1000000 },
  home: { min: 500000, max: 10000000 },
  business: { min: 100000, max: 5000000 },
}

export const LOAN_TENURE_LIMITS: Record<LoanType, { min: number; max: number }> = {
  personal: { min: 12, max: 60 },
  home: { min: 60, max: 360 },
  business: { min: 12, max: 120 },
}

export const CO_APPLICANT_THRESHOLDS: Record<LoanType, number | null> = {
  home: null,
  personal: 500000,
  business: 2000000,
}

export const PROCESSING_FEE_RATE = 0.01
export const PROCESSING_FEE_MIN = 2000
export const PROCESSING_FEE_MAX = 25000

export const TOTAL_STEPS = 8
export const STORAGE_KEY_PREFIX = 'lendswift_draft_'
export const STORAGE_VERSION = '1.0'
export const STORAGE_TTL_HOURS = 72

export const MIN_AGE = 21
export const MAX_AGE = 65

export const ENCRYPTION_PASSPHRASE = 'lendswift-2024-key'
export const ENCRYPTION_SALT = 'lendswift-salt'

export const AUTO_SAVE_INTERVAL_MS = 30000
export const TOAST_DISMISS_MS = 2000
export const VERIFICATION_DELAY_MS = 1500
export const PIN_LOOKUP_DELAY_MS = 300

export const MAX_FILE_SIZE_MB = 5
export const IMAGE_MAX_DIMENSION = 1200
export const IMAGE_INITIAL_QUALITY = 0.7
export const IMAGE_MIN_QUALITY = 0.3
export const IMAGE_QUALITY_STEP = 0.1
export const IMAGE_SIZE_THRESHOLD_BYTES = 2 * 1024 * 1024

export const INDIAN_STATES: string[] = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
]

export const LOAN_PURPOSES: Record<LoanType, string[]> = {
  personal: [
    'Medical Emergency',
    'Wedding Expenses',
    'Travel',
    'Home Renovation',
    'Education',
    'Debt Consolidation',
    'Consumer Durables',
    'Other',
  ],
  home: [
    'Purchase of New Property',
    'Construction of House',
    'Home Extension',
    'Home Renovation / Improvement',
    'Plot Purchase + Construction',
    'Balance Transfer',
    'Top-up on Existing Loan',
  ],
  business: [
    'Working Capital',
    'Equipment Purchase',
    'Business Expansion',
    'Inventory Financing',
    'Technology Upgrade',
    'Office Setup / Renovation',
    'Export Financing',
    'Other',
  ],
}

export const BUSINESS_TYPES: string[] = [
  'Proprietorship',
  'Partnership',
  'Limited Liability Partnership (LLP)',
  'Private Limited Company',
  'Public Limited Company',
  'One Person Company (OPC)',
  'Trust / NGO',
  'Co-operative Society',
]

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  personal: 'Personal Loan',
  home: 'Home Loan',
  business: 'Business Loan',
}

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  salaried: 'Salaried',
  self_employed: 'Self-Employed',
  business_owner: 'Business Owner',
}

export const GENDER_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
}

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  single: 'Single',
  married: 'Married',
  divorced: 'Divorced',
  widowed: 'Widowed',
}

export const RESIDENCE_TYPE_LABELS: Record<string, string> = {
  owned: 'Self-Owned',
  rented: 'Rented',
  company: 'Company Provided',
  family: 'Family-Owned',
}

export const CO_APPLICANT_RELATIONSHIP_LABELS: Record<string, string> = {
  spouse: 'Spouse',
  parent: 'Parent',
  sibling: 'Sibling',
  business_partner: 'Business Partner',
}

export const STEP_TITLES: string[] = [
  'Loan Type & Amount',
  'Personal Information',
  'KYC Verification',
  'Address Details',
  'Employment & Income',
  'Co-Applicant Details',
  'Documents & Signature',
  'Review & Submit',
]
