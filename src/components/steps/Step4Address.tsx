import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useFormStore } from '@/store/formStore'
import { step4Schema, type Step4Data } from '@/schemas/step4Schema'
import { usePinCodeLookup } from '@/hooks/usePinCodeLookup'
import { INDIAN_STATES, RESIDENCE_TYPE_LABELS } from '@/utils/constants'
import { Input } from '@/components/common/Input'
import { Select } from '@/components/common/Select'
import { Checkbox } from '@/components/common/Checkbox'
import { CurrencyInput } from '@/components/common/CurrencyInput'

const stateOptions = INDIAN_STATES.map((s) => ({ value: s, label: s }))
const residenceOptions = Object.entries(RESIDENCE_TYPE_LABELS).map(([value, label]) => ({ value, label }))

interface Step4Props {
  onNext: (data: Step4Data) => void
  onPrev: () => void
}

export function Step4Address({ onNext, onPrev }: Step4Props) {
  const { formData } = useFormStore()
  const saved = formData.addressInfo

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step4Data>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      currentAddressLine1: saved?.currentAddressLine1 ?? '',
      currentAddressLine2: saved?.currentAddressLine2 ?? '',
      currentPinCode: saved?.currentPinCode ?? '',
      currentCity: saved?.currentCity ?? '',
      currentState: saved?.currentState ?? '',
      currentPostOffice: saved?.currentPostOffice ?? '',
      currentResidenceType: saved?.currentResidenceType ?? undefined,
      currentRentAmount: saved?.currentRentAmount ?? undefined,
      yearsAtCurrentAddress: saved?.yearsAtCurrentAddress ?? undefined,
      sameAsPermanent: saved?.sameAsPermanent ?? true,
      permanentAddressLine1: saved?.permanentAddressLine1 ?? '',
      permanentAddressLine2: saved?.permanentAddressLine2 ?? '',
      permanentPinCode: saved?.permanentPinCode ?? '',
      permanentCity: saved?.permanentCity ?? '',
      permanentState: saved?.permanentState ?? '',
    },
  })

  const pinCode = watch('currentPinCode')
  const residenceType = watch('currentResidenceType')
  const sameAsPermanent = watch('sameAsPermanent')
  const { city, state, postOffice, isLoading, error: pinError } = usePinCodeLookup(pinCode)

  useEffect(() => {
    if (city) setValue('currentCity', city, { shouldValidate: true })
    if (state) setValue('currentState', state, { shouldValidate: true })
    if (postOffice) setValue('currentPostOffice', postOffice)
  }, [city, state, postOffice, setValue])

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="space-y-5">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Current Address</h3>

        <div>
          <Input.Label htmlFor="currentAddressLine1" required>Address Line 1</Input.Label>
          <Input.Field
            id="currentAddressLine1"
            placeholder="House/Flat No., Building Name, Street"
            hasError={!!errors.currentAddressLine1}
            {...register('currentAddressLine1')}
          />
          {errors.currentAddressLine1 && <Input.Error>{errors.currentAddressLine1.message}</Input.Error>}
        </div>

        <div>
          <Input.Label htmlFor="currentAddressLine2">Address Line 2 (Optional)</Input.Label>
          <Input.Field
            id="currentAddressLine2"
            placeholder="Area, Landmark"
            {...register('currentAddressLine2')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <Input.Label htmlFor="currentPinCode" required>PIN Code</Input.Label>
            <Input.Field
              id="currentPinCode"
              placeholder="6-digit PIN"
              maxLength={6}
              inputMode="numeric"
              hasError={!!errors.currentPinCode}
              {...register('currentPinCode')}
            />
            {errors.currentPinCode && <Input.Error>{errors.currentPinCode.message}</Input.Error>}
            {isLoading && <Input.HelpText>Looking up PIN code...</Input.HelpText>}
            {pinError && <Input.HelpText>{pinError}</Input.HelpText>}
          </div>
          <div>
            <Input.Label htmlFor="currentCity" required>City</Input.Label>
            <Input.Field
              id="currentCity"
              placeholder="City"
              hasError={!!errors.currentCity}
              readOnly={!!city}
              className={city ? 'bg-green-50 border-green-300' : ''}
              {...register('currentCity')}
            />
            {errors.currentCity && <Input.Error>{errors.currentCity.message}</Input.Error>}
          </div>
          <div>
            <Input.Label htmlFor="currentState" required>State</Input.Label>
            <Select
              id="currentState"
              placeholder="Select state"
              options={stateOptions}
              hasError={!!errors.currentState}
              value={watch('currentState')}
              onChange={(e) => setValue('currentState', e.target.value, { shouldValidate: true })}
              className={state ? 'bg-green-50 border-green-300' : ''}
            />
            {errors.currentState && <Input.Error>{errors.currentState.message}</Input.Error>}
          </div>
        </div>

        {postOffice && (
          <Input.HelpText>Post Office: {postOffice}</Input.HelpText>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Input.Label htmlFor="currentResidenceType" required>Residence Type</Input.Label>
            <Select
              id="currentResidenceType"
              placeholder="Select residence type"
              options={residenceOptions}
              hasError={!!errors.currentResidenceType}
              value={watch('currentResidenceType') ?? ''}
              onChange={(e) => setValue('currentResidenceType', e.target.value as Step4Data['currentResidenceType'], { shouldValidate: true })}
            />
            {errors.currentResidenceType && <Input.Error>{errors.currentResidenceType.message}</Input.Error>}
          </div>
          {residenceType === 'rented' && (
            <div>
              <Input.Label htmlFor="currentRentAmount" required>Monthly Rent Amount</Input.Label>
              <Controller
                name="currentRentAmount"
                control={control}
                render={({ field }) => (
                  <CurrencyInput
                    id="currentRentAmount"
                    value={field.value ?? ''}
                    onChange={(val) => field.onChange(val)}
                    hasError={!!errors.currentRentAmount}
                    placeholder="Monthly rent"
                  />
                )}
              />
              {errors.currentRentAmount && <Input.Error>{errors.currentRentAmount.message}</Input.Error>}
            </div>
          )}
        </div>

        <div>
          <Input.Label htmlFor="yearsAtCurrentAddress" required>Years at Current Address</Input.Label>
          <Input.Field
            id="yearsAtCurrentAddress"
            type="number"
            min="0"
            max="99"
            placeholder="0"
            hasError={!!errors.yearsAtCurrentAddress}
            {...register('yearsAtCurrentAddress', { valueAsNumber: true })}
          />
          {errors.yearsAtCurrentAddress && <Input.Error>{errors.yearsAtCurrentAddress.message}</Input.Error>}
        </div>

        <div className="border-t border-gray-200 pt-4">
          <Controller
            name="sameAsPermanent"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="sameAsPermanent"
                label="Permanent address is same as current address"
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
              />
            )}
          />
        </div>

        {!sameAsPermanent && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Permanent Address</h3>
            <div>
              <Input.Label htmlFor="permanentAddressLine1" required>Address Line 1</Input.Label>
              <Input.Field
                id="permanentAddressLine1"
                placeholder="House/Flat No., Building Name, Street"
                hasError={!!errors.permanentAddressLine1}
                {...register('permanentAddressLine1')}
              />
              {errors.permanentAddressLine1 && <Input.Error>{errors.permanentAddressLine1.message}</Input.Error>}
            </div>
            <div>
              <Input.Label htmlFor="permanentAddressLine2">Address Line 2 (Optional)</Input.Label>
              <Input.Field
                id="permanentAddressLine2"
                placeholder="Area, Landmark"
                {...register('permanentAddressLine2')}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Input.Label htmlFor="permanentPinCode" required>PIN Code</Input.Label>
                <Input.Field
                  id="permanentPinCode"
                  placeholder="6-digit PIN"
                  maxLength={6}
                  inputMode="numeric"
                  hasError={!!errors.permanentPinCode}
                  {...register('permanentPinCode')}
                />
                {errors.permanentPinCode && <Input.Error>{errors.permanentPinCode.message}</Input.Error>}
              </div>
              <div>
                <Input.Label htmlFor="permanentCity" required>City</Input.Label>
                <Input.Field
                  id="permanentCity"
                  placeholder="City"
                  hasError={!!errors.permanentCity}
                  {...register('permanentCity')}
                />
                {errors.permanentCity && <Input.Error>{errors.permanentCity.message}</Input.Error>}
              </div>
              <div>
                <Input.Label htmlFor="permanentState" required>State</Input.Label>
                <Select
                  id="permanentState"
                  placeholder="Select state"
                  options={stateOptions}
                  hasError={!!errors.permanentState}
                  value={watch('permanentState') ?? ''}
                  onChange={(e) => setValue('permanentState', e.target.value, { shouldValidate: true })}
                />
                {errors.permanentState && <Input.Error>{errors.permanentState.message}</Input.Error>}
              </div>
            </div>
          </div>
        )}

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
