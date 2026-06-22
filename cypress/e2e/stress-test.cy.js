describe('Stress Tests', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('prevents double-submit on Step 8', () => {
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
    cy.drawSignature()
    cy.get('button[type="submit"]').click()

    // Step 8 - check all consents and double-click submit
    cy.get('#confirmAccuracy').check({ force: true })
    cy.get('#authorizeCreditCheck').check({ force: true })
    cy.get('#agreeTerms').check({ force: true })
    cy.get('#consentCommunications').check({ force: true })

    cy.get('button[type="submit"]').dblclick()

    // Should show submitting state and eventually success only once
    cy.contains('Application Submitted!', { timeout: 5000 }).should('be.visible')
    cy.get('button:contains("Start New Application")').should('have.length', 1)
  })

  it('back-and-forward navigation preserves data', () => {
    cy.fillStep1({ loanAmount: 300000 })

    // Fill step 2 partially, go back, come back
    cy.get('#fullName').type('Rahul Sharma')
    cy.get('button').contains('Back').click()

    cy.get('#loanAmount').should('have.value', '300000')

    cy.get('button[type="submit"]').click()
    cy.get('#fullName').should('have.value', 'Rahul Sharma')
  })

  it('fills max-length fields without crashing', () => {
    cy.contains('Personal Loan').click()
    cy.get('#loanAmount').type('1000000')
    cy.get('#loanTenure').select('60', { force: true })
    cy.get('#loanPurpose').select('Medical Emergency', { force: true })
    cy.get('button[type="submit"]').click()

    cy.get('#fullName').type('A'.repeat(100))
    cy.get('#fullName').invoke('val').then((val) => {
      expect(val.length).to.be.lte(100)
    })
  })

  it('rapid Next button clicks only advance one step at a time', () => {
    cy.contains('Personal Loan').click()
    cy.get('#loanAmount').type('300000')
    cy.get('#loanTenure').select('36', { force: true })
    cy.get('#loanPurpose').select('Medical Emergency', { force: true })

    // Click Continue rapidly 5 times
    for (let i = 0; i < 5; i++) {
      cy.get('button[type="submit"]').click({ force: true })
    }

    // Should still be on step 2 (validation failed after first click)
    cy.get('#fullName').should('be.visible')
  })
})
