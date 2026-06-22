import { describe, it, expect, beforeEach } from 'vitest'
import { storageService } from '@/services/storage'
import type { SavedFormState } from '@/services/storage'

const mockState: SavedFormState = {
  currentStep: 2,
  formData: {
    personalInfo: { firstName: 'Test', lastName: 'User' },
    addressInfo: { currentCity: 'Mumbai' },
    employmentInfo: { employmentType: 'salaried' },
    loanDetails: { loanType: 'personal' },
  },
  savedAt: '2024-01-01T12:00:00.000Z',
}

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('saves and loads state', () => {
    storageService.save(mockState)
    const loaded = storageService.load()
    expect(loaded).not.toBeNull()
    expect(loaded?.currentStep).toBe(2)
    expect(loaded?.savedAt).toBe('2024-01-01T12:00:00.000Z')
  })

  it('returns null when nothing is saved', () => {
    expect(storageService.load()).toBeNull()
  })

  it('clears saved data', () => {
    storageService.save(mockState)
    storageService.clear()
    expect(storageService.load()).toBeNull()
  })

  it('hasData returns true when data exists', () => {
    storageService.save(mockState)
    expect(storageService.hasData()).toBe(true)
  })

  it('hasData returns false when no data', () => {
    expect(storageService.hasData()).toBe(false)
  })

  it('saves nested form data correctly', () => {
    storageService.save(mockState)
    const loaded = storageService.load()
    expect(loaded?.formData.personalInfo.firstName).toBe('Test')
    expect(loaded?.formData.addressInfo.currentCity).toBe('Mumbai')
  })
})
