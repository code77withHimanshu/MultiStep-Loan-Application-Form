import { describe, it, expect } from 'vitest'
import {
  personalInfoSchema,
  addressInfoSchema,
  employmentInfoSchema,
  loanDetailsSchema,
  validateSchema,
} from '@/schemas'

const validPersonal = {
  firstName: 'Rahul',
  lastName: 'Sharma',
  email: 'rahul@example.com',
  phone: '9876543210',
  dateOfBirth: '1990-05-15',
  gender: 'male' as const,
  maritalStatus: 'single' as const,
  panNumber: 'ABCDE1234F',
  nationality: 'Indian' as const,
}

const validAddress = {
  currentAddressLine1: '123 MG Road',
  currentAddressLine2: 'Near Park',
  currentCity: 'Bangalore',
  currentState: 'Karnataka',
  currentZip: '560001',
  currentCountry: 'India',
  sameAsPermanent: true,
  permanentAddressLine1: '',
  permanentAddressLine2: '',
  permanentCity: '',
  permanentState: '',
  permanentZip: '',
  permanentCountry: 'India',
}

describe('personalInfoSchema', () => {
  it('passes for valid data', () => {
    const errs = validateSchema(personalInfoSchema, validPersonal)
    expect(errs).toEqual({})
  })

  it('requires firstName', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, firstName: '' })
    expect(errs.firstName).toBeTruthy()
  })

  it('requires minimum 2 chars for firstName', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, firstName: 'A' })
    expect(errs.firstName).toBeTruthy()
  })

  it('rejects invalid chars in firstName', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, firstName: 'Ra123' })
    expect(errs.firstName).toBeTruthy()
  })

  it('requires valid email', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, email: 'notanemail' })
    expect(errs.email).toBeTruthy()
  })

  it('rejects empty email', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, email: '' })
    expect(errs.email).toBeTruthy()
  })

  it('requires valid Indian mobile number', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, phone: '1234567890' })
    expect(errs.phone).toBeTruthy()
  })

  it('rejects 9-digit phone', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, phone: '987654321' })
    expect(errs.phone).toBeTruthy()
  })

  it('rejects underage applicant', () => {
    const dob = new Date(); dob.setFullYear(dob.getFullYear() - 17)
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, dateOfBirth: dob.toISOString().split('T')[0] })
    expect(errs.dateOfBirth).toContain('18')
  })

  it('rejects applicant over 70', () => {
    const dob = new Date(); dob.setFullYear(dob.getFullYear() - 71)
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, dateOfBirth: dob.toISOString().split('T')[0] })
    expect(errs.dateOfBirth).toContain('70')
  })

  it('requires gender', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, gender: '' as 'male' })
    expect(errs.gender).toBeTruthy()
  })

  it('requires marital status', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, maritalStatus: '' as 'single' })
    expect(errs.maritalStatus).toBeTruthy()
  })

  it('requires valid PAN format', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, panNumber: 'INVALID' })
    expect(errs.panNumber).toBeTruthy()
  })

  it('accepts valid PAN ABCDE1234F', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, panNumber: 'ABCDE1234F' })
    expect(errs.panNumber).toBeFalsy()
  })

  it('accepts female gender', () => {
    const errs = validateSchema(personalInfoSchema, { ...validPersonal, gender: 'female' })
    expect(errs).toEqual({})
  })
})

describe('addressInfoSchema', () => {
  it('passes for valid data with sameAsPermanent = true', () => {
    const errs = validateSchema(addressInfoSchema, validAddress)
    expect(errs).toEqual({})
  })

  it('requires currentAddressLine1', () => {
    const errs = validateSchema(addressInfoSchema, { ...validAddress, currentAddressLine1: '' })
    expect(errs.currentAddressLine1).toBeTruthy()
  })

  it('requires currentCity', () => {
    const errs = validateSchema(addressInfoSchema, { ...validAddress, currentCity: '' })
    expect(errs.currentCity).toBeTruthy()
  })

  it('requires valid 6-digit PIN', () => {
    const errs = validateSchema(addressInfoSchema, { ...validAddress, currentZip: '12345' })
    expect(errs.currentZip).toBeTruthy()
  })

  it('rejects non-numeric PIN', () => {
    const errs = validateSchema(addressInfoSchema, { ...validAddress, currentZip: '5600A1' })
    expect(errs.currentZip).toBeTruthy()
  })

  it('validates permanent address when sameAsPermanent is false', () => {
    const data = { ...validAddress, sameAsPermanent: false, permanentAddressLine1: '' }
    const errs = validateSchema(addressInfoSchema, data)
    expect(errs.permanentAddressLine1).toBeTruthy()
  })

  it('passes when permanent address is fully filled', () => {
    const data = {
      ...validAddress,
      sameAsPermanent: false,
      permanentAddressLine1: '456 Brigade Road',
      permanentCity: 'Bangalore',
      permanentState: 'Karnataka',
      permanentZip: '560001',
    }
    const errs = validateSchema(addressInfoSchema, data)
    expect(errs).toEqual({})
  })
})

describe('employmentInfoSchema', () => {
  const validEmployment = {
    employmentType: 'salaried' as const,
    employerName: 'Acme Corp',
    jobTitle: 'Software Engineer',
    monthlyGrossIncome: '80000',
    monthlyNetIncome: '65000',
    workExperience: '5',
    employmentStartDate: '2020-01-01',
  }

  it('passes for valid salaried data', () => {
    const errs = validateSchema(employmentInfoSchema, validEmployment)
    expect(errs).toEqual({})
  })

  it('requires employmentType', () => {
    const errs = validateSchema(employmentInfoSchema, { ...validEmployment, employmentType: '' as 'salaried' })
    expect(errs.employmentType).toBeTruthy()
  })

  it('requires employerName for non-retired', () => {
    const errs = validateSchema(employmentInfoSchema, { ...validEmployment, employerName: '' })
    expect(errs.employerName).toBeTruthy()
  })

  it('skips employer for retired type', () => {
    const errs = validateSchema(employmentInfoSchema, {
      ...validEmployment,
      employmentType: 'retired',
      employerName: '',
      jobTitle: '',
      employmentStartDate: '',
    })
    expect(errs.employerName).toBeFalsy()
  })

  it('rejects net income exceeding gross income', () => {
    const errs = validateSchema(employmentInfoSchema, {
      ...validEmployment,
      monthlyGrossIncome: '50000',
      monthlyNetIncome: '60000',
    })
    expect(errs.monthlyNetIncome).toBeTruthy()
  })

  it('rejects future employment start date', () => {
    const future = new Date(); future.setFullYear(future.getFullYear() + 1)
    const errs = validateSchema(employmentInfoSchema, {
      ...validEmployment,
      employmentStartDate: future.toISOString().split('T')[0],
    })
    expect(errs.employmentStartDate).toBeTruthy()
  })

  it('rejects work experience over 50', () => {
    const errs = validateSchema(employmentInfoSchema, { ...validEmployment, workExperience: '51' })
    expect(errs.workExperience).toBeTruthy()
  })

  it('rejects negative income', () => {
    const errs = validateSchema(employmentInfoSchema, { ...validEmployment, monthlyGrossIncome: '-1000' })
    expect(errs.monthlyGrossIncome).toBeTruthy()
  })
})

describe('loanDetailsSchema', () => {
  const validLoan = {
    loanType: 'personal' as const,
    loanAmount: '500000',
    loanPurpose: 'Medical expenses',
    tenure: '60',
    preferredEMIDate: '5',
  }

  it('passes for valid personal loan data', () => {
    const errs = validateSchema(loanDetailsSchema, validLoan)
    expect(errs).toEqual({})
  })

  it('passes for home loan', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, loanType: 'home' })
    expect(errs).toEqual({})
  })

  it('passes for business loan', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, loanType: 'business' })
    expect(errs).toEqual({})
  })

  it('requires loan type', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, loanType: '' as 'personal' })
    expect(errs.loanType).toBeTruthy()
  })

  it('requires minimum loan amount of 50000', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, loanAmount: '40000' })
    expect(errs.loanAmount).toBeTruthy()
  })

  it('rejects loan amount over 5 crore', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, loanAmount: '60000000' })
    expect(errs.loanAmount).toBeTruthy()
  })

  it('requires loan purpose', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, loanPurpose: '' })
    expect(errs.loanPurpose).toBeTruthy()
  })

  it('rejects tenure below 6 months', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, tenure: '5' })
    expect(errs.tenure).toBeTruthy()
  })

  it('rejects tenure above 360 months', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, tenure: '361' })
    expect(errs.tenure).toBeTruthy()
  })

  it('requires preferred EMI date', () => {
    const errs = validateSchema(loanDetailsSchema, { ...validLoan, preferredEMIDate: '' })
    expect(errs.preferredEMIDate).toBeTruthy()
  })
})
