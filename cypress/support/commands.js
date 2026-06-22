// Custom Cypress commands for LendSwift loan application tests

Cypress.Commands.add('fillStep1', ({ loanType = 'personal', loanAmount = 300000, purpose } = {}) => {
  const purposeMap = {
    personal: 'Medical Emergency',
    home: 'Purchase of New Property',
    business: 'Working Capital',
  }

  cy.get(`[aria-pressed]`).then(($btns) => {
    cy.wrap($btns).contains(loanType === 'personal' ? 'Personal Loan' : loanType === 'home' ? 'Home Loan' : 'Business Loan').click()
  })

  cy.get('#loanAmount').type(String(loanAmount))
  cy.get('#loanTenure').select('36', { force: true })
  cy.get('#loanPurpose').select(purpose ?? purposeMap[loanType], { force: true })
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('fillStep2', ({
  fullName = 'Rahul Sharma',
  dob = '1990-05-15',
  gender = 'male',
  maritalStatus = 'single',
  fatherName = 'Ramesh Sharma',
  motherName = 'Sunita Sharma',
  email = 'rahul.sharma@example.com',
  mobile = '9876543210',
} = {}) => {
  cy.get('#fullName').clear().type(fullName)
  cy.get('#dateOfBirth').type(dob)
  cy.get(`input[name="gender"][value="${gender}"]`).click()
  cy.get('#maritalStatus').select(maritalStatus, { force: true })
  cy.get('#fatherName').clear().type(fatherName)
  cy.get('#motherName').clear().type(motherName)
  cy.get('#email').clear().type(email)
  cy.get('#mobileNumber').clear().type(mobile)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('fillStep3', ({
  pan = 'ABCPE1234F',
  aadhaar = '499118665120',
} = {}) => {
  cy.get('#aadhaarConsent').check({ force: true })
  cy.get('#panNumber').clear().type(pan).blur()
  cy.wait(1600)
  cy.get('#aadhaarNumber').clear().type(aadhaar).blur()
  cy.wait(1600)
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('fillStep4', ({
  address1 = '123 Main Street',
  pinCode = '110001',
  residenceType = 'owned',
  years = 5,
} = {}) => {
  cy.get('#currentAddressLine1').clear().type(address1)
  cy.get('#currentPinCode').clear().type(pinCode)
  cy.wait(400)
  cy.get('#currentResidenceType').select(residenceType, { force: true })
  cy.get('#yearsAtCurrentAddress').clear().type(String(years))
  cy.get('#sameAsPermanent').check({ force: true })
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('fillStep5', ({
  employmentType = 'salaried',
  companyName = 'Tech Corp India Ltd',
  designation = 'Software Engineer',
  salary = 75000,
  experience = 5,
} = {}) => {
  cy.get(`input[name="employmentType"][value="${employmentType}"]`).click()

  if (employmentType === 'salaried') {
    cy.get('#companyName').clear().type(companyName)
    cy.get('#designation').clear().type(designation)
    cy.get('#monthlyNetSalary').type(String(salary))
  }

  cy.get('#yearsOfExperience').clear().type(String(experience))
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('fillStep6', ({
  name = 'Priya Sharma',
  relationship = 'spouse',
  pan = 'ABCPE5678G',
  income = 50000,
} = {}) => {
  cy.get('#coApplicantName').clear().type(name)
  cy.get('#relationship').select(relationship, { force: true })
  cy.get('#coApplicantPAN').clear().type(pan).blur()
  cy.wait(1600)
  cy.get('#coApplicantIncome').type(String(income))
  cy.get('#coApplicantConsent').check({ force: true })
  cy.get('button[type="submit"]').click()
})

Cypress.Commands.add('drawSignature', () => {
  cy.get('[data-testid="signature-canvas"]').then(($canvas) => {
    const canvas = $canvas[0]
    const rect = canvas.getBoundingClientRect()
    cy.wrap($canvas)
      .trigger('mousedown', { clientX: rect.left + 40, clientY: rect.top + 60 })
      .trigger('mousemove', { clientX: rect.left + 120, clientY: rect.top + 60 })
      .trigger('mousemove', { clientX: rect.left + 160, clientY: rect.top + 90 })
      .trigger('mouseup')
  })
})

Cypress.Commands.add('clearSignature', () => {
  cy.get('[data-testid="clear-signature-btn"]').click()
})
