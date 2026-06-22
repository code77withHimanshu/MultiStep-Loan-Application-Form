import { useState } from 'react'
import { useForm } from '../../context/FormContext.jsx'
import { validateEmploymentInfo } from '../../utils/validators.js'
import FormField from '../FormField.jsx'

export default function EmploymentInfo() {
  const { formData, updateFormData, nextStep, prevStep } = useForm()
  const [data, setData] = useState(formData.employmentInfo)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const handleNext = () => {
    const validationErrors = validateEmploymentInfo(data)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    updateFormData('employmentInfo', data)
    nextStep()
  }

  const handleBack = () => {
    updateFormData('employmentInfo', data)
    prevStep()
  }

  const isRetired = data.employmentType === 'retired'
  const maxStartDate = new Date().toISOString().split('T')[0]

  const employerLabel = {
    salaried: 'Employer Name',
    self_employed: 'Business / Firm Name',
    business: 'Company / Business Name',
    retired: '',
  }[data.employmentType] || 'Employer / Business Name'

  const jobTitleLabel = {
    salaried: 'Job Title / Designation',
    self_employed: 'Nature of Business',
    business: 'Role / Position',
    retired: '',
  }[data.employmentType] || 'Job Title / Designation'

  return (
    <>
      <div className="step-content">
        <div className="step-heading">
          <h2>Employment &amp; Income</h2>
          <p>Your employment details help us assess your loan eligibility and repayment capacity.</p>
        </div>

        <div className="form-grid">
          <FormField label="Employment Type" required error={errors.employmentType} className="col-span-2">
            <select
              className={`form-select ${errors.employmentType ? 'has-error' : ''}`}
              name="employmentType"
              value={data.employmentType}
              onChange={handleChange}
            >
              <option value="">Select employment type</option>
              <option value="salaried">Salaried Employee</option>
              <option value="self_employed">Self-Employed / Freelancer</option>
              <option value="business">Business Owner</option>
              <option value="retired">Retired</option>
            </select>
          </FormField>

          {data.employmentType && !isRetired && (
            <>
              <FormField label={employerLabel} required error={errors.employerName}>
                <input
                  className={`form-input ${errors.employerName ? 'has-error' : ''}`}
                  type="text"
                  name="employerName"
                  value={data.employerName}
                  onChange={handleChange}
                  placeholder={`Enter ${employerLabel.toLowerCase()}`}
                />
              </FormField>

              <FormField label={jobTitleLabel} required error={errors.jobTitle}>
                <input
                  className={`form-input ${errors.jobTitle ? 'has-error' : ''}`}
                  type="text"
                  name="jobTitle"
                  value={data.jobTitle}
                  onChange={handleChange}
                  placeholder={`Enter ${jobTitleLabel.toLowerCase()}`}
                />
              </FormField>

              <FormField label="Employment Start Date" required error={errors.employmentStartDate}>
                <input
                  className={`form-input ${errors.employmentStartDate ? 'has-error' : ''}`}
                  type="date"
                  name="employmentStartDate"
                  value={data.employmentStartDate}
                  onChange={handleChange}
                  max={maxStartDate}
                />
              </FormField>

              <FormField
                label="Total Work Experience"
                required
                error={errors.workExperience}
                hint="Total years including current employment"
              >
                <div className="input-with-prefix">
                  <input
                    className={`form-input ${errors.workExperience ? 'has-error' : ''}`}
                    type="number"
                    name="workExperience"
                    value={data.workExperience}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    max="50"
                    step="0.5"
                  />
                  <span className="input-prefix" style={{ borderLeft: 'none', borderRight: '1.5px solid var(--border)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>yrs</span>
                </div>
              </FormField>
            </>
          )}

          {isRetired && (
            <FormField
              label="Total Work Experience"
              required
              error={errors.workExperience}
              hint="Total years of work experience before retirement"
              className="col-span-2"
            >
              <div className="input-with-prefix">
                <input
                  className={`form-input ${errors.workExperience ? 'has-error' : ''}`}
                  type="number"
                  name="workExperience"
                  value={data.workExperience}
                  onChange={handleChange}
                  placeholder="0"
                  min="0"
                  max="50"
                  step="0.5"
                />
                <span className="input-prefix" style={{ borderLeft: 'none', borderRight: '1.5px solid var(--border)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>yrs</span>
              </div>
            </FormField>
          )}

          {data.employmentType && (
            <>
              <div className="section-divider col-span-2">
                <span>Income Details</span>
              </div>

              <FormField
                label="Monthly Gross Income"
                required
                error={errors.monthlyGrossIncome}
                hint="Total income before deductions"
              >
                <div className="input-with-prefix">
                  <span className="input-prefix">₹</span>
                  <input
                    className={`form-input ${errors.monthlyGrossIncome ? 'has-error' : ''}`}
                    type="number"
                    name="monthlyGrossIncome"
                    value={data.monthlyGrossIncome}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
              </FormField>

              <FormField
                label="Monthly Net Income"
                required
                error={errors.monthlyNetIncome}
                hint="Take-home pay after all deductions"
              >
                <div className="input-with-prefix">
                  <span className="input-prefix">₹</span>
                  <input
                    className={`form-input ${errors.monthlyNetIncome ? 'has-error' : ''}`}
                    type="number"
                    name="monthlyNetIncome"
                    value={data.monthlyNetIncome}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    step="1000"
                  />
                </div>
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
