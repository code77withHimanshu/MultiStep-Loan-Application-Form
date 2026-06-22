export type LoanType = 'home' | 'personal' | 'car' | 'education' | 'business'
export type EmploymentType = 'salaried' | 'self_employed' | 'business' | 'retired'
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'separated'
export type Nationality = 'Indian' | 'NRI' | 'OCI'
export type EligibilityVerdict = 'approved' | 'conditional' | 'rejected'

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: Gender | ''
  maritalStatus: MaritalStatus | ''
  panNumber: string
  nationality: Nationality
}

export interface AddressInfo {
  currentAddressLine1: string
  currentAddressLine2: string
  currentCity: string
  currentState: string
  currentZip: string
  currentCountry: string
  sameAsPermanent: boolean
  permanentAddressLine1: string
  permanentAddressLine2: string
  permanentCity: string
  permanentState: string
  permanentZip: string
  permanentCountry: string
}

export interface EmploymentInfo {
  employmentType: EmploymentType | ''
  employerName: string
  jobTitle: string
  monthlyGrossIncome: string
  monthlyNetIncome: string
  workExperience: string
  employmentStartDate: string
}

export interface LoanDetails {
  loanType: LoanType | ''
  loanAmount: string
  loanPurpose: string
  tenure: string
  preferredEMIDate: string
}

export interface Documents {
  idProof: File | null
  addressProof: File | null
  incomeProof: File | null
  photo: File | null
}

export interface SignatureData {
  dataUrl: string | null
}

export interface ApplicationFormData {
  personalInfo: PersonalInfo
  addressInfo: AddressInfo
  employmentInfo: EmploymentInfo
  loanDetails: LoanDetails
  documents: Documents
  signature: SignatureData
}

export interface EligibilityResult {
  eligible: boolean
  verdict: EligibilityVerdict
  creditScore: number
  maxLoanAmount: number
  suggestedInterestRate: number
  emiToIncomeRatio: number
  reasons: string[]
}

export interface SubmissionResponse {
  applicationId: string
  referenceNumber: string
  status: 'submitted' | 'under_review'
  submittedAt: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export type FormErrors = Record<string, string>

export interface DocumentMeta {
  name: string
  size: number
  type: string
}

export interface PersistedFormData {
  personalInfo: PersonalInfo
  addressInfo: AddressInfo
  employmentInfo: EmploymentInfo
  loanDetails: LoanDetails
  documents: {
    idProof: null
    addressProof: null
    incomeProof: null
    photo: null
  }
  signature: {
    dataUrl: null
  }
}
