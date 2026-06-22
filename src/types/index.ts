export type LoanType = 'personal' | 'home' | 'business'
export type EmploymentType = 'salaried' | 'self_employed' | 'business_owner'
export type Gender = 'male' | 'female' | 'other'
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed'
export type ResidenceType = 'owned' | 'rented' | 'company' | 'family'
export type CoApplicantRelationship = 'spouse' | 'parent' | 'sibling' | 'business_partner'

export interface LoanBasicInfo {
  loanType: LoanType
  loanAmount: number
  loanTenure: number
  loanPurpose: string
  referralCode?: string
}

export interface PersonalInfo {
  fullName: string
  dateOfBirth: string
  gender: Gender
  maritalStatus: MaritalStatus
  fatherName: string
  motherName: string
  email: string
  mobileNumber: string
  alternateMobile?: string
}

export interface KYCInfo {
  panNumber: string
  panVerified: boolean
  aadhaarNumber: string
  aadhaarVerified: boolean
  aadhaarConsent: boolean
  voterId?: string
  passport?: string
}

export interface AddressInfo {
  currentAddressLine1: string
  currentAddressLine2?: string
  currentPinCode: string
  currentCity: string
  currentState: string
  currentPostOffice?: string
  currentResidenceType: ResidenceType
  currentRentAmount?: number
  yearsAtCurrentAddress: number
  sameAsPermanent: boolean
  permanentAddressLine1?: string
  permanentAddressLine2?: string
  permanentPinCode?: string
  permanentCity?: string
  permanentState?: string
}

export interface EmploymentInfoSalaried {
  employmentType: 'salaried'
  companyName: string
  designation: string
  monthlyNetSalary: number
  yearsOfExperience: number
}

export interface EmploymentInfoSelfEmployed {
  employmentType: 'self_employed'
  businessName: string
  businessType: string
  annualTurnover: number
  yearsInBusiness: number
  monthlyIncome: number
  yearsOfExperience: number
}

export interface EmploymentInfoBusinessOwner {
  employmentType: 'business_owner'
  businessName: string
  businessType: string
  annualTurnover: number
  yearsInBusiness: number
  monthlyIncome: number
  gstNumber?: string
  officeAddress?: string
  yearsOfExperience: number
}

export type EmploymentInfo =
  | EmploymentInfoSalaried
  | EmploymentInfoSelfEmployed
  | EmploymentInfoBusinessOwner

export interface CoApplicantInfo {
  coApplicantName: string
  relationship: CoApplicantRelationship
  coApplicantPAN: string
  coApplicantPANVerified: boolean
  coApplicantIncome: number
  coApplicantConsent: boolean
  coApplicantSignature?: string
}

export interface DocumentFile {
  file: File
  originalSize: number
  compressedSize?: number
  preview?: string
}

export interface DocumentsAndSignature {
  panCardCopy?: DocumentFile | null
  aadhaarFront?: DocumentFile | null
  aadhaarBack?: DocumentFile | null
  salarySlips?: DocumentFile[]
  bankStatements?: DocumentFile | null
  itrDocuments?: DocumentFile[]
  propertyDocuments?: DocumentFile | null
  businessRegistration?: DocumentFile | null
  gstReturns?: DocumentFile[]
  photograph?: DocumentFile | null
  eSignature?: string | null
}

export interface ConsentInfo {
  confirmAccuracy: boolean
  authorizeCreditCheck: boolean
  agreeTerms: boolean
  consentCommunications: boolean
}

export interface ApplicationFormData {
  loanBasicInfo: Partial<LoanBasicInfo>
  personalInfo: Partial<PersonalInfo>
  kycInfo: Partial<KYCInfo>
  addressInfo: Partial<AddressInfo>
  employmentInfo: Partial<EmploymentInfo>
  coApplicantInfo: Partial<CoApplicantInfo>
  documentsAndSignature: Partial<DocumentsAndSignature>
  consentInfo: Partial<ConsentInfo>
}

export interface SubmissionResponse {
  applicationId: string
  referenceNumber: string
  status: 'submitted' | 'under_review'
  submittedAt: string
  loanType: LoanType
  loanAmount: number
}

export interface PinCodeEntry {
  city: string
  state: string
  postOffice: string
}

export interface AutoSaveMetadata {
  version: string
  timestamp: number
  step: number
  loanType: LoanType | null
}

export type FormErrors = Record<string, string>
