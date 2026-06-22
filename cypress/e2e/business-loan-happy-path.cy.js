describe('Business Loan - Happy Path (Business Owner)', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
  })

  it('completes a business loan with GST and business documents', () => {
    // Step 1
    cy.contains('Business Loan').click()
    cy.get('#loanAmount').type('2500000')
    cy.get('#loanTenure').select('60', { force: true })
    cy.get('#loanPurpose').select('Working Capital', { force: true })
    cy.get('button[type="submit"]').click()

    // Step 2
    cy.get('#fullName').type('Suresh Patel')
    cy.get('#dateOfBirth').type('1975-03-10')
    cy.get('input[name="gender"][value="male"]').click()
    cy.get('#maritalStatus').select('married', { force: true })
    cy.get('#fatherName').type('Dinesh Patel')
    cy.get('#motherName').type('Mira Patel')
    cy.get('#email').type('suresh.patel@example.com')
    cy.get('#mobileNumber').type('7654321098')
    cy.get('button[type="submit"]').click()

    // Step 3
    cy.get('#aadhaarConsent').check({ force: true })
    cy.get('#panNumber').type('ABCFC1234D').blur()
    cy.wait(1700)
    cy.get('#aadhaarNumber').type('123412341235').blur()
    cy.wait(1700)
    cy.get('button[type="submit"]').click()

    // Step 4
    cy.get('#currentAddressLine1').type('78 GIDC Estate')
    cy.get('#currentPinCode').type('380001')
    cy.wait(400)
    cy.get('#currentResidenceType').select('owned', { force: true })
    cy.get('#yearsAtCurrentAddress').type('15')
    cy.get('#sameAsPermanent').check({ force: true })
    cy.get('button[type="submit"]').click()

    // Step 5 - Business Owner
    cy.get('input[name="employmentType"][value="business_owner"]').click()
    cy.get('#businessName').type('Patel Industries Pvt Ltd')
    cy.get('#businessType').select('Private Limited Company', { force: true })
    cy.get('#annualTurnover').type('5000000')
    cy.get('#monthlyIncome').type('150000')
    cy.get('#yearsInBusiness').type('10')
    cy.get('#gstNumber').type('24ABCFC1234D1ZK')
    cy.get('#yearsOfExperience').type('12')
    cy.get('button[type="submit"]').click()

    // Step 6 - Co-applicant (₹25L > ₹20L threshold)
    cy.contains('Co-Applicant').should('be.visible')
    cy.get('#coApplicantName').type('Rekha Patel')
    cy.get('#relationship').select('spouse', { force: true })
    cy.get('#coApplicantPAN').type('EFGFC5678E').blur()
    cy.wait(1700)
    cy.get('#coApplicantIncome').type('60000')
    cy.get('#coApplicantConsent').check({ force: true })
    cy.get('button[type="submit"]').click()

    // Step 7
    cy.drawSignature()
    cy.get('button[type="submit"]').click()

    // Step 8
    cy.contains('14%').should('be.visible')
    cy.get('#confirmAccuracy').check({ force: true })
    cy.get('#authorizeCreditCheck').check({ force: true })
    cy.get('#agreeTerms').check({ force: true })
    cy.get('#consentCommunications').check({ force: true })
    cy.get('button[type="submit"]').click()

    cy.contains('Application Submitted!', { timeout: 5000 }).should('be.visible')
  })
})
