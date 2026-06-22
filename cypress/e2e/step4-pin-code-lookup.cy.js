describe('Step 4 - PIN Code Lookup', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
  })

  it('auto-fills city and state for a known PIN code', () => {
    cy.get('#currentAddressLine1').type('123 Test Street')
    cy.get('#currentPinCode').clear().type('110001')
    cy.wait(500)
    cy.get('#currentCity').should('have.value', 'New Delhi')
    cy.get('#currentState').should('have.value', 'Delhi')
  })

  it('auto-fills correct city for Mumbai PIN code', () => {
    cy.get('#currentAddressLine1').type('45 Marine Drive')
    cy.get('#currentPinCode').clear().type('400001')
    cy.wait(500)
    cy.get('#currentCity').should('have.value', 'Mumbai')
    cy.get('#currentState').should('have.value', 'Maharashtra')
  })

  it('shows error message for unknown PIN code', () => {
    cy.get('#currentAddressLine1').type('Some Address')
    cy.get('#currentPinCode').clear().type('999999')
    cy.wait(500)
    cy.contains('PIN code not found').should('be.visible')
    cy.get('#currentCity').should('have.value', '')
  })

  it('allows manual entry when PIN code is unknown', () => {
    cy.get('#currentAddressLine1').type('Some Address')
    cy.get('#currentPinCode').clear().type('999999')
    cy.wait(500)
    cy.get('#currentCity').clear().type('Custom City')
    cy.get('#currentState').select('Goa', { force: true })
    cy.get('#currentCity').should('have.value', 'Custom City')
  })

  it('updates auto-fill when PIN changes', () => {
    cy.get('#currentAddressLine1').type('Test Address')
    cy.get('#currentPinCode').type('110001')
    cy.wait(500)
    cy.get('#currentCity').should('have.value', 'New Delhi')

    cy.get('#currentPinCode').clear().type('400001')
    cy.wait(500)
    cy.get('#currentCity').should('have.value', 'Mumbai')
  })
})
