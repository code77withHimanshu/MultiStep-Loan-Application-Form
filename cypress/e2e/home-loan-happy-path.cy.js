describe('Home Loan - Happy Path (with Co-Applicant)', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('completes a home loan application with mandatory co-applicant', () => {
    // Step 1
    cy.contains('Home Loan').click()
    cy.get('#loanAmount').type('5000000')
    cy.get('#loanTenure').select('240', { force: true })
    cy.get('#loanPurpose').select('Purchase of New Property', { force: true })
    cy.get('button[type="submit"]').click()

    // Step 2
    cy.get('#fullName').type('Anita Gupta')
    cy.get('#dateOfBirth').type('1985-08-20')
    cy.get('input[name="gender"][value="female"]').click()
    cy.get('#maritalStatus').select('married', { force: true })
    cy.get('#fatherName').type('Mohan Gupta')
    cy.get('#motherName').type('Kamla Gupta')
    cy.get('#email').type('anita.gupta@example.com')
    cy.get('#mobileNumber').type('8765432109')
    cy.get('button[type="submit"]').click()

    // Step 3
    cy.get('#aadhaarConsent').check({ force: true })
    cy.get('#panNumber').type('ABCPG5678H').blur()
    cy.wait(1700)
    cy.get('#aadhaarNumber').type('234123412346').blur()
    cy.wait(1700)
    cy.get('button[type="submit"]').click()

    // Step 4
    cy.get('#currentAddressLine1').type('45 Palam Vihar')
    cy.get('#currentPinCode').type('122010')
    cy.wait(400)
    cy.get('#currentResidenceType').select('owned', { force: true })
    cy.get('#yearsAtCurrentAddress').type('8')
    cy.get('#sameAsPermanent').check({ force: true })
    cy.get('button[type="submit"]').click()

    // Step 5
    cy.get('input[name="employmentType"][value="salaried"]').click()
    cy.get('#companyName').type('Finance Solutions Ltd')
    cy.get('#designation').type('Senior Manager')
    cy.get('#monthlyNetSalary').type('120000')
    cy.get('#yearsOfExperience').type('12')
    cy.get('button[type="submit"]').click()

    // Step 6 (Co-applicant - always required for Home Loan)
    cy.contains('Co-Applicant').should('be.visible')
    cy.get('#coApplicantName').type('Vikram Gupta')
    cy.get('#relationship').select('spouse', { force: true })
    cy.get('#coApplicantPAN').type('CDEPG9012I').blur()
    cy.wait(1700)
    cy.get('#coApplicantIncome').type('80000')
    cy.get('#coApplicantConsent').check({ force: true })
    cy.get('button[type="submit"]').click()

    // Step 7
    cy.drawSignature()
    cy.get('button[type="submit"]').click()

    // Step 8
    cy.contains('₹50,00,000').should('be.visible')
    cy.contains('8.5%').should('be.visible')
    cy.contains('Co-Applicant').should('be.visible')
    cy.contains('Vikram Gupta').should('be.visible')

    cy.get('#confirmAccuracy').check({ force: true })
    cy.get('#authorizeCreditCheck').check({ force: true })
    cy.get('#agreeTerms').check({ force: true })
    cy.get('#consentCommunications').check({ force: true })
    cy.get('button[type="submit"]').click()

    cy.contains('Application Submitted!', { timeout: 5000 }).should('be.visible')
  })
})
