describe('Run Tool A CLI and Start Scan', () => {
  it('should trigger the CLI command and start the scan', () => {
    const scanData = {
      k: 'kc:accessibility@tech.gov.sg',
      u: 'https://www.tech.gov.sg',
      h: 'no',
    }
    cy.task('runToolA', scanData)
  })
})
