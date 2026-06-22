import { test, expect } from '@playwright/test'
import { fillPersonalInfo, fillAddressInfo, fillEmploymentInfo, fillLoanDetails, uploadDocuments, clickContinue, assertCurrentStep } from './helpers/form-helpers'

test.describe('Signature Capture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await fillPersonalInfo(page)
    await clickContinue(page)
    await fillAddressInfo(page)
    await clickContinue(page)
    await fillEmploymentInfo(page)
    await clickContinue(page)
    await fillLoanDetails(page, 'personal')
    await clickContinue(page)
    await uploadDocuments(page)
    await clickContinue(page)
    await assertCurrentStep(page, 6)
  })

  test('shows signature step with canvas', async ({ page }) => {
    await expect(page.locator('text=Digital Signature')).toBeVisible()
    await expect(page.locator('[data-testid="signature-canvas"]')).toBeVisible()
    await expect(page.locator('[data-testid="clear-signature-btn"]')).toBeVisible()
  })

  test('shows legal notice text', async ({ page }) => {
    await expect(page.locator('text=Legal Notice')).toBeVisible()
    await expect(page.locator('text=Information Technology Act')).toBeVisible()
  })

  test('shows error when Continue is clicked without signature', async ({ page }) => {
    await clickContinue(page)
    await expect(page.locator('[role="alert"]')).toBeVisible()
    await expect(page.locator('text=signature')).toBeVisible()
  })

  test('can draw on the signature canvas', async ({ page }) => {
    const canvas = page.locator('[data-testid="signature-canvas"]')
    const box = await canvas.boundingBox()
    if (!box) throw new Error('Canvas not found')

    await page.mouse.move(box.x + 50, box.y + 100)
    await page.mouse.down()
    await page.mouse.move(box.x + 200, box.y + 80, { steps: 20 })
    await page.mouse.up()

    await expect(canvas).toBeVisible()
  })

  test('Clear button is clickable', async ({ page }) => {
    await page.click('[data-testid="clear-signature-btn"]')
    await expect(page.locator('[data-testid="signature-canvas"]')).toBeVisible()
  })

  test('navigates back to document upload', async ({ page }) => {
    await page.click('button:has-text("Back")')
    await assertCurrentStep(page, 5)
  })
})
