import { useState } from 'react'
import { useForm } from '../../context/FormContext.jsx'
import { validateAddressInfo, INDIAN_STATES } from '../../utils/validators.js'
import FormField from '../FormField.jsx'

export default function AddressInfo() {
  const { formData, updateFormData, nextStep, prevStep } = useForm()
  const [data, setData] = useState(formData.addressInfo)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    const newValue = type === 'checkbox' ? checked : value
    setData(prev => {
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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleNext = () => {
    const validationErrors = validateAddressInfo(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    updateFormData('addressInfo', data)
    nextStep()
  }

  const handleBack = () => {
    updateFormData('addressInfo', data)
    prevStep()
  }

  return (
    <>
      <div className="step-content">
        <div className="step-heading">
          <h2>Address Information</h2>
          <p>Provide your current residential address and permanent address details.</p>
        </div>

        <div className="form-grid">
          <div className="section-divider col-span-2">
            <span>Current Address</span>
          </div>

          <FormField label="Address Line 1" required error={errors.currentAddressLine1} className="col-span-2">
            <input
              className={`form-input ${errors.currentAddressLine1 ? 'has-error' : ''}`}
              type="text"
              name="currentAddressLine1"
              value={data.currentAddressLine1}
              onChange={handleChange}
              placeholder="House/Flat No., Building Name, Street"
              autoComplete="address-line1"
            />
          </FormField>

          <FormField label="Address Line 2" className="col-span-2">
            <input
              className="form-input"
              type="text"
              name="currentAddressLine2"
              value={data.currentAddressLine2}
              onChange={handleChange}
              placeholder="Locality, Landmark (optional)"
              autoComplete="address-line2"
            />
          </FormField>

          <FormField label="City" required error={errors.currentCity}>
            <input
              className={`form-input ${errors.currentCity ? 'has-error' : ''}`}
              type="text"
              name="currentCity"
              value={data.currentCity}
              onChange={handleChange}
              placeholder="Enter city"
              autoComplete="address-level2"
            />
          </FormField>

          <FormField label="State" required error={errors.currentState}>
            <select
              className={`form-select ${errors.currentState ? 'has-error' : ''}`}
              name="currentState"
              value={data.currentState}
              onChange={handleChange}
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </FormField>

          <FormField label="PIN Code" required error={errors.currentZip}>
            <input
              className={`form-input ${errors.currentZip ? 'has-error' : ''}`}
              type="text"
              name="currentZip"
              value={data.currentZip}
              onChange={handleChange}
              placeholder="6-digit PIN code"
              maxLength={6}
            />
          </FormField>

          <FormField label="Country">
            <select
              className="form-select"
              name="currentCountry"
              value={data.currentCountry}
              onChange={handleChange}
            >
              <option value="India">India</option>
            </select>
          </FormField>

          <div className="col-span-2">
            <div className="checkbox-field">
              <input
                type="checkbox"
                id="sameAsPermanent"
                name="sameAsPermanent"
                checked={data.sameAsPermanent}
                onChange={handleChange}
              />
              <label htmlFor="sameAsPermanent">Permanent address is same as current address</label>
            </div>
          </div>

          {!data.sameAsPermanent && (
            <>
              <div className="section-divider col-span-2">
                <span>Permanent Address</span>
              </div>

              <FormField label="Address Line 1" required error={errors.permanentAddressLine1} className="col-span-2">
                <input
                  className={`form-input ${errors.permanentAddressLine1 ? 'has-error' : ''}`}
                  type="text"
                  name="permanentAddressLine1"
                  value={data.permanentAddressLine1}
                  onChange={handleChange}
                  placeholder="House/Flat No., Building Name, Street"
                />
              </FormField>

              <FormField label="Address Line 2" className="col-span-2">
                <input
                  className="form-input"
                  type="text"
                  name="permanentAddressLine2"
                  value={data.permanentAddressLine2}
                  onChange={handleChange}
                  placeholder="Locality, Landmark (optional)"
                />
              </FormField>

              <FormField label="City" required error={errors.permanentCity}>
                <input
                  className={`form-input ${errors.permanentCity ? 'has-error' : ''}`}
                  type="text"
                  name="permanentCity"
                  value={data.permanentCity}
                  onChange={handleChange}
                  placeholder="Enter city"
                />
              </FormField>

              <FormField label="State" required error={errors.permanentState}>
                <select
                  className={`form-select ${errors.permanentState ? 'has-error' : ''}`}
                  name="permanentState"
                  value={data.permanentState}
                  onChange={handleChange}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </FormField>

              <FormField label="PIN Code" required error={errors.permanentZip}>
                <input
                  className={`form-input ${errors.permanentZip ? 'has-error' : ''}`}
                  type="text"
                  name="permanentZip"
                  value={data.permanentZip}
                  onChange={handleChange}
                  placeholder="6-digit PIN code"
                  maxLength={6}
                />
              </FormField>

              <FormField label="Country">
                <select
                  className="form-select"
                  name="permanentCountry"
                  value={data.permanentCountry}
                  onChange={handleChange}
                >
                  <option value="India">India</option>
                </select>
              </FormField>
            </>
          )}
        </div>
      </div>

      <div className="step-nav">
        <button className="btn btn-secondary" onClick={handleBack}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
        <button className="btn btn-primary" onClick={handleNext}>
          Continue
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </>
  )
}
