import { test, expect } from '@playwright/test'
import { fillPersonalInfo, fillAddressInfo, fillEmploymentInfo, clickContinue, assertCurrentStep } from './helpers/form-helpers'

test.describe('Eligibility Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await fillPersonalInfo(page)
    await clickContinue(page)
    await fillAddressInfo(page)
    await clickContinue(page)
    await fillEmploymentInfo(page, {
      employmentType: 'salaried',
      employerName: 'Tech Solutions',
      jobTitle: 'Senior Developer',
      employmentStartDate: '2017-01-01',
      workExperience: '7',
      monthlyGrossIncome: '100000',
      monthlyNetIncome: '80000',
    })
    await clickContinue(page)
    await assertCurrentStep(page, 4)
  })

  test('shows eligibility card after filling loan details', async ({ page }) => {
    await page.click('[data-testid="loan-type-personal"]')
    await page.fill('[name="loanAmount"]', '1000000')
    await page.fill('[name="tenure"]', '60')

    await expect(page.locator('[data-testid="eligibility-card"]'), 'Eligibility card should appear').toBeVisible({ timeout: 3000 })
  })

  test('shows approved verdict for strong profile', async ({ page }) => {
    await page.click('[data-testid="loan-type-home"]')
    await page.fill('[name="loanAmount"]', '3000000')
    await page.fill('[name="tenure"]', '240')

    await expect(page.locator('[data-testid="eligibility-card"]')).toBeVisible({ timeout: 3000 })
    const verdict = await page.locator('[data-testid="eligibility-verdict"]').textContent()
    expect(['Pre-Approved', 'Conditional Approval']).toContain(verdict?.trim())
  })

  test('shows credit score bar in eligibility card', async ({ page }) => {
    await page.click('[data-testid="loan-type-personal"]')
    await page.fill('[name="loanAmount"]', '500000')
    await page.fill('[name="tenure"]', '60')

    await expect(page.locator('[data-testid="eligibility-card"]')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=Simulated Credit Score')).toBeVisible()
  })

  test('shows max loan amount in eligibility card', async ({ page }) => {
    await page.click('[data-testid="loan-type-home"]')
    await page.fill('[name="loanAmount"]', '2000000')
    await page.fill('[name="tenure"]', '180')

    await expect(page.locator('[data-testid="eligibility-card"]')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('[data-testid="max-loan-amount"]')).toBeVisible()
    const maxLoan = await page.locator('[data-testid="max-loan-amount"]').textContent()
    expect(maxLoan).toContain('₹')
  })

  test('updates eligibility when loan amount changes', async ({ page }) => {
    await page.click('[data-testid="loan-type-personal"]')
    await page.fill('[name="loanAmount"]', '500000')
    await page.fill('[name="tenure"]', '60')

    await expect(page.locator('[data-testid="eligibility-card"]')).toBeVisible({ timeout: 3000 })

    await page.fill('[name="loanAmount"]', '')
    await page.fill('[name="loanAmount"]', '200000')
    await page.waitForTimeout(800)

    await expect(page.locator('[data-testid="eligibility-card"]')).toBeVisible()
  })

  test('shows business loan eligibility', async ({ page }) => {
    await page.click('[data-testid="loan-type-business"]')
    await page.fill('[name="loanAmount"]', '2000000')
    await page.fill('[name="tenure"]', '84')

    await expect(page.locator('[data-testid="eligibility-card"]')).toBeVisible({ timeout: 3000 })
    await expect(page.locator('text=16% p.a.')).toBeVisible()
  })
})
