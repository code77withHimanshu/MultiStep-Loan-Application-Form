import { test, expect } from '@playwright/test'
import { completeFullForm } from './helpers/form-helpers'

test.describe('Business Loan Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('completes business loan application end-to-end', async ({ page }) => {
    await completeFullForm(page, 'business', {
      personal: { firstName: 'Sneha', lastName: 'Patel', email: 'sneha.patel@bizexample.com', phone: '9811111111', panNumber: 'SNEHP4321S' },
      employment: {
        employmentType: 'business',
        employerName: 'Patel Textiles Pvt Ltd',
        jobTitle: 'Managing Director',
        employmentStartDate: '2015-04-01',
        workExperience: '9',
        monthlyGrossIncome: '200000',
        monthlyNetIncome: '160000',
      },
      loan: {
        loanAmount: '2000000',
        tenure: '84',
        loanPurpose: 'Business expansion — purchase of manufacturing equipment and working capital',
        preferredEMIDate: '15',
      },
    })

    await page.check('[data-testid="declaration-checkbox"]')
    await page.click('[data-testid="submit-btn"]')

    await expect(page.locator('[data-testid="success-screen"]')).toBeVisible({ timeout: 10000 })
  })

  test('shows 16% interest rate for business loan', async ({ page }) => {
    await page.goto('/')

    await page.fill('[name="firstName"]', 'Sneha')
    await page.fill('[name="lastName"]', 'Patel')
    await page.fill('[name="email"]', 'sneha@example.com')
    await page.fill('[name="phone"]', '9811111111')
    await page.fill('[name="dateOfBirth"]', '1982-07-20')
    await page.selectOption('[name="gender"]', 'female')
    await page.selectOption('[name="maritalStatus"]', 'married')
    await page.fill('[name="panNumber"]', 'SNEHP4321S')
    await page.click('button:has-text("Continue")')

    await page.fill('[name="currentAddressLine1"]', '78 Commerce Street')
    await page.fill('[name="currentCity"]', 'Ahmedabad')
    await page.selectOption('[name="currentState"]', 'Gujarat')
    await page.fill('[name="currentZip"]', '380001')
    await page.check('[name="sameAsPermanent"]')
    await page.click('button:has-text("Continue")')

    await page.selectOption('[name="employmentType"]', 'business')
    await page.waitForTimeout(300)
    await page.fill('[name="employerName"]', 'Patel Textiles')
    await page.fill('[name="jobTitle"]', 'MD')
    await page.fill('[name="employmentStartDate"]', '2015-01-01')
    await page.fill('[name="workExperience"]', '9')
    await page.fill('[name="monthlyGrossIncome"]', '200000')
    await page.fill('[name="monthlyNetIncome"]', '160000')
    await page.click('button:has-text("Continue")')

    await page.click('[data-testid="loan-type-business"]')
    await expect(page.locator('text=16% per annum')).toBeVisible()
  })
})
