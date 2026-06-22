describe('Step 5 - Employment Type Switching', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
  })

  it('shows salaried fields when Salaried is selected', () => {
    cy.get('input[name="employmentType"][value="salaried"]').click()
    cy.get('#companyName').should('be.visible')
    cy.get('#designation').should('be.visible')
    cy.get('#monthlyNetSalary').should('be.visible')
    cy.get('#businessName').should('not.exist')
  })

  it('shows self-employed fields when Self-Employed is selected', () => {
    cy.get('input[name="employmentType"][value="self_employed"]').click()
    cy.get('#businessName').should('be.visible')
    cy.get('#businessType').should('be.visible')
    cy.get('#annualTurnover').should('be.visible')
    cy.get('#monthlyNetSalary').should('not.exist')
    cy.get('#gstNumber').should('not.exist')
  })

  it('shows business owner fields including GST when Business Owner is selected', () => {
    cy.get('input[name="employmentType"][value="business_owner"]').click()
    cy.get('#businessName').should('be.visible')
    cy.get('#gstNumber').should('be.visible')
    cy.get('#monthlyNetSalary').should('not.exist')
  })

  it('clears salaried data when switching to self-employed', () => {
    cy.get('input[name="employmentType"][value="salaried"]').click()
    cy.get('#companyName').type('Test Corp')
    cy.get('input[name="employmentType"][value="self_employed"]').click()
    cy.get('#businessName').should('have.value', '')
  })

  it('validates minimum salary for salaried (below ₹15,000)', () => {
    cy.get('input[name="employmentType"][value="salaried"]').click()
    cy.get('#companyName').type('Small Corp')
    cy.get('#designation').type('Intern')
    cy.get('#monthlyNetSalary').type('5000')
    cy.get('#yearsOfExperience').type('1')
    cy.get('button[type="submit"]').click()
    cy.contains('15,000').should('be.visible')
  })

  it('validates minimum years in business for self-employed', () => {
    cy.get('input[name="employmentType"][value="self_employed"]').click()
    cy.get('#businessName').type('New Business')
    cy.get('#businessType').select('Proprietorship', { force: true })
    cy.get('#annualTurnover').type('1000000')
    cy.get('#monthlyIncome').type('50000')
    cy.get('#yearsInBusiness').type('1')
    cy.get('#yearsOfExperience').type('2')
    cy.get('button[type="submit"]').click()
    cy.contains('Minimum 2 years').should('be.visible')
  })
})
