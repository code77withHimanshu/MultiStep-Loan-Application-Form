import type { LoanType } from '@/types'

export const LOAN_INTEREST_RATES: Record<LoanType, number> = {
  home: 8.5,
  personal: 14.0,
  car: 10.0,
  education: 11.0,
  business: 16.0,
}

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

export const LOAN_TYPES = [
  { value: 'home' as LoanType, label: 'Home Loan', icon: '🏠', desc: 'Purchase or construct a home' },
  { value: 'personal' as LoanType, label: 'Personal Loan', icon: '👤', desc: 'For personal expenses' },
  { value: 'car' as LoanType, label: 'Car Loan', icon: '🚗', desc: 'Buy a new or used vehicle' },
  { value: 'education' as LoanType, label: 'Education Loan', icon: '🎓', desc: 'Fund your education' },
  { value: 'business' as LoanType, label: 'Business Loan', icon: '💼', desc: 'Grow your business' },
]

export const LOAN_TYPE_LABELS: Record<LoanType, string> = {
  home: 'Home Loan',
  personal: 'Personal Loan',
  car: 'Car Loan',
  education: 'Education Loan',
  business: 'Business Loan',
}

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  salaried: 'Salaried Employee',
  self_employed: 'Self-Employed / Freelancer',
  business: 'Business Owner',
  retired: 'Retired',
}

export const GENDER_LABELS: Record<string, string> = {
  male: 'Male',
  female: 'Female',
  other: 'Other',
  prefer_not_to_say: 'Prefer not to say',
}

export const MARITAL_STATUS_LABELS: Record<string, string> = {
  single: 'Single',
  married: 'Married',
  divorced: 'Divorced',
  widowed: 'Widowed',
  separated: 'Separated',
}

export const TOTAL_STEPS = 7
export const MIN_LOAN_AMOUNT = 50_000
export const MAX_LOAN_AMOUNT = 50_000_000
export const MIN_TENURE_MONTHS = 6
export const MAX_TENURE_MONTHS = 360
export const MAX_FILE_SIZE_MB = 5
export const ACCEPTED_FILE_TYPES = 'image/jpeg,image/png,application/pdf'
export const STORAGE_KEY = 'loanease-form-v2'
export const MIN_AGE = 18
export const MAX_AGE = 70
