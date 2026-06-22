describe('Step 6 - Co-Applicant Conditional Visibility', () => {
  function navigateToStep6(loanType, loanAmount) {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.fillStep1({ loanType, loanAmount })
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
  }

  it('Home Loan always shows Step 6 (co-applicant mandatory)', () => {
    navigateToStep6('home', 1000000)
    cy.contains('Co-Applicant').should('be.visible')
    cy.contains('mandatory for Home Loans', { matchCase: false }).should('be.visible')
  })

  it('Personal Loan ₹3,00,000 skips Step 6 (below ₹5L threshold)', () => {
    navigateToStep6('personal', 300000)
    // Step 6 should be skipped, should be on step 7
    cy.contains('Documents').should('be.visible')
    cy.get('[data-testid="signature-canvas"]').should('be.visible')
  })

  it('Personal Loan ₹6,00,000 shows Step 6 (above ₹5L threshold)', () => {
    navigateToStep6('personal', 600000)
    cy.contains('Co-Applicant').should('be.visible')
    cy.contains('above ₹5,00,000', { matchCase: false }).should('be.visible')
  })

  it('Personal Loan exactly ₹5,00,000 does NOT show Step 6 (strictly greater than)', () => {
    navigateToStep6('personal', 500000)
    // Should skip to step 7
    cy.get('[data-testid="signature-canvas"]').should('be.visible')
  })

  it('Business Loan ₹15,00,000 skips Step 6 (below ₹20L threshold)', () => {
    navigateToStep6('business', 1500000)
    cy.get('[data-testid="signature-canvas"]').should('be.visible')
  })

  it('Business Loan ₹25,00,000 shows Step 6 (above ₹20L threshold)', () => {
    navigateToStep6('business', 2500000)
    cy.contains('Co-Applicant').should('be.visible')
  })

  it('Step indicator shows Step 6 dynamically when visible', () => {
    navigateToStep6('home', 1000000)
    cy.contains('Co-Applicant Details').should('be.visible')
  })
})
