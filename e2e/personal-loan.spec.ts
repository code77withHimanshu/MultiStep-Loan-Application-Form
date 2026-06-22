import { test, expect } from '@playwright/test'
import { completeFullForm, assertCurrentStep } from './helpers/form-helpers'

test.describe('Personal Loan Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('completes personal loan application end-to-end', async ({ page }) => {
    await completeFullForm(page, 'personal', {
      personal: { firstName: 'Anjali', lastName: 'Mehta', email: 'anjali.mehta@example.com', phone: '9123456780', panNumber: 'ANJAM1234J' },
      loan: { loanAmount: '300000', tenure: '36', loanPurpose: 'Medical expenses and home renovation', preferredEMIDate: '10' },
    })

    await page.check('[data-testid="declaration-checkbox"]')
    await page.click('[data-testid="submit-btn"]')

    await expect(page.locator('[data-testid="success-screen"]')).toBeVisible({ timeout: 10000 })
    await expect(page.locator('[data-testid="reference-number"]')).toBeVisible()
    const refNum = await page.locator('[data-testid="reference-number"]').textContent()
    expect(refNum).toMatch(/^LN/)
  })

  test('shows EMI calculation card for personal loan', async ({ page }) => {
    await page.goto('/')
    await page.locator('[name="firstName"]').fill('Test')
    await page.locator('[name="lastName"]').fill('User')
    await page.locator('[name="email"]').fill('test@example.com')
    await page.locator('[name="phone"]').fill('9000000001')
    await page.locator('[name="dateOfBirth"]').fill('1992-01-01')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.locator('[name="panNumber"]').fill('ABCDE1234F')
    await page.click('button:has-text("Continue")')
    await assertCurrentStep(page, 2)

    await page.fill('[name="currentAddressLine1"]', '10 Park Street')
    await page.fill('[name="currentCity"]', 'Mumbai')
    await page.selectOption('[name="currentState"]', 'Maharashtra')
    await page.fill('[name="currentZip"]', '400001')
    await page.check('[name="sameAsPermanent"]')
    await page.click('button:has-text("Continue")')
    await assertCurrentStep(page, 3)

    await page.selectOption('[name="employmentType"]', 'salaried')
    await page.waitForTimeout(300)
    await page.fill('[name="employerName"]', 'Tech Corp')
    await page.fill('[name="jobTitle"]', 'Developer')
    await page.fill('[name="employmentStartDate"]', '2020-01-01')
    await page.fill('[name="workExperience"]', '4')
    await page.fill('[name="monthlyGrossIncome"]', '70000')
    await page.fill('[name="monthlyNetIncome"]', '56000')
    await page.click('button:has-text("Continue")')
    await assertCurrentStep(page, 4)

    await page.click('[data-testid="loan-type-personal"]')
    await page.fill('[name="loanAmount"]', '500000')
    await page.fill('[name="tenure"]', '60')

    await expect(page.locator('[data-testid="emi-card"]')).toBeVisible()
    const emiText = await page.locator('[data-testid="emi-card"]').textContent()
    expect(emiText).toContain('₹')
  })

  test('step indicator shows progress', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=Step 1 of 7')).toBeVisible()
    await expect(page.locator('[role="progressbar"]')).toBeVisible()
  })

  test('can navigate back from step 2', async ({ page }) => {
    await page.goto('/')
    await page.fill('[name="firstName"]', 'Test')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="phone"]', '9000000001')
    await page.locator('[name="dateOfBirth"]').fill('1992-01-01')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'ABCDE1234F')
    await page.click('button:has-text("Continue")')
    await assertCurrentStep(page, 2)

    await page.click('button:has-text("Back")')
    await assertCurrentStep(page, 1)
    await expect(page.locator('[name="firstName"]')).toHaveValue('Test')
  })
})
