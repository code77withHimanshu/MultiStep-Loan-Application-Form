import { useFormStore } from '@/store/formStore'
import StepIndicator from './StepIndicator'
import PersonalInfo from './steps/PersonalInfo'
import AddressInfo from './steps/AddressInfo'
import EmploymentInfo from './steps/EmploymentInfo'
import LoanDetails from './steps/LoanDetails'
import DocumentUpload from './steps/DocumentUpload'
import SignatureStep from './steps/SignatureStep'
import ReviewSubmit from './steps/ReviewSubmit'
import SuccessScreen from './SuccessScreen'
import ResumePrompt from './ResumePrompt'

const STEP_COMPONENTS = [
  PersonalInfo,
  AddressInfo,
  EmploymentInfo,
  LoanDetails,
  DocumentUpload,
  SignatureStep,
  ReviewSubmit,
]

export default function MultiStepForm() {
  const { currentStep, submitted, hasSavedData } = useFormStore()

  if (submitted) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)' }}>
        <SuccessScreen />
      </div>
    )
  }

  const CurrentStep = STEP_COMPONENTS[currentStep]

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)' }}>
      {hasSavedData && <ResumePrompt />}
      <StepIndicator />
      <CurrentStep />
    </div>
  )
}
