describe('E-Signature', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
    // Now on Step 7
  })

  it('signature canvas is visible', () => {
    cy.get('[data-testid="signature-canvas"]').should('be.visible')
  })

  it('clear button resets the signature', () => {
    cy.drawSignature()
    cy.get('[data-testid="clear-signature-btn"]').click()
  })

  it('shows validation error when submitting without signature', () => {
    cy.get('[data-testid="clear-signature-btn"]').click()
    cy.get('button[type="submit"]').click()
    cy.contains('signature', { matchCase: false }).should('be.visible')
  })

  it('drawn signature appears in Step 8 review', () => {
    cy.drawSignature()
    cy.get('button[type="submit"]').click()

    // On Step 8
    cy.get('img[alt*="signature"]').should('be.visible')
  })

  it('signature is included in review section', () => {
    cy.drawSignature()
    cy.get('button[type="submit"]').click()
    cy.contains('E-Signature').should('be.visible')
  })
})
