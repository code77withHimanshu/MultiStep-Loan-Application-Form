import { test, expect } from '@playwright/test'
import { fillPersonalInfo, fillAddressInfo, fillEmploymentInfo, clickContinue, assertCurrentStep } from './helpers/form-helpers'

test.describe('Document Upload', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()

    await fillPersonalInfo(page)
    await clickContinue(page)
    await assertCurrentStep(page, 2)

    await fillAddressInfo(page)
    await clickContinue(page)
    await assertCurrentStep(page, 3)

    await fillEmploymentInfo(page)
    await clickContinue(page)
    await assertCurrentStep(page, 4)

    await page.click('[data-testid="loan-type-personal"]')
    await page.fill('[name="loanAmount"]', '500000')
    await page.fill('[name="tenure"]', '60')
    await page.fill('[name="loanPurpose"]', 'Medical expenses')
    await page.selectOption('[name="preferredEMIDate"]', '5')
    await clickContinue(page)
    await assertCurrentStep(page, 5)
  })

  test('shows all 4 upload areas', async ({ page }) => {
    await expect(page.locator('[data-testid="upload-area-idProof"]')).toBeVisible()
    await expect(page.locator('[data-testid="upload-area-addressProof"]')).toBeVisible()
    await expect(page.locator('[data-testid="upload-area-incomeProof"]')).toBeVisible()
    await expect(page.locator('[data-testid="upload-area-photo"]')).toBeVisible()
  })

  test('shows uploaded file name after selection', async ({ page }) => {
    const pdfContent = Buffer.from('%PDF-1.4 test content')
    await page.locator('[data-testid="file-input-idProof"]').setInputFiles({
      name: 'aadhaar.pdf',
      mimeType: 'application/pdf',
      buffer: pdfContent,
    })
    await expect(page.locator('[data-testid="file-uploaded-idProof"]')).toBeVisible()
    await expect(page.locator('text=aadhaar.pdf')).toBeVisible()
  })

  test('can remove uploaded file', async ({ page }) => {
    const pdfContent = Buffer.from('%PDF-1.4 test')
    await page.locator('[data-testid="file-input-idProof"]').setInputFiles({
      name: 'doc.pdf',
      mimeType: 'application/pdf',
      buffer: pdfContent,
    })
    await page.waitForSelector('[data-testid="file-uploaded-idProof"]')
    await page.click('[data-testid="remove-file-idProof"]')
    await expect(page.locator('[data-testid="upload-area-idProof"]')).toBeVisible()
  })

  test('rejects file exceeding 5MB', async ({ page }) => {
    const largeBuffer = Buffer.alloc(6 * 1024 * 1024, 0)
    await page.locator('[data-testid="file-input-idProof"]').setInputFiles({
      name: 'large.pdf',
      mimeType: 'application/pdf',
      buffer: largeBuffer,
    })
    await expect(page.locator('text=5 MB')).toBeVisible()
    await expect(page.locator('[data-testid="file-uploaded-idProof"]')).not.toBeVisible()
  })

  test('shows security message', async ({ page }) => {
    await expect(page.locator('text=encrypted')).toBeVisible()
  })

  test('advances to signature step after all uploads', async ({ page }) => {
    const pdf = Buffer.from('%PDF-1.4')
    for (const key of ['idProof', 'addressProof', 'incomeProof', 'photo']) {
      await page.locator(`[data-testid="file-input-${key}"]`).setInputFiles({ name: `${key}.pdf`, mimeType: 'application/pdf', buffer: pdf })
      await page.waitForSelector(`[data-testid="file-uploaded-${key}"]`)
    }
    await clickContinue(page)
    await assertCurrentStep(page, 6)
  })
})
