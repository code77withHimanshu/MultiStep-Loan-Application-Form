import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStore } from '@/store/formStore'
import { step2Schema, type Step2Data } from '@/schemas/step2Schema'
import { GENDER_LABELS, MARITAL_STATUS_LABELS, MIN_AGE, MAX_AGE } from '@/utils/constants'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { RadioGroup } from '@/components/common/RadioGroup'

const genderOptions = Object.entries(GENDER_LABELS).map(([value, label]) => ({ value, label }))
const maritalOptions = Object.entries(MARITAL_STATUS_LABELS).map(([value, label]) => ({ value, label }))

const today = new Date()
const maxDate = new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate())
  .toISOString().split('T')[0]
const minDate = new Date(today.getFullYear() - MAX_AGE, today.getMonth(), today.getDate())
  .toISOString().split('T')[0]

interface Step2Props {
  onNext: (data: Step2Data) => void
  onPrev: () => void
}

export function Step2PersonalInfo({ onNext, onPrev }: Step2Props) {
  const { formData } = useFormStore()
  const saved = formData.personalInfo

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step2Data>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      fullName: saved?.fullName ?? '',
      dateOfBirth: saved?.dateOfBirth ?? '',
      gender: saved?.gender ?? undefined,
      maritalStatus: saved?.maritalStatus ?? undefined,
      fatherName: saved?.fatherName ?? '',
      motherName: saved?.motherName ?? '',
      email: saved?.email ?? '',
      mobileNumber: saved?.mobileNumber ?? '',
      alternateMobile: saved?.alternateMobile ?? '',
    },
  })

  const genderValue = watch('gender')
  const maritalValue = watch('maritalStatus')

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-5">
        <div>
          <Input.Label htmlFor="fullName" required>Full Name (as per Aadhaar)</Input.Label>
          <Input.Field
            id="fullName"
            placeholder="Enter your full name"
            hasError={!!errors.fullName}
            {...register('fullName')}
          />
          {errors.fullName && <Input.Error>{errors.fullName.message}</Input.Error>}
        </div>

        <div>
          <Input.Label htmlFor="dateOfBirth" required>Date of Birth</Input.Label>
          <Input.Field
            id="dateOfBirth"
            type="date"
            max={maxDate}
            min={minDate}
            hasError={!!errors.dateOfBirth}
            {...register('dateOfBirth')}
          />
          {errors.dateOfBirth
            ? <Input.Error>{errors.dateOfBirth.message}</Input.Error>
            : <Input.HelpText>Age must be between {MIN_AGE} and {MAX_AGE} years</Input.HelpText>
          }
        </div>

        <div>
          <Input.Label required>Gender</Input.Label>
          <RadioGroup
            name="gender"
            options={genderOptions}
            value={genderValue}
            onChange={(val) => setValue('gender', val as Step2Data['gender'], { shouldValidate: true })}
            hasError={!!errors.gender}
          />
          {errors.gender && <Input.Error>{errors.gender.message}</Input.Error>}
        </div>

        <div>
          <Input.Label htmlFor="maritalStatus" required>Marital Status</Input.Label>
          <Select
            id="maritalStatus"
            placeholder="Select marital status"
            options={maritalOptions}
            hasError={!!errors.maritalStatus}
            value={maritalValue ?? ''}
            onChange={(e) => setValue('maritalStatus', e.target.value as Step2Data['maritalStatus'], { shouldValidate: true })}
          />
          {errors.maritalStatus && <Input.Error>{errors.maritalStatus.message}</Input.Error>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input.Label htmlFor="fatherName" required>Father&apos;s Name</Input.Label>
            <Input.Field
              id="fatherName"
              placeholder="Enter father's full name"
              hasError={!!errors.fatherName}
              {...register('fatherName')}
            />
            {errors.fatherName && <Input.Error>{errors.fatherName.message}</Input.Error>}
          </div>
          <div>
            <Input.Label htmlFor="motherName" required>Mother&apos;s Name</Input.Label>
            <Input.Field
              id="motherName"
              placeholder="Enter mother's full name"
              hasError={!!errors.motherName}
              {...register('motherName')}
            />
            {errors.motherName && <Input.Error>{errors.motherName.message}</Input.Error>}
          </div>
        </div>

        <div>
          <Input.Label htmlFor="email" required>Email Address</Input.Label>
          <Input.Field
            id="email"
            type="email"
            placeholder="example@email.com"
            hasError={!!errors.email}
            {...register('email')}
          />
          {errors.email && <Input.Error>{errors.email.message}</Input.Error>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input.Label htmlFor="mobileNumber" required>Mobile Number</Input.Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">+91</span>
              <Input.Field
                id="mobileNumber"
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                hasError={!!errors.mobileNumber}
                className="pl-12"
                {...register('mobileNumber')}
              />
            </div>
            {errors.mobileNumber && <Input.Error>{errors.mobileNumber.message}</Input.Error>}
          </div>
          <div>
            <Input.Label htmlFor="alternateMobile">Alternate Mobile (Optional)</Input.Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm select-none">+91</span>
              <Input.Field
                id="alternateMobile"
                type="tel"
                placeholder="9876543210"
                maxLength={10}
                hasError={!!errors.alternateMobile}
                className="pl-12"
                {...register('alternateMobile')}
              />
            </div>
            {errors.alternateMobile && <Input.Error>{errors.alternateMobile.message}</Input.Error>}
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onPrev}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-8 py-2.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
    </form>
  )
}
