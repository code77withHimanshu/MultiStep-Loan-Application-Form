import { test, expect } from '@playwright/test'
import { completeFullForm } from './helpers/form-helpers'

test.describe('Home Loan Happy Path', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('completes home loan application end-to-end', async ({ page }) => {
    await completeFullForm(page, 'home', {
      personal: { firstName: 'Vikram', lastName: 'Nair', email: 'vikram.nair@example.com', phone: '9900000001', panNumber: 'VIKRN5678V' },
      loan: {
        loanAmount: '3000000',
        tenure: '240',
        loanPurpose: 'Purchase of 2BHK flat in Electronic City, Bangalore',
        preferredEMIDate: '1',
      },
    })

    await page.check('[data-testid="declaration-checkbox"]')
    await page.click('[data-testid="submit-btn"]')

    await expect(page.locator('[data-testid="success-screen"]')).toBeVisible({ timeout: 10000 })
    const refNum = await page.locator('[data-testid="reference-number"]').textContent()
    expect(refNum).toMatch(/^LN/)
  })

  test('shows 8.5% interest rate for home loan', async ({ page }) => {
    await page.goto('/')

    await page.fill('[name="firstName"]', 'Vikram')
    await page.fill('[name="lastName"]', 'Nair')
    await page.fill('[name="email"]', 'vikram@example.com')
    await page.fill('[name="phone"]', '9900000001')
    await page.fill('[name="dateOfBirth"]', '1985-03-10')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'married')
    await page.fill('[name="panNumber"]', 'VIKRN5678V')
    await page.click('button:has-text("Continue")')

    await page.fill('[name="currentAddressLine1"]', '45 Brigade Road')
    await page.fill('[name="currentCity"]', 'Bangalore')
    await page.selectOption('[name="currentState"]', 'Karnataka')
    await page.fill('[name="currentZip"]', '560025')
    await page.check('[name="sameAsPermanent"]')
    await page.click('button:has-text("Continue")')

    await page.selectOption('[name="employmentType"]', 'salaried')
    await page.waitForTimeout(300)
    await page.fill('[name="employerName"]', 'Infosys')
    await page.fill('[name="jobTitle"]', 'Senior Manager')
    await page.fill('[name="employmentStartDate"]', '2015-01-15')
    await page.fill('[name="workExperience"]', '12')
    await page.fill('[name="monthlyGrossIncome"]', '150000')
    await page.fill('[name="monthlyNetIncome"]', '120000')
    await page.click('button:has-text("Continue")')

    await page.click('[data-testid="loan-type-home"]')
    await expect(page.locator('text=8.5% per annum')).toBeVisible()
  })

  test('shows review with home loan details', async ({ page }) => {
    await completeFullForm(page, 'home', {
      personal: { firstName: 'Vikram', lastName: 'Nair', email: 'vikram.nair@example.com', phone: '9900000001', panNumber: 'VIKRN5678V' },
      loan: { loanAmount: '2500000', tenure: '180', loanPurpose: 'Home purchase', preferredEMIDate: '5' },
    })

    await expect(page.locator('text=Home Loan')).toBeVisible()
    await expect(page.locator('text=Vikram Nair')).toBeVisible()
  })
})
