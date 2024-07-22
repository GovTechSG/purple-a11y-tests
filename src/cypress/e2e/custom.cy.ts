describe('Run Custom Flow CLI Command', () => {
  it('should trigger a custom flow > scan one page > close the browser > save results', () => {
    cy.exec(
      'cd node_modules/@govtechsg/purple-hats && npm run cli -- -c 3 -k kc:accessibility@tech.gov.sg -u https://www.tech.gov.sg -h no',
      {
        env: { IS_CYPRESS_TEST: 'true' },
      }
    ).then((result) => {
      expect(result.code).to.equal(0)

      cy.log(result.stdout)
      cy.log(result.stderr)
    })
  })
})
