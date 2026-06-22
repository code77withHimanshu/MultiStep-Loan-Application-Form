describe('File Upload', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.visit('/')
    cy.fillStep1()
    cy.fillStep2()
    cy.fillStep3()
    cy.fillStep4()
    cy.fillStep5()
    // Now on Step 7 (step 6 skipped - ₹3L < 5L threshold)
  })

  it('accepts valid image file and shows upload status', () => {
    cy.fixture('sample.jpg', 'binary').then((fileContent) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'image/jpeg')
      const file = new File([blob], 'pan_card.jpg', { type: 'image/jpeg' })
      const dt = new DataTransfer()
      dt.items.add(file)

      cy.get('[data-testid="dropzone-panCardCopy"] input[type="file"]')
        .then((input) => {
          const nativeInput = input[0]
          Object.defineProperty(nativeInput, 'files', { value: dt.files })
          nativeInput.dispatchEvent(new Event('change', { bubbles: true }))
        })
    })

    cy.contains('pan_card.jpg', { timeout: 5000 }).should('be.visible')
  })

  it('rejects files exceeding max size', () => {
    const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.pdf', { type: 'application/pdf' })
    const dt = new DataTransfer()
    dt.items.add(largeFile)

    cy.get('[data-testid="dropzone-panCardCopy"] input[type="file"]')
      .then((input) => {
        const nativeInput = input[0]
        Object.defineProperty(nativeInput, 'files', { value: dt.files })
        nativeInput.dispatchEvent(new Event('change', { bubbles: true }))
      })

    cy.contains('File is larger than').should('be.visible')
  })

  it('allows removing an uploaded file', () => {
    cy.fixture('sample.jpg', 'binary').then((fileContent) => {
      const blob = Cypress.Blob.binaryStringToBlob(fileContent, 'image/jpeg')
      const file = new File([blob], 'aadhaar_front.jpg', { type: 'image/jpeg' })
      const dt = new DataTransfer()
      dt.items.add(file)

      cy.get('[data-testid="dropzone-aadhaarFront"] input[type="file"]')
        .then((input) => {
          const nativeInput = input[0]
          Object.defineProperty(nativeInput, 'files', { value: dt.files })
          nativeInput.dispatchEvent(new Event('change', { bubbles: true }))
        })

      cy.contains('aadhaar_front.jpg', { timeout: 5000 }).should('be.visible')
      cy.contains('Remove').first().click()
      cy.contains('aadhaar_front.jpg').should('not.exist')
    })
  })
})
