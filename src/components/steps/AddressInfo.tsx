import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useFormStore } from '@/store/formStore'
import { Input } from '@/components/common/Input'

const schema = z.object({
  currentAddressLine1: z.string().min(1, 'Address is required'),
  currentAddressLine2: z.string().optional(),
  currentZip: z.string().regex(/^\d{6}$/, 'Enter a valid 6-digit PIN code'),
  currentCity: z.string().min(1, 'City is required'),
  currentState: z.string().min(1, 'State is required'),
  sameAsPermanent: z.boolean(),
  permanentAddressLine1: z.string().optional(),
  permanentZip: z.string().optional(),
  permanentCity: z.string().optional(),
  permanentState: z.string().optional(),
})

type FormData = z.infer<typeof schema>

export default function AddressInfo() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore()
  const saved = formData.addressInfo

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      currentAddressLine1: saved?.currentAddressLine1 ?? '',
      currentAddressLine2: saved?.currentAddressLine2 ?? '',
      currentZip: saved?.currentZip ?? saved?.currentPinCode ?? '',
      currentCity: saved?.currentCity ?? '',
      currentState: saved?.currentState ?? '',
      sameAsPermanent: saved?.sameAsPermanent ?? false,
      permanentAddressLine1: saved?.permanentAddressLine1 ?? '',
      permanentZip: saved?.permanentPinCode ?? '',
      permanentCity: saved?.permanentCity ?? '',
      permanentState: saved?.permanentState ?? '',
    },
  })

  const sameAsPermanent = watch('sameAsPermanent')

  const onSubmit = (data: FormData) => {
    updateFormData('addressInfo', {
      currentAddressLine1: data.currentAddressLine1,
      currentAddressLine2: data.currentAddressLine2,
      currentZip: data.currentZip,
      currentPinCode: data.currentZip,
      currentCity: data.currentCity,
      currentState: data.currentState,
      sameAsPermanent: data.sameAsPermanent,
      permanentAddressLine1: data.permanentAddressLine1,
      permanentPinCode: data.permanentZip,
      permanentCity: data.permanentCity,
      permanentState: data.permanentState,
    })
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className="text-lg font-semibold text-gray-800 mb-5">Address Information</h2>

      <div className="space-y-5">
        <div>
          <Input.Label htmlFor="currentAddressLine1" required>Address Line 1</Input.Label>
          <Input.Field
            id="currentAddressLine1"
            placeholder="House/Flat No., Building Name, Street"
            hasError={!!errors.currentAddressLine1}
            {...register('currentAddressLine1')}
          />
          {errors.currentAddressLine1 && (
            <Input.Error>{errors.currentAddressLine1.message}</Input.Error>
          )}
        </div>

        <div>
          <Input.Label htmlFor="currentAddressLine2">Address Line 2</Input.Label>
          <Input.Field
            id="currentAddressLine2"
            placeholder="Locality, Area (optional)"
            {...register('currentAddressLine2')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Input.Label htmlFor="currentZip" required>PIN Code</Input.Label>
            <Input.Field
              id="currentZip"
              placeholder="6-digit PIN code"
              hasError={!!errors.currentZip}
              {...register('currentZip')}
            />
            {errors.currentZip && <Input.Error>{errors.currentZip.message}</Input.Error>}
          </div>

          <div>
            <Input.Label htmlFor="currentCity" required>City</Input.Label>
            <Input.Field
              id="currentCity"
              placeholder="City"
              hasError={!!errors.currentCity}
              {...register('currentCity')}
            />
            {errors.currentCity && <Input.Error>{errors.currentCity.message}</Input.Error>}
          </div>
        </div>

        <div>
          <Input.Label htmlFor="currentState" required>State</Input.Label>
          <Input.Field
            id="currentState"
            placeholder="State"
            hasError={!!errors.currentState}
            {...register('currentState')}
          />
          {errors.currentState && <Input.Error>{errors.currentState.message}</Input.Error>}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-primary focus:ring-primary"
            {...register('sameAsPermanent')}
          />
          <span className="text-sm text-gray-700">Same as current address</span>
        </label>

        {!sameAsPermanent && (
          <div className="space-y-4 border-t border-gray-100 pt-4">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
              Permanent Address
            </h3>

            <div>
              <Input.Label htmlFor="permanentAddressLine1">Address Line 1</Input.Label>
              <Input.Field
                id="permanentAddressLine1"
                placeholder="House/Flat No., Building Name, Street"
                {...register('permanentAddressLine1')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input.Label htmlFor="permanentZip">PIN Code</Input.Label>
                <Input.Field
                  id="permanentZip"
                  placeholder="6-digit PIN code"
                  {...register('permanentZip')}
                />
              </div>
              <div>
                <Input.Label htmlFor="permanentCity">City</Input.Label>
                <Input.Field
                  id="permanentCity"
                  placeholder="City"
                  {...register('permanentCity')}
                />
              </div>
            </div>

            <div>
              <Input.Label htmlFor="permanentState">State</Input.Label>
              <Input.Field
                id="permanentState"
                placeholder="State"
                {...register('permanentState')}
              />
            </div>
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
