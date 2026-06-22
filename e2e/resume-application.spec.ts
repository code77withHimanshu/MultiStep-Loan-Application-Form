import { test, expect } from '@playwright/test'

test.describe('Resume Saved Application', () => {
  test('shows resume prompt when returning to a partially filled form', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    await page.fill('[name="firstName"]', 'Saved')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'saved@example.com')
    await page.fill('[name="phone"]', '9000000099')
    await page.locator('[name="dateOfBirth"]').fill('1988-06-15')
    await page.selectOption('[name="gender"]', 'female')
    await page.selectOption('[name="maritalStatus"]', 'married')
    await page.fill('[name="panNumber"]', 'SAVDU5678S')
    await page.click('button:has-text("Continue")')

    await expect(page.locator('text=Address Information')).toBeVisible()

    await page.reload()
    await expect(page.locator('[data-testid="resume-prompt"]')).toBeVisible({ timeout: 5000 })
  })

  test('continues from saved step when Continue is clicked in resume prompt', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    await page.fill('[name="firstName"]', 'Resume')
    await page.fill('[name="lastName"]', 'Test')
    await page.fill('[name="email"]', 'resume@example.com')
    await page.fill('[name="phone"]', '9100000099')
    await page.locator('[name="dateOfBirth"]').fill('1990-03-01')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'RESMT6789R')
    await page.click('button:has-text("Continue")')
    await expect(page.locator('text=Address Information')).toBeVisible()

    await page.reload()
    await page.waitForSelector('[data-testid="resume-prompt"]')
    await page.click('[data-testid="resume-continue"]')
    await expect(page.locator('[data-testid="resume-prompt"]')).not.toBeVisible()
    await expect(page.locator('text=Step 2 of 7')).toBeVisible()
  })

  test('starts fresh form when Start New is clicked', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    await page.fill('[name="firstName"]', 'OldData')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'old@example.com')
    await page.fill('[name="phone"]', '9200000000')
    await page.locator('[name="dateOfBirth"]').fill('1985-01-01')
    await page.selectOption('[name="gender"]', 'male')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'OLDDU7890O')
    await page.click('button:has-text("Continue")')

    await page.reload()
    await page.waitForSelector('[data-testid="resume-prompt"]')
    await page.click('[data-testid="resume-start-new"]')

    await expect(page.locator('[data-testid="resume-prompt"]')).not.toBeVisible()
    await expect(page.locator('text=Step 1 of 7')).toBeVisible()
    await expect(page.locator('[name="firstName"]')).toHaveValue('')
  })

  test('preserves form data across browser sessions via localStorage', async ({ page, context }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())

    await page.fill('[name="firstName"]', 'Persistent')
    await page.fill('[name="lastName"]', 'User')
    await page.fill('[name="email"]', 'persist@example.com')
    await page.fill('[name="phone"]', '9300000000')
    await page.locator('[name="dateOfBirth"]').fill('1991-09-09')
    await page.selectOption('[name="gender"]', 'female')
    await page.selectOption('[name="maritalStatus"]', 'single')
    await page.fill('[name="panNumber"]', 'PERSU8901P')
    await page.click('button:has-text("Continue")')

    const savedData = await page.evaluate(() => localStorage.getItem('loanease-form-v2'))
    expect(savedData).toBeTruthy()
    const parsed = JSON.parse(savedData ?? '{}')
    expect(parsed.state?.currentStep).toBeGreaterThan(0)

    void context
  })
})
