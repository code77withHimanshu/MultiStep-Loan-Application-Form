import { createContext, useContext, useState } from 'react'

const FormContext = createContext(null)

const initialFormData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    maritalStatus: '',
    panNumber: '',
    nationality: 'Indian',
  },
  addressInfo: {
    currentAddressLine1: '',
    currentAddressLine2: '',
    currentCity: '',
    currentState: '',
    currentZip: '',
    currentCountry: 'India',
    sameAsPermanent: false,
    permanentAddressLine1: '',
    permanentAddressLine2: '',
    permanentCity: '',
    permanentState: '',
    permanentZip: '',
    permanentCountry: 'India',
  },
  employmentInfo: {
    employmentType: '',
    employerName: '',
    jobTitle: '',
    monthlyGrossIncome: '',
    monthlyNetIncome: '',
    workExperience: '',
    employmentStartDate: '',
  },
  loanDetails: {
    loanType: '',
    loanAmount: '',
    loanPurpose: '',
    tenure: '',
    preferredEMIDate: '',
  },
  documents: {
    idProof: null,
    addressProof: null,
    incomeProof: null,
    photo: null,
  },
}

export function FormProvider({ children }) {
  const [formData, setFormData] = useState(initialFormData)
  const [currentStep, setCurrentStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }))
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 5))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0))
  const goToStep = (step) => setCurrentStep(step)

  return (
    <FormContext.Provider
      value={{
        formData,
        currentStep,
        submitted,
        updateFormData,
        nextStep,
        prevStep,
        goToStep,
        setSubmitted,
      }}
    >
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const context = useContext(FormContext)
  if (!context) throw new Error('useForm must be used within FormProvider')
  return context
}
