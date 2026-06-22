import { test, expect } from '@playwright/test'

test.describe('Validation Errors', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('shows all required field errors on step 1 when empty', async ({ page }) => {
    await page.click('button:has-text("Continue")')
    await expect(page.locator('[role="alert"]').first()).toBeVisible()
    const alerts = await page.locator('[role="alert"]').count()
    expect(alerts).toBeGreaterThan(3)
  })

  test('shows error for invalid email', async ({ page }) => {
    await page.fill('[name="firstName"]', 'Test')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'not-an-email')
    await page.fill('[name="phone"]', '9876543210')
    await page.locator('[name="dateOfBirth"]').fill('1990-01-01')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'ABCDE1234F')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=valid email')).toBeVisible()
  })

  test('shows error for underage applicant', async ({ page }) => {
    const dob = new Date()
    dob.setFullYear(dob.getFullYear() - 16)
    await page.fill('[name="firstName"]', 'Young')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'young@example.com')
    await page.fill('[name="phone"]', '9876543210')
    await page.locator('[name="dateOfBirth"]').fill(dob.toISOString().split('T')[0])
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'ABCDE1234F')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=18 years')).toBeVisible()
  })

  test('shows error for invalid PAN format', async ({ page }) => {
    await page.fill('[name="firstName"]', 'Test')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="phone"]', '9876543210')
    await page.locator('[name="dateOfBirth"]').fill('1990-01-01')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'INVALID123')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=PAN')).toBeVisible()
  })

  test('shows error for invalid mobile number', async ({ page }) => {
    await page.fill('[name="firstName"]', 'Test')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="phone"]', '1234567890')
    await page.locator('[name="dateOfBirth"]').fill('1990-01-01')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'ABCDE1234F')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=10-digit Indian mobile')).toBeVisible()
  })

  test('errors clear when field is corrected', async ({ page }) => {
    await page.click('button:has-text("Continue")')
    await expect(page.locator('[role="alert"]').first()).toBeVisible()
    await page.fill('[name="firstName"]', 'Rahul')
    await expect(page.locator('text=First name is required')).not.toBeVisible()
  })

  test('shows loan amount error for too low amount', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      const store = JSON.parse(localStorage.getItem('loanease-form-v2') ?? '{}')
      store.state = { ...store.state, currentStep: 3 }
      localStorage.setItem('loanease-form-v2', JSON.stringify(store))
    })
    await page.evaluate(() => {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new Event('popstate'))
    })
  })

  test('shows validation for net income exceeding gross income', async ({ page }) => {
    await page.fill('[name="firstName"]', 'Test')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="phone"]', '9876543210')
    await page.locator('[name="dateOfBirth"]').fill('1990-01-01')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'ABCDE1234F')
    await page.click('button:has-text("Continue")')

    await page.fill('[name="currentAddressLine1"]', '123 Main St')
    await page.fill('[name="currentCity"]', 'Delhi')
    await page.selectOption('[name="currentState"]', 'Delhi')
    await page.fill('[name="currentZip"]', '110001')
    await page.check('[name="sameAsPermanent"]')
    await page.click('button:has-text("Continue")')

    await page.selectOption('[name="employmentType"]', 'salaried')
    await page.waitForTimeout(300)
    await page.fill('[name="employerName"]', 'Corp')
    await page.fill('[name="jobTitle"]', 'Analyst')
    await page.fill('[name="employmentStartDate"]', '2020-01-01')
    await page.fill('[name="workExperience"]', '4')
    await page.fill('[name="monthlyGrossIncome"]', '50000')
    await page.fill('[name="monthlyNetIncome"]', '60000')
    await page.click('button:has-text("Continue")')

    await expect(page.locator('text=Net income cannot exceed')).toBeVisible()
  })
})
