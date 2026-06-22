export function validatePersonalInfo(data) {
  const errors = {}

  if (!data.firstName.trim()) {
    errors.firstName = 'First name is required'
  } else if (data.firstName.trim().length < 2) {
    errors.firstName = 'First name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.firstName)) {
    errors.firstName = 'First name contains invalid characters'
  }

  if (!data.lastName.trim()) {
    errors.lastName = 'Last name is required'
  } else if (data.lastName.trim().length < 2) {
    errors.lastName = 'Last name must be at least 2 characters'
  } else if (!/^[a-zA-Z\s'-]+$/.test(data.lastName)) {
    errors.lastName = 'Last name contains invalid characters'
  }

  if (!data.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number'
  }

  if (!data.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required'
  } else {
    const dob = new Date(data.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - dob.getFullYear()
    const monthDiff = today.getMonth() - dob.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--
    }
    if (age < 18) errors.dateOfBirth = 'You must be at least 18 years old'
    else if (age > 70) errors.dateOfBirth = 'Age must not exceed 70 years'
  }

  if (!data.gender) errors.gender = 'Gender is required'
  if (!data.maritalStatus) errors.maritalStatus = 'Marital status is required'

  if (!data.panNumber.trim()) {
    errors.panNumber = 'PAN number is required'
  } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber.toUpperCase())) {
    errors.panNumber = 'Invalid PAN format (e.g., ABCDE1234F)'
  }

  return errors
}

export function validateAddressInfo(data) {
  const errors = {}

  if (!data.currentAddressLine1.trim()) errors.currentAddressLine1 = 'Address line 1 is required'
  if (!data.currentCity.trim()) errors.currentCity = 'City is required'
  if (!data.currentState) errors.currentState = 'State is required'

  if (!data.currentZip.trim()) {
    errors.currentZip = 'PIN code is required'
  } else if (!/^\d{6}$/.test(data.currentZip)) {
    errors.currentZip = 'Enter a valid 6-digit PIN code'
  }

  if (!data.sameAsPermanent) {
    if (!data.permanentAddressLine1.trim()) errors.permanentAddressLine1 = 'Address line 1 is required'
    if (!data.permanentCity.trim()) errors.permanentCity = 'City is required'
    if (!data.permanentState) errors.permanentState = 'State is required'
    if (!data.permanentZip.trim()) {
      errors.permanentZip = 'PIN code is required'
    } else if (!/^\d{6}$/.test(data.permanentZip)) {
      errors.permanentZip = 'Enter a valid 6-digit PIN code'
    }
  }

  return errors
}

export function validateEmploymentInfo(data) {
  const errors = {}

  if (!data.employmentType) errors.employmentType = 'Employment type is required'

  if (data.employmentType && data.employmentType !== 'retired') {
    if (!data.employerName.trim()) errors.employerName = 'Employer / business name is required'
    if (!data.jobTitle.trim()) errors.jobTitle = 'Job title / designation is required'
    if (!data.employmentStartDate) errors.employmentStartDate = 'Employment start date is required'
    else {
      const startDate = new Date(data.employmentStartDate)
      if (startDate >= new Date()) errors.employmentStartDate = 'Start date must be in the past'
    }
  }

  if (!data.monthlyGrossIncome) {
    errors.monthlyGrossIncome = 'Monthly gross income is required'
  } else if (isNaN(data.monthlyGrossIncome) || Number(data.monthlyGrossIncome) <= 0) {
    errors.monthlyGrossIncome = 'Enter a valid income amount'
  }

  if (!data.monthlyNetIncome) {
    errors.monthlyNetIncome = 'Monthly net income is required'
  } else if (isNaN(data.monthlyNetIncome) || Number(data.monthlyNetIncome) <= 0) {
    errors.monthlyNetIncome = 'Enter a valid income amount'
  } else if (Number(data.monthlyNetIncome) > Number(data.monthlyGrossIncome)) {
    errors.monthlyNetIncome = 'Net income cannot exceed gross income'
  }

  if (!data.workExperience) {
    errors.workExperience = 'Total work experience is required'
  } else if (isNaN(data.workExperience) || Number(data.workExperience) < 0) {
    errors.workExperience = 'Enter valid work experience in years'
  } else if (Number(data.workExperience) > 50) {
    errors.workExperience = 'Work experience cannot exceed 50 years'
  }

  return errors
}

export function validateLoanDetails(data) {
  const errors = {}

  if (!data.loanType) errors.loanType = 'Loan type is required'

  if (!data.loanAmount) {
    errors.loanAmount = 'Loan amount is required'
  } else if (isNaN(data.loanAmount) || Number(data.loanAmount) < 50000) {
    errors.loanAmount = 'Minimum loan amount is ₹50,000'
  } else if (Number(data.loanAmount) > 50000000) {
    errors.loanAmount = 'Maximum loan amount is ₹5,00,00,000'
  }

  if (!data.loanPurpose.trim()) errors.loanPurpose = 'Loan purpose is required'

  if (!data.tenure) {
    errors.tenure = 'Loan tenure is required'
  } else if (isNaN(data.tenure) || Number(data.tenure) < 6 || Number(data.tenure) > 360) {
    errors.tenure = 'Tenure must be between 6 and 360 months'
  }

  if (!data.preferredEMIDate) errors.preferredEMIDate = 'Preferred EMI date is required'

  return errors
}

export function validateDocuments(data) {
  const errors = {}
  if (!data.idProof) errors.idProof = 'ID proof document is required'
  if (!data.addressProof) errors.addressProof = 'Address proof document is required'
  if (!data.incomeProof) errors.incomeProof = 'Income proof document is required'
  if (!data.photo) errors.photo = 'Passport-size photo is required'
  return errors
}

export function formatCurrency(amount) {
  if (!amount || isNaN(amount)) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(amount))
}

export function calculateEMI(principal, annualRatePercent, tenureMonths) {
  if (!principal || !annualRatePercent || !tenureMonths) return 0
  const p = Number(principal)
  const r = annualRatePercent / 12 / 100
  const n = Number(tenureMonths)
  if (r === 0) return p / n
  return (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

export const LOAN_INTEREST_RATES = {
  home: 8.5,
  personal: 14.0,
  car: 10.0,
  education: 11.0,
  business: 16.0,
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]
