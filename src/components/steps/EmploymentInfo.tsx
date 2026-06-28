import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'

const employmentTypeOptions = [
  { value: 'salaried', label: 'Salaried' },
  { value: 'self_employed', label: 'Self-Employed' },
  { value: 'business_owner', label: 'Business Owner' },
  { value: 'retired', label: 'Retired' },
]

const schema = z.object({
  employmentType: z.string().min(1, 'Employment type is required'),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  businessName: z.string().optional(),
  monthlyGrossIncome: z.string().optional(),
  monthlyNetIncome: z.string().optional(),
  workExperience: z.string().optional(),
  employmentStartDate: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const SHOWS_EMPLOYER = ['salaried', 'business_owner']
const SHOWS_BUSINESS = ['self_employed', 'business_owner']
const SHOWS_INCOME = ['salaried', 'self_employed', 'business_owner']

export default function EmploymentInfo() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore()
  const saved = formData.employmentInfo

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      employmentType: saved?.employmentType ?? '',
      employerName: saved?.employerName ?? '',
      jobTitle: saved?.jobTitle ?? '',
      businessName: saved?.businessName ?? '',
      monthlyGrossIncome: String(saved?.monthlyGrossIncome ?? ''),
      monthlyNetIncome: String(saved?.monthlyNetIncome ?? ''),
      workExperience: String(saved?.workExperience ?? ''),
      employmentStartDate: saved?.employmentStartDate ?? '',
    },
  })

  const employmentType = watch('employmentType')
  const showsEmployer = SHOWS_EMPLOYER.includes(employmentType)
  const showsBusiness = SHOWS_BUSINESS.includes(employmentType)
  const showsIncome = SHOWS_INCOME.includes(employmentType)

  const onSubmit = (data: FormData) => {
    updateFormData('employmentInfo', data)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Employment &amp; Income</h2>

      <div className="space-y-5">
        <div>
          <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700 mb-1">
            Employment Type <span className="text-red-600">*</span>
          </label>
          <Select
            id="employmentType"
            aria-label="Employment Type"
            hasError={!!errors.employmentType}
            options={employmentTypeOptions}
            placeholder="Select employment type"
            {...register('employmentType')}
          />
          {errors.employmentType && (
            <p role="alert" className="mt-1 text-xs text-red-600">{errors.employmentType.message}</p>
          )}
        </div>

        {showsEmployer && (
          <>
            <div>
              <Input.Label htmlFor="employerName" required>Employer Name</Input.Label>
              <Input.Field
                id="employerName"
                placeholder="Enter employer name"
                hasError={!!errors.employerName}
                {...register('employerName')}
              />
            </div>
            <div>
              <Input.Label htmlFor="jobTitle" required>Job Title / Designation</Input.Label>
              <Input.Field
                id="jobTitle"
                placeholder="Enter job title"
                hasError={!!errors.jobTitle}
                {...register('jobTitle')}
              />
            </div>
          </>
        )}

        {showsBusiness && (
          <div>
            <Input.Label htmlFor="businessName" required>Business / Firm Name</Input.Label>
            <Input.Field
              id="businessName"
              placeholder="Enter business name"
              hasError={!!errors.businessName}
              {...register('businessName')}
            />
          </div>
        )}

        {showsIncome && (
          <>
            <div>
              <Input.Label htmlFor="monthlyGrossIncome" required>Monthly Gross Income</Input.Label>
              <Input.Field
                id="monthlyGrossIncome"
                type="number"
                placeholder="0"
                hasError={!!errors.monthlyGrossIncome}
                {...register('monthlyGrossIncome')}
              />
            </div>
            <div>
              <Input.Label htmlFor="monthlyNetIncome" required>Monthly Net Income</Input.Label>
              <Input.Field
                id="monthlyNetIncome"
                type="number"
                placeholder="0"
                hasError={!!errors.monthlyNetIncome}
                {...register('monthlyNetIncome')}
              />
            </div>
          </>
        )}

        {employmentType && (
          <div>
            <Input.Label htmlFor="workExperience">Work Experience (years)</Input.Label>
            <Input.Field
              id="workExperience"
              type="number"
              placeholder="0"
              {...register('workExperience')}
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          className="flex-1 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Continue
        </button>
      </div>
    </form>
  )
}
