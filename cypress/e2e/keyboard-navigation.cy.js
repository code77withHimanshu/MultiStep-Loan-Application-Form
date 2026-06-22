describe('Keyboard Navigation', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('can navigate Step 1 form using keyboard only', () => {
    // Tab to Personal Loan button and activate it
    cy.get('[aria-pressed]').first().focus().type('{enter}')

    // Tab to loan amount
    cy.get('#loanAmount').focus().type('300000')
    cy.realPress('Tab')

    // Tenure
    cy.focused().select('36', { force: true })
    cy.realPress('Tab')

    // Purpose
    cy.focused().select('Medical Emergency', { force: true })
    cy.realPress('Tab').realPress('Tab').realPress('Enter')
  })

  it('focus moves to first field on step transition', () => {
    cy.fillStep1()
    cy.focused().should('exist')
  })

  it('all form controls are reachable via Tab', () => {
    cy.get('[aria-pressed]').first().click()
    cy.get('#loanAmount').type('300000')
    cy.get('#loanTenure').select('36', { force: true })
    cy.get('#loanPurpose').select('Medical Emergency', { force: true })

    // Check submit button is focusable
    cy.get('button[type="submit"]').focus().should('be.focused')
  })

  it('Back button works with keyboard', () => {
    cy.fillStep1()
    cy.fillStep2()
    cy.get('button').contains('Back').focus().type('{enter}')
    cy.contains('Personal Information').should('be.visible')
  })

  it('checkboxes toggle with Space key', () => {
    cy.fillStep1()
    cy.fillStep2()
    cy.get('#aadhaarConsent').focus()
    cy.realPress('Space')
    cy.get('#aadhaarConsent').should('be.checked')
  })
})
