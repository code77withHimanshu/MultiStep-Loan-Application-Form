describe('Cross-Step Dependencies', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('Step 8 shows correct interest rate for personal loan (10.5%)', () => {
    cy.fillStep1({ loanType: 'personal', loanAmount: 300000 })
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
    cy.drawSignature()
    cy.get('button[type="submit"]').click()
    cy.contains('10.5%').should('be.visible')
  })

  it('Step 8 shows correct interest rate for home loan (8.5%)', () => {
    cy.fillStep1({ loanType: 'home', loanAmount: 1000000 })
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
    cy.fillStep6()
    cy.drawSignature()
    cy.get('button[type="submit"]').click()
    cy.contains('8.5%').should('be.visible')
  })

  it('Step 8 shows correct interest rate for business loan (14%)', () => {
    cy.fillStep1({ loanType: 'business', loanAmount: 500000 })
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5({ employmentType: 'business_owner' })
    cy.drawSignature()
    cy.get('button[type="submit"]').click()
    cy.contains('14%').should('be.visible')
  })

  it('Step 8 shows EMI warning when EMI > 50% of income', () => {
    // High loan amount relative to salary
    cy.fillStep1({ loanType: 'personal', loanAmount: 900000 })
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5({ salary: 20000 }) // very low salary
    cy.drawSignature()
    cy.get('button[type="submit"]').click()
    cy.contains('EMI-to-income ratio', { matchCase: false }).should('be.visible')
  })

  it('Step 8 Edit button navigates back to correct step', () => {
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
    cy.drawSignature()
    cy.get('button[type="submit"]').click()

    // Click Edit on Loan Details section
    cy.contains('Loan Details').parent().contains('Edit').click()
    cy.contains('Loan Type & Amount').should('be.visible')
  })

  it('Processing fee is 1% of loan amount within min/max bounds', () => {
    cy.fillStep1({ loanAmount: 300000 })
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
    cy.drawSignature()
    cy.get('button[type="submit"]').click()
    // ₹3,00,000 * 1% = ₹3,000
    cy.contains('₹3,000').should('be.visible')
  })
})
