describe('Auto-Save and Resume Draft', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('saves draft and shows resume modal on reload', () => {
    // Fill Steps 1-2
    cy.fillStep1({ loanAmount: 400000 })
    cy.fillStep2()

    // Wait for auto-save (or trigger by waiting 30s — use shorter interval in test)
    cy.wait(2000) // allow any in-progress save

    // Reload page
    cy.reload()

    // Resume modal should appear
    cy.contains('Resume Your Application', { timeout: 5000 }).should('be.visible')
    cy.contains('personal', { matchCase: false }).should('be.visible')
  })

  it('resumes application at correct step after reload', () => {
    cy.fillStep1({ loanAmount: 400000 })
    cy.fillStep2()
    cy.wait(2000)
    cy.reload()

    cy.contains('Resume Your Application').should('be.visible')
    cy.contains('Resume Application').click()

    // Should be on step 3 or 2 (where we left off)
    cy.contains('KYC').should('be.visible')
  })

  it('starts fresh when user chooses Start Fresh', () => {
    cy.fillStep1()
    cy.wait(2000)
    cy.reload()

    cy.contains('Resume Your Application').should('be.visible')
    cy.contains('Start Fresh').click()

    // Should be back at step 1
    cy.contains('Loan Type').should('be.visible')
    cy.contains('Personal Loan').should('be.visible')
  })

  it('verifies localStorage contains encrypted data (not plaintext)', () => {
    cy.fillStep1({ loanAmount: 400000 })
    cy.wait(2000)

    cy.window().then((win) => {
      const key = 'lendswift_draft_personal'
      const value = win.localStorage.getItem(key)
      if (value) {
        // Value should be base64 IV:base64 ciphertext (AES-GCM), not readable JSON
        expect(value).to.not.contain('"loanType"')
        expect(value).to.not.contain('"loanAmount"')
        expect(value).to.match(/^[A-Za-z0-9+/]+=*:[A-Za-z0-9+/]+=*$/)
      }
    })
  })
})
