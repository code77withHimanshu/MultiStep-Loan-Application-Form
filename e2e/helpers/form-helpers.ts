import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const SAMPLE_PDF = path.join(__dirname, '../fixtures/sample.pdf')
export const SAMPLE_JPG = path.join(__dirname, '../fixtures/sample.jpg')

export async function fillPersonalInfo(page: Page, overrides: Record<string, string> = {}) {
  const data = {
    firstName: 'Rahul',
    lastName: 'Sharma',
    email: 'rahul.sharma@example.com',
    phone: '9876543210',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    maritalStatus: 'single',
    panNumber: 'ABCDE1234F',
    nationality: 'Indian',
    ...overrides,
  }

  await page.fill('[name="firstName"]', data.firstName)
  await page.fill('[name="lastName"]', data.lastName)
  await page.fill('[name="email"]', data.email)
  await page.fill('[name="phone"]', data.phone)
  await page.fill('[name="dateOfBirth"]', data.dateOfBirth)
  await page.selectOption('[name="gender"]', data.gender)
  await page.selectOption('[name="maritalStatus"]', data.maritalStatus)
  await page.selectOption('[name="nationality"]', data.nationality)
  await page.fill('[name="panNumber"]', data.panNumber)
}

export async function fillAddressInfo(page: Page, overrides: Record<string, string | boolean> = {}) {
  const data = {
    currentAddressLine1: '123 MG Road',
    currentAddressLine2: 'Near Central Park',
    currentCity: 'Bangalore',
    currentState: 'Karnataka',
    currentZip: '560001',
    sameAsPermanent: true,
    ...overrides,
  }

  await page.fill('[name="currentAddressLine1"]', data.currentAddressLine1 as string)
  await page.fill('[name="currentAddressLine2"]', data.currentAddressLine2 as string)
  await page.fill('[name="currentCity"]', data.currentCity as string)
  await page.selectOption('[name="currentState"]', data.currentState as string)
  await page.fill('[name="currentZip"]', data.currentZip as string)

  if (data.sameAsPermanent) {
    await page.check('[name="sameAsPermanent"]')
  }
}

export async function fillEmploymentInfo(page: Page, overrides: Record<string, string> = {}) {
  const data = {
    employmentType: 'salaried',
    employerName: 'Acme Technologies Ltd',
    jobTitle: 'Software Engineer',
    employmentStartDate: '2019-06-01',
    workExperience: '5',
    monthlyGrossIncome: '80000',
    monthlyNetIncome: '65000',
    ...overrides,
  }

  await page.selectOption('[name="employmentType"]', data.employmentType)
  await page.waitForTimeout(200)
  if (data.employmentType !== 'retired') {
    await page.fill('[name="employerName"]', data.employerName)
    await page.fill('[name="jobTitle"]', data.jobTitle)
    await page.fill('[name="employmentStartDate"]', data.employmentStartDate)
    await page.fill('[name="workExperience"]', data.workExperience)
  }
  await page.fill('[name="monthlyGrossIncome"]', data.monthlyGrossIncome)
  await page.fill('[name="monthlyNetIncome"]', data.monthlyNetIncome)
}

export async function fillLoanDetails(
  page: Page,
  loanType: 'home' | 'personal' | 'business' | 'car' | 'education' = 'personal',
  overrides: Record<string, string> = {}
) {
  const data = {
    loanAmount: '500000',
    tenure: '60',
    loanPurpose: 'General expenses and financial planning',
    preferredEMIDate: '5',
    ...overrides,
  }

  await page.click(`[data-testid="loan-type-${loanType}"]`)
  await page.fill('[name="loanAmount"]', data.loanAmount)
  await page.fill('[name="tenure"]', data.tenure)
  await page.fill('[name="loanPurpose"]', data.loanPurpose)
  await page.selectOption('[name="preferredEMIDate"]', data.preferredEMIDate)
}

export async function uploadDocuments(page: Page) {
  const pdfContent = Buffer.from('%PDF-1.4 mock pdf content')

  for (const key of ['idProof', 'addressProof', 'incomeProof', 'photo']) {
    const input = page.locator(`[data-testid="file-input-${key}"]`)
    await input.setInputFiles({
      name: `${key}.pdf`,
      mimeType: 'application/pdf',
      buffer: pdfContent,
    })
    await page.waitForSelector(`[data-testid="file-uploaded-${key}"]`)
  }
}

export async function drawSignature(page: Page) {
  const canvas = page.locator('[data-testid="signature-canvas"]')
  const box = await canvas.boundingBox()
  if (!box) throw new Error('Canvas not found')

  await page.mouse.move(box.x + 50, box.y + 100)
  await page.mouse.down()
  await page.mouse.move(box.x + 150, box.y + 80, { steps: 10 })
  await page.mouse.move(box.x + 250, box.y + 120, { steps: 10 })
  await page.mouse.move(box.x + 350, box.y + 80, { steps: 10 })
  await page.mouse.up()
  await page.waitForTimeout(300)
}

export async function clickContinue(page: Page) {
  await page.click('button:has-text("Continue")')
}

export async function assertCurrentStep(page: Page, stepNumber: number) {
  await expect(page.locator(`text=Step ${stepNumber} of 7`)).toBeVisible()
}

export async function completeFullForm(
  page: Page,
  loanType: 'home' | 'personal' | 'business' = 'personal',
  overrides: Record<string, Record<string, string>> = {}
) {
  await fillPersonalInfo(page, overrides.personal)
  await clickContinue(page)
  await assertCurrentStep(page, 2)

  await fillAddressInfo(page, overrides.address)
  await clickContinue(page)
  await assertCurrentStep(page, 3)

  await fillEmploymentInfo(page, overrides.employment)
  await clickContinue(page)
  await assertCurrentStep(page, 4)

  await fillLoanDetails(page, loanType, overrides.loan)
  await clickContinue(page)
  await assertCurrentStep(page, 5)

  await uploadDocuments(page)
  await clickContinue(page)
  await assertCurrentStep(page, 6)

  await drawSignature(page)
  await clickContinue(page)
  await assertCurrentStep(page, 7)
}
