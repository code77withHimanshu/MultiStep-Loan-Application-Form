describe('Personal Loan - Happy Path (Salaried)', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('completes a personal loan application end-to-end', () => {
    // Step 1: Loan Type
    cy.contains('Personal Loan').click()
    cy.get('#loanAmount').type('300000')
    cy.get('#loanTenure').select('36', { force: true })
    cy.get('#loanPurpose').select('Medical Emergency', { force: true })
    cy.get('button[type="submit"]').click()

    // Step 2: Personal Info
    cy.get('#fullName').type('Rahul Sharma')
    cy.get('#dateOfBirth').type('1990-05-15')
    cy.get('input[name="gender"][value="male"]').click()
    cy.get('#maritalStatus').select('single', { force: true })
    cy.get('#fatherName').type('Ramesh Sharma')
    cy.get('#motherName').type('Sunita Sharma')
    cy.get('#email').type('rahul.sharma@example.com')
    cy.get('#mobileNumber').type('9876543210')
    cy.get('button[type="submit"]').click()

    // Step 3: KYC
    cy.get('#aadhaarConsent').check({ force: true })
    cy.get('#panNumber').type('ABCPE1234F').blur()
    cy.wait(1700)
    cy.get('#aadhaarNumber').type('499118665120').blur()
    cy.wait(1700)
    cy.get('button[type="submit"]').click()

    // Step 4: Address
    cy.get('#currentAddressLine1').type('123 MG Road')
    cy.get('#currentPinCode').type('560001')
    cy.wait(400)
    cy.get('#currentResidenceType').select('rented', { force: true })
    cy.get('#currentRentAmount').type('15000')
    cy.get('#yearsAtCurrentAddress').type('2')
    cy.get('#sameAsPermanent').check({ force: true })
    cy.get('button[type="submit"]').click()

    // Step 5: Employment
    cy.get('input[name="employmentType"][value="salaried"]').click()
    cy.get('#companyName').type('Tech Corp India Pvt Ltd')
    cy.get('#designation').type('Senior Software Engineer')
    cy.get('#monthlyNetSalary').type('75000')
    cy.get('#yearsOfExperience').type('5')
    cy.get('button[type="submit"]').click()

    // Step 6 should be skipped (₹3L < ₹5L threshold)

    // Step 7: Documents & Signature
    cy.drawSignature()
    cy.get('button[type="submit"]').click()

    // Step 8: Review & Submit
    cy.contains('Pre-Approval Summary').should('be.visible')
    cy.contains('₹3,00,000').should('be.visible')
    cy.contains('10.5%').should('be.visible')

    cy.get('#confirmAccuracy').check({ force: true })
    cy.get('#authorizeCreditCheck').check({ force: true })
    cy.get('#agreeTerms').check({ force: true })
    cy.get('#consentCommunications').check({ force: true })

    cy.get('button[type="submit"]').click()

    // Success screen
    cy.contains('Application Submitted!', { timeout: 5000 }).should('be.visible')
    cy.contains('Reference Number').should('be.visible')
  })
})
