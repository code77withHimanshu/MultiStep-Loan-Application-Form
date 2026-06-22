import { useForm } from '../context/FormContext.jsx'
import StepIndicator from './StepIndicator.jsx'
import PersonalInfo from './steps/PersonalInfo.jsx'
import AddressInfo from './steps/AddressInfo.jsx'
import EmploymentInfo from './steps/EmploymentInfo.jsx'
import LoanDetails from './steps/LoanDetails.jsx'
import DocumentUpload from './steps/DocumentUpload.jsx'
import ReviewSubmit from './steps/ReviewSubmit.jsx'
import SuccessScreen from './SuccessScreen.jsx'

const STEP_COMPONENTS = [
  PersonalInfo,
  AddressInfo,
  EmploymentInfo,
  LoanDetails,
  DocumentUpload,
  ReviewSubmit,
]

export default function MultiStepForm() {
  const { currentStep, submitted } = useForm()

  if (submitted) {
    return (
      <div className="form-card">
        <SuccessScreen />
      </div>
    )
  }

  const CurrentStepComponent = STEP_COMPONENTS[currentStep]

  return (
    <div className="form-card">
      <StepIndicator />
      <CurrentStepComponent />
    </div>
  )
}
