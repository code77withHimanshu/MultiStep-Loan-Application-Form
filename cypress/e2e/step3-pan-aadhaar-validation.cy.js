describe('Step 3 - PAN and Aadhaar Validation', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.fillStep1({ loanType: 'personal', loanAmount: 300000 })
    cy.fillStep2()
  })

  it('shows error for invalid PAN format', () => {
    cy.get('#aadhaarConsent').check({ force: true })
    cy.get('#panNumber').type('INVALID').blur()
    cy.wait(200)
    cy.contains('ABCDE1234F').should('be.visible')
  })

  it('shows error for wrong PAN entity type for personal loan', () => {
    cy.get('#aadhaarConsent').check({ force: true })
    // C entity (company) is not valid for personal loan
    cy.get('#panNumber').type('ABCCC1234F').blur()
    cy.wait(1700)
    cy.contains('not valid for personal loan', { matchCase: false }).should('be.visible')
  })

  it('accepts C, F entity for business loan', () => {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.fillStep1({ loanType: 'business', loanAmount: 500000 })
    cy.fillStep2()
    cy.get('#aadhaarConsent').check({ force: true })
    // C entity should be valid for business
    cy.get('#panNumber').type('ABCCC1234F').blur()
    cy.wait(1700)
    cy.contains('Verified').should('be.visible')
  })

  it('shows error for invalid Aadhaar (bad checksum)', () => {
    cy.get('#aadhaarConsent').check({ force: true })
    cy.get('#panNumber').type('ABCPE1234F').blur()
    cy.wait(1700)
    cy.get('#aadhaarNumber').type('123456789012').blur()
    cy.wait(200)
    cy.contains('checksum', { matchCase: false }).should('be.visible')
  })

  it('shows error when submitting without Aadhaar consent', () => {
    cy.get('#panNumber').type('ABCPE1234F').blur()
    cy.wait(1700)
    cy.get('#aadhaarNumber').type('499118665120')
    cy.get('button[type="submit"]').click()
    cy.contains('consent', { matchCase: false }).should('be.visible')
  })

  it('cannot proceed if PAN not verified', () => {
    cy.get('#aadhaarConsent').check({ force: true })
    cy.get('#aadhaarNumber').type('499118665120').blur()
    cy.wait(1700)
    cy.get('button[type="submit"]').click()
    cy.contains('PAN verification is required').should('be.visible')
  })

  it('shows green verified badge after successful PAN verification', () => {
    cy.get('#aadhaarConsent').check({ force: true })
    cy.get('#panNumber').type('ABCPE1234F').blur()
    cy.wait(1700)
    cy.contains('Verified').should('be.visible')
  })
})
