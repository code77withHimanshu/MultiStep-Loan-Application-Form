import { useState } from 'react'
import { useForm } from '../../context/FormContext.jsx'
import { validatePersonalInfo } from '../../utils/validators.js'
import FormField from '../FormField.jsx'

export default function PersonalInfo() {
  const { formData, updateFormData, nextStep } = useForm()
  const [data, setData] = useState(formData.personalInfo)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    const updatedValue = name === 'panNumber' ? value.toUpperCase() : value
    setData(prev => ({ ...prev, [name]: updatedValue }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleNext = () => {
    const validationErrors = validatePersonalInfo(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      const firstErrorKey = Object.keys(validationErrors)[0]
      document.getElementsByName(firstErrorKey)[0]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    updateFormData('personalInfo', data)
    nextStep()
  }

  const maxDOB = new Date()
  maxDOB.setFullYear(maxDOB.getFullYear() - 18)
  const minDOB = new Date()
  minDOB.setFullYear(minDOB.getFullYear() - 70)

  return (
    <>
      <div className="step-content">
        <div className="step-heading">
          <h2>Personal Information</h2>
          <p>Please provide your personal details exactly as they appear on your official documents.</p>
        </div>

        <div className="form-grid">
          <FormField label="First Name" required error={errors.firstName}>
            <input
              className={`form-input ${errors.firstName ? 'has-error' : ''}`}
              type="text"
              name="firstName"
              value={data.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              autoComplete="given-name"
            />
          </FormField>

          <FormField label="Last Name" required error={errors.lastName}>
            <input
              className={`form-input ${errors.lastName ? 'has-error' : ''}`}
              type="text"
              name="lastName"
              value={data.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              autoComplete="family-name"
            />
          </FormField>

          <FormField label="Email Address" required error={errors.email}>
            <input
              className={`form-input ${errors.email ? 'has-error' : ''}`}
              type="email"
              name="email"
              value={data.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </FormField>

          <FormField label="Mobile Number" required error={errors.phone} hint="10-digit Indian mobile number">
            <div className="input-with-prefix">
              <span className="input-prefix">+91</span>
              <input
                className={`form-input ${errors.phone ? 'has-error' : ''}`}
                type="tel"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                placeholder="9876543210"
                maxLength={10}
                autoComplete="tel"
              />
            </div>
          </FormField>

          <FormField label="Date of Birth" required error={errors.dateOfBirth}>
            <input
              className={`form-input ${errors.dateOfBirth ? 'has-error' : ''}`}
              type="date"
              name="dateOfBirth"
              value={data.dateOfBirth}
              onChange={handleChange}
              max={maxDOB.toISOString().split('T')[0]}
              min={minDOB.toISOString().split('T')[0]}
            />
          </FormField>

          <FormField label="Gender" required error={errors.gender}>
            <select
              className={`form-select ${errors.gender ? 'has-error' : ''}`}
              name="gender"
              value={data.gender}
              onChange={handleChange}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </FormField>

          <FormField label="Marital Status" required error={errors.maritalStatus}>
            <select
              className={`form-select ${errors.maritalStatus ? 'has-error' : ''}`}
              name="maritalStatus"
              value={data.maritalStatus}
              onChange={handleChange}
            >
              <option value="">Select marital status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="separated">Separated</option>
            </select>
          </FormField>

          <FormField label="Nationality" required>
            <select
              className="form-select"
              name="nationality"
              value={data.nationality}
              onChange={handleChange}
            >
              <option value="Indian">Indian</option>
              <option value="NRI">NRI (Non-Resident Indian)</option>
              <option value="OCI">OCI (Overseas Citizen of India)</option>
            </select>
          </FormField>

          <FormField
            label="PAN Number"
            required
            error={errors.panNumber}
            hint="Format: ABCDE1234F"
            className="col-span-2"
          >
            <input
              className={`form-input ${errors.panNumber ? 'has-error' : ''}`}
              type="text"
              name="panNumber"
              value={data.panNumber}
              onChange={handleChange}
              placeholder="ABCDE1234F"
              maxLength={10}
              style={{ textTransform: 'uppercase', maxWidth: '240px' }}
            />
          </FormField>
        </div>
      </div>

      <div className="step-nav">
        <button className="btn btn-secondary" disabled>
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
