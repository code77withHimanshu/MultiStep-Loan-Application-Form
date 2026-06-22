import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFormStore } from '@/store/formStore'
import { step5Schema, type Step5Data } from '@/schemas/step5Schema'
import { BUSINESS_TYPES, EMPLOYMENT_TYPE_LABELS } from '@/utils/constants'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { RadioGroup } from '@/components/common/RadioGroup'
import { CurrencyInput } from '@/components/common/CurrencyInput'

const employmentOptions = Object.entries(EMPLOYMENT_TYPE_LABELS).map(([value, label]) => ({ value, label }))
const businessTypeOptions = BUSINESS_TYPES.map((b) => ({ value: b, label: b }))

interface Step5Props {
  onNext: (data: Step5Data) => void
  onPrev: () => void
}

export function Step5Employment({ onNext, onPrev }: Step5Props) {
  const { formData } = useFormStore()
  const saved = formData.employmentInfo

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<Step5Data>({
    resolver: zodResolver(step5Schema),
    defaultValues: saved?.employmentType
      ? (saved as Step5Data)
      : { employmentType: 'salaried' },
  })

  const employmentType = useWatch({ control, name: 'employmentType' })

  const fieldErrors = errors as Record<string, { message?: string }>

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-5">
        <div>
          <Input.Label required>Employment Type</Input.Label>
          <Controller
            name="employmentType"
            control={control}
            render={({ field }) => (
              <RadioGroup
                name="employmentType"
                options={employmentOptions}
                value={field.value}
                onChange={(val) => {
                  field.onChange(val)
                  setValue('employmentType', val as Step5Data['employmentType'])
                }}
                hasError={!!errors.employmentType}
              />
            )}
          />
          {errors.employmentType && <Input.Error>{errors.employmentType.message}</Input.Error>}
        </div>

        {employmentType === 'salaried' && (
          <>
            <div>
              <Input.Label htmlFor="companyName" required>Company Name</Input.Label>
              <Input.Field
                id="companyName"
                placeholder="Name of employer"
                hasError={!!fieldErrors.companyName}
                {...register('companyName' as keyof Step5Data)}
              />
              {fieldErrors.companyName && <Input.Error>{fieldErrors.companyName.message}</Input.Error>}
            </div>
            <div>
              <Input.Label htmlFor="designation" required>Designation</Input.Label>
              <Input.Field
                id="designation"
                placeholder="Your job title"
                hasError={!!fieldErrors.designation}
                {...register('designation' as keyof Step5Data)}
              />
              {fieldErrors.designation && <Input.Error>{fieldErrors.designation.message}</Input.Error>}
            </div>
            <div>
              <Input.Label htmlFor="monthlyNetSalary" required>Monthly Net Salary (min ₹15,000)</Input.Label>
              <Controller
                name={'monthlyNetSalary' as keyof Step5Data}
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="monthlyNetSalary"
                    value={field.value as number | ''}
                    onChange={(val) => field.onChange(val)}
                    hasError={!!fieldErrors.monthlyNetSalary}
                    placeholder="Net take-home salary"
                  />
                )}
              />
              {fieldErrors.monthlyNetSalary && <Input.Error>{fieldErrors.monthlyNetSalary.message}</Input.Error>}
            </div>
          </>
        )}

        {(employmentType === 'self_employed' || employmentType === 'business_owner') && (
          <>
            <div>
              <Input.Label htmlFor="businessName" required>Business Name</Input.Label>
              <Input.Field
                id="businessName"
                placeholder="Registered business name"
                hasError={!!fieldErrors.businessName}
                {...register('businessName' as keyof Step5Data)}
              />
              {fieldErrors.businessName && <Input.Error>{fieldErrors.businessName.message}</Input.Error>}
            </div>
            <div>
              <Input.Label htmlFor="businessType" required>Business Type</Input.Label>
              <Select
                id="businessType"
                placeholder="Select business type"
                options={businessTypeOptions}
                hasError={!!fieldErrors.businessType}
                {...register('businessType' as keyof Step5Data)}
              />
              {fieldErrors.businessType && <Input.Error>{fieldErrors.businessType.message}</Input.Error>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input.Label htmlFor="annualTurnover" required>Annual Turnover (min ₹3,00,000)</Input.Label>
                <Controller
                  name={'annualTurnover' as keyof Step5Data}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="annualTurnover"
                      value={field.value as number | ''}
                      onChange={(val) => field.onChange(val)}
                      hasError={!!fieldErrors.annualTurnover}
                      placeholder="Annual business turnover"
                    />
                  )}
                />
                {fieldErrors.annualTurnover && <Input.Error>{fieldErrors.annualTurnover.message}</Input.Error>}
              </div>
              <div>
                <Input.Label htmlFor="monthlyIncome" required>Monthly Income</Input.Label>
                <Controller
                  name={'monthlyIncome' as keyof Step5Data}
                  control={control}
                  render={({ field }) => (
                    <CurrencyInput
                      id="monthlyIncome"
                      value={field.value as number | ''}
                      onChange={(val) => field.onChange(val)}
                      hasError={!!fieldErrors.monthlyIncome}
                      placeholder="Monthly take-home income"
                    />
                  )}
                />
                {fieldErrors.monthlyIncome && <Input.Error>{fieldErrors.monthlyIncome.message}</Input.Error>}
              </div>
            </div>
            <div>
              <Input.Label htmlFor="yearsInBusiness" required>Years in Business (min 2)</Input.Label>
              <Input.Field
                id="yearsInBusiness"
                type="number"
                min="0"
                placeholder="Number of years"
                hasError={!!fieldErrors.yearsInBusiness}
                {...register('yearsInBusiness' as keyof Step5Data, { valueAsNumber: true })}
              />
              {fieldErrors.yearsInBusiness && <Input.Error>{fieldErrors.yearsInBusiness.message}</Input.Error>}
            </div>
          </>
        )}

        {employmentType === 'business_owner' && (
          <div>
            <Input.Label htmlFor="gstNumber">GST Number (Optional)</Input.Label>
            <Input.Field
              id="gstNumber"
              placeholder="15-character GST number"
              maxLength={15}
              hasError={!!fieldErrors.gstNumber}
              {...register('gstNumber' as keyof Step5Data)}
              className="uppercase font-mono"
            />
            {fieldErrors.gstNumber && <Input.Error>{fieldErrors.gstNumber.message}</Input.Error>}
          </div>
        )}

        <div>
          <Input.Label htmlFor="yearsOfExperience" required>Total Work Experience (years)</Input.Label>
          <Input.Field
            id="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            placeholder="Total years of experience"
            hasError={!!fieldErrors.yearsOfExperience}
            {...register('yearsOfExperience' as keyof Step5Data, { valueAsNumber: true })}
          />
          {fieldErrors.yearsOfExperience && <Input.Error>{fieldErrors.yearsOfExperience.message}</Input.Error>}
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
