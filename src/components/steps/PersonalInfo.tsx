import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'

const schema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Gender is required' }),
  maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed'], {
    required_error: 'Marital status is required',
  }),
  panNumber: z.string().regex(/^[A-Z]{5}\d{4}[A-Z]$/, 'Enter valid PAN (e.g. ABCDE1234F)'),
})

type FormData = z.infer<typeof schema>

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
]

const maritalOptions = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
]

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1">
      {children} <span className="text-red-600" aria-hidden="true">*</span>
    </label>
  )
}

export default function PersonalInfo() {
  const { currentStep, formData, updateFormData, nextStep, prevStep } = useFormStore()
  const saved = formData.personalInfo

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: saved?.firstName ?? '',
      lastName: saved?.lastName ?? '',
      email: saved?.email ?? '',
      phone: saved?.phone ?? '',
      dateOfBirth: saved?.dateOfBirth ?? '',
      gender: (saved?.gender as FormData['gender']) ?? undefined,
      maritalStatus: (saved?.maritalStatus as FormData['maritalStatus']) ?? undefined,
      panNumber: saved?.panNumber ?? '',
    },
  })

  const onSubmit = (data: FormData) => {
    updateFormData('personalInfo', data)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Personal Information</h2>

      <div className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FieldLabel htmlFor="firstName">First Name</FieldLabel>
            <Input.Field
              id="firstName"
              placeholder="Enter your first name"
              hasError={!!errors.firstName}
              {...register('firstName')}
            />
            {errors.firstName && (
              <Input.Error>{errors.firstName.message}</Input.Error>
            )}
          </div>
          <div>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input.Field
              id="lastName"
              placeholder="Enter your last name"
              hasError={!!errors.lastName}
              {...register('lastName')}
            />
            {errors.lastName && (
              <Input.Error>{errors.lastName.message}</Input.Error>
            )}
          </div>
        </div>

        <div>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input.Field
            id="email"
            type="email"
            placeholder="you@example.com"
            hasError={!!errors.email}
            {...register('email')}
          />
          {errors.email && <Input.Error>{errors.email.message}</Input.Error>}
        </div>

        <div>
          <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
          <Input.Field
            id="phone"
            type="tel"
            placeholder="9876543210"
            hasError={!!errors.phone}
            {...register('phone')}
          />
          {errors.phone && <Input.Error>{errors.phone.message}</Input.Error>}
        </div>

        <div>
          <FieldLabel htmlFor="dateOfBirth">Date of Birth</FieldLabel>
          <Input.Field
            id="dateOfBirth"
            type="date"
            hasError={!!errors.dateOfBirth}
            {...register('dateOfBirth')}
          />
          {errors.dateOfBirth && <Input.Error>{errors.dateOfBirth.message}</Input.Error>}
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
            Gender <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <Select
            id="gender"
            hasError={!!errors.gender}
            options={genderOptions}
            placeholder="Select gender"
            {...register('gender')}
          />
          {errors.gender && <Input.Error>{errors.gender.message}</Input.Error>}
        </div>

        <div>
          <label htmlFor="maritalStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Marital Status <span className="text-red-600" aria-hidden="true">*</span>
          </label>
          <Select
            id="maritalStatus"
            hasError={!!errors.maritalStatus}
            options={maritalOptions}
            placeholder="Select marital status"
            {...register('maritalStatus')}
          />
          {errors.maritalStatus && <Input.Error>{errors.maritalStatus.message}</Input.Error>}
        </div>

        <div>
          <FieldLabel htmlFor="panNumber">PAN Number</FieldLabel>
          <Input.Field
            id="panNumber"
            placeholder="ABCDE1234F"
            hasError={!!errors.panNumber}
            {...register('panNumber', {
              onChange: (e) => {
                setValue('panNumber', (e.target.value as string).toUpperCase(), {
                  shouldValidate: true,
                })
              },
            })}
          />
          {errors.panNumber && <Input.Error>{errors.panNumber.message}</Input.Error>}
        </div>
      </div>

      <div className="flex gap-3 mt-8">
        <button
          type="button"
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
