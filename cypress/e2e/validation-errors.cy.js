describe('Validation Errors', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('Step 1: shows error when submitting without selecting loan type fields', () => {
    cy.contains('Personal Loan').click()
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('exist')
  })

  it('Step 1: shows error for out-of-range loan amount', () => {
    cy.contains('Personal Loan').click()
    cy.get('#loanAmount').type('10')
    cy.get('#loanTenure').select('36', { force: true })
    cy.get('#loanPurpose').select('Medical Emergency', { force: true })
    cy.get('button[type="submit"]').click()
    cy.contains('Minimum loan amount').should('be.visible')
  })

  it('Step 2: shows error for underage applicant', () => {
    cy.fillStep1()
    cy.get('#fullName').type('Young Person')
    cy.get('#dateOfBirth').type('2010-01-01')
    cy.get('input[name="gender"][value="male"]').click()
    cy.get('#maritalStatus').select('single', { force: true })
    cy.get('#fatherName').type('Father Name')
    cy.get('#motherName').type('Mother Name')
    cy.get('#email').type('test@test.com')
    cy.get('#mobileNumber').type('9876543210')
    cy.get('button[type="submit"]').click()
    cy.contains('must be between 21').should('be.visible')
  })

  it('Step 2: shows error when alternate mobile matches primary mobile', () => {
    cy.fillStep1()
    cy.get('#fullName').type('Test User')
    cy.get('#dateOfBirth').type('1990-01-01')
    cy.get('input[name="gender"][value="male"]').click()
    cy.get('#maritalStatus').select('single', { force: true })
    cy.get('#fatherName').type('Father Name')
    cy.get('#motherName').type('Mother Name')
    cy.get('#email').type('test@example.com')
    cy.get('#mobileNumber').type('9876543210')
    cy.get('#alternateMobile').type('9876543210')
    cy.get('button[type="submit"]').click()
    cy.contains('must be different').should('be.visible')
  })

  it('Step 3: shows error when PAN entity type is wrong for loan type', () => {
    cy.fillStep1({ loanType: 'personal' })
    cy.fillStep2()
    cy.get('#aadhaarConsent').check({ force: true })
    // C entity is for companies, not valid for personal loan
    cy.get('#panNumber').type('ABCCC1234F').blur()
    cy.wait(1700)
    cy.contains('not valid for').should('be.visible')
  })

  it('Step 3: shows error when Aadhaar consent not given', () => {
    cy.fillStep1()
    cy.fillStep2()
    cy.get('#panNumber').type('ABCPE1234F').blur()
    cy.wait(1700)
    cy.get('#aadhaarNumber').type('499118665120')
    cy.get('button[type="submit"]').click()
    cy.contains('consent').should('be.visible')
  })

  it('Step 4: shows rent amount field when residence type is rented', () => {
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
    cy.get('#currentAddressLine1').type('123 Test Street')
    cy.get('#currentPinCode').type('560001')
    cy.get('#currentResidenceType').select('rented', { force: true })
    cy.get('#currentRentAmount').should('be.visible')
    cy.get('#yearsAtCurrentAddress').type('2')
    cy.get('button[type="submit"]').click()
    cy.contains('Monthly rent amount is required').should('be.visible')
  })

  it('Step 5: shows error for salary below minimum', () => {
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.get('input[name="employmentType"][value="salaried"]').click()
    cy.get('#companyName').type('Test Corp')
    cy.get('#designation').type('Intern')
    cy.get('#monthlyNetSalary').type('5000')
    cy.get('#yearsOfExperience').type('1')
    cy.get('button[type="submit"]').click()
    cy.contains('Minimum monthly net salary').should('be.visible')
  })

  it('Step 8: cannot submit without all 4 consents checked', () => {
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
    cy.drawSignature()
    cy.get('button[type="submit"]').click()
    // On step 8
    cy.get('#confirmAccuracy').check({ force: true })
    cy.get('button[type="submit"]').click()
    cy.get('[role="alert"]').should('have.length.at.least', 1)
  })
})
