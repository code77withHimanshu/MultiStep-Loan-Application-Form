import { useState } from 'react'
import { useFormStore } from '@/store/formStore'
import { addressInfoSchema, validateSchema } from '@/schemas'
import { INDIAN_STATES } from '@/utils/constants'
import FormField from '@/components/FormField'
import type { AddressInfo as AddressInfoType } from '@/types'

export default function AddressInfo() {
  const { formData, updateFormData, nextStep, prevStep } = useFormStore()
  const [data, setData] = useState<AddressInfoType>({ ...formData.addressInfo })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    const newValue = type === 'checkbox' ? checked : value
    setData((prev) => {
      const updated = { ...prev, [name]: newValue }
      if (name === 'sameAsPermanent' && checked) {
        updated.permanentAddressLine1 = prev.currentAddressLine1
        updated.permanentAddressLine2 = prev.currentAddressLine2
        updated.permanentCity = prev.currentCity
        updated.permanentState = prev.currentState
        updated.permanentZip = prev.currentZip
        updated.permanentCountry = prev.currentCountry
      }
      return updated
    })
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleNext = () => {
    const errs = validateSchema(addressInfoSchema, data)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    updateFormData('addressInfo', data)
    nextStep()
  }

  const handleBack = () => { updateFormData('addressInfo', data); prevStep() }

  return (
    <>
      <div className="px-10 py-9">
        <div className="mb-7">
          <h2 className="text-xl font-bold text-slate-900 mb-1.5">Address Information</h2>
          <p className="text-sm text-slate-500">Provide your current residential address and permanent address details.</p>
        </div>

        <div className="grid grid-cols-2 gap-5">
          <div className="section-divider">
            <span>Current Address</span>
          </div>

          <FormField label="Address Line 1" required error={errors.currentAddressLine1} className="col-span-2">
            <input className={`form-input ${errors.currentAddressLine1 ? 'has-error' : ''}`} type="text" name="currentAddressLine1" value={data.currentAddressLine1} onChange={handleChange} placeholder="House/Flat No., Building Name, Street" autoComplete="address-line1" />
          </FormField>

          <FormField label="Address Line 2" className="col-span-2">
            <input className="form-input" type="text" name="currentAddressLine2" value={data.currentAddressLine2} onChange={handleChange} placeholder="Locality, Landmark (optional)" autoComplete="address-line2" />
          </FormField>

          <FormField label="City" required error={errors.currentCity}>
            <input className={`form-input ${errors.currentCity ? 'has-error' : ''}`} type="text" name="currentCity" value={data.currentCity} onChange={handleChange} placeholder="Enter city" />
          </FormField>

          <FormField label="State" required error={errors.currentState}>
            <select className={`form-select ${errors.currentState ? 'has-error' : ''}`} name="currentState" value={data.currentState} onChange={handleChange}>
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </FormField>

          <FormField label="PIN Code" required error={errors.currentZip}>
            <input className={`form-input ${errors.currentZip ? 'has-error' : ''}`} type="text" name="currentZip" value={data.currentZip} onChange={handleChange} placeholder="6-digit PIN code" maxLength={6} />
          </FormField>

          <FormField label="Country">
            <select className="form-select" name="currentCountry" value={data.currentCountry} onChange={handleChange}>
              <option value="India">India</option>
            </select>
          </FormField>

          <div className="col-span-2">
            <label className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <input type="checkbox" name="sameAsPermanent" id="sameAsPermanent" checked={data.sameAsPermanent} onChange={handleChange} className="w-4 h-4 accent-blue-700 cursor-pointer" />
              <span className="text-sm font-medium text-slate-800">Permanent address is same as current address</span>
            </label>
          </div>

          {!data.sameAsPermanent && (
            <>
              <div className="section-divider">
                <span>Permanent Address</span>
              </div>

              <FormField label="Address Line 1" required error={errors.permanentAddressLine1} className="col-span-2">
                <input className={`form-input ${errors.permanentAddressLine1 ? 'has-error' : ''}`} type="text" name="permanentAddressLine1" value={data.permanentAddressLine1} onChange={handleChange} placeholder="House/Flat No., Building Name, Street" />
              </FormField>

              <FormField label="Address Line 2" className="col-span-2">
                <input className="form-input" type="text" name="permanentAddressLine2" value={data.permanentAddressLine2} onChange={handleChange} placeholder="Locality, Landmark (optional)" />
              </FormField>

              <FormField label="City" required error={errors.permanentCity}>
                <input className={`form-input ${errors.permanentCity ? 'has-error' : ''}`} type="text" name="permanentCity" value={data.permanentCity} onChange={handleChange} placeholder="Enter city" />
              </FormField>

              <FormField label="State" required error={errors.permanentState}>
                <select className={`form-select ${errors.permanentState ? 'has-error' : ''}`} name="permanentState" value={data.permanentState} onChange={handleChange}>
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </FormField>

              <FormField label="PIN Code" required error={errors.permanentZip}>
                <input className={`form-input ${errors.permanentZip ? 'has-error' : ''}`} type="text" name="permanentZip" value={data.permanentZip} onChange={handleChange} placeholder="6-digit PIN code" maxLength={6} />
              </FormField>

              <FormField label="Country">
                <select className="form-select" name="permanentCountry" value={data.permanentCountry} onChange={handleChange}>
                  <option value="India">India</option>
                </select>
              </FormField>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center px-10 py-6 border-t border-slate-200 bg-slate-50">
        <button className="btn-secondary" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6" /></svg>
          Back
        </button>
        <button className="btn-primary" onClick={handleNext}>
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6" /></svg>
        </button>
      </div>
    </>
  )
}
