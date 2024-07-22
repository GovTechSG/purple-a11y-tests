import { getCliCommand } from '../support/e2e.js'

// -c 3
const constantCliOptionsJson = { c: Cypress.env('customFlowCliOption') }

// remove p flag
const { p, ...cliOptionsCustomFlowWithoutP } = Cypress.env(
  'cliOptionsCustomFlow'
)

context('CustomFlow', () => {
  const cliOptionsCustomFlow = {
    ...constantCliOptionsJson,
    ...cliOptionsCustomFlowWithoutP,
  }

  const getCustomFlowCliCommand = getCliCommand(cliOptionsCustomFlow, true)

  describe('Run Custom Flow CLI Command', () => {
    it('should trigger a custom flow > scan one page > close the browser > save results', () => {
      cy.exec(
        `cd ${Cypress.env('purpleA11yPath')} && ${getCustomFlowCliCommand}`,
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
})
