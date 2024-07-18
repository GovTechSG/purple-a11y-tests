import { getCliCommand } from '../support/e2e';

const constantCliOptionsJson = { "c": Cypress.env("crawlDomainCliOption"), "u": Cypress.env("mainTestHomePageUrl") }

// Main A B C is the testcase for happy flow, where cliOptionsJson A B C are all the permutations of the cli flags 
context("Crawl Domain", () => {
    const cliOptionsJsonA = { ...Cypress.env("cliOptionsJsonA"), ...constantCliOptionsJson, "s": "same-domain" }
    const cliOptionsJsonB = { ...Cypress.env("cliOptionsJsonB"), ...constantCliOptionsJson, "s": "same-hostname" }
    const cliOptionsJsonC = { ...Cypress.env("cliOptionsJsonC"), ...constantCliOptionsJson, "s": "same-domain" }

    describe(`[Main A] ${getCliCommand(cliOptionsJsonA, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runPurpleA11yProcess(cliOptionsJsonA).then((result) => {
                console.log(result)
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            console.log('1')
            cy.checkResultFilesCreated(cliOptionsJsonA, purpleA11yResultFolder)
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            console.log('2')
            cy.checkReportHtmlScanData(cliOptionsJsonA, purpleA11yResultFolder)
        });
    });

    describe(`[Main B] ${getCliCommand(cliOptionsJsonB, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runPurpleA11yProcess(cliOptionsJsonB).then((result) => {
                console.log('3', result)
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            console.log('3')
            cy.checkResultFilesCreated(cliOptionsJsonB, purpleA11yResultFolder)
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            console.log('4')
            cy.checkReportHtmlScanData(cliOptionsJsonB, purpleA11yResultFolder)
        });
    });

    describe(`[Main C] ${getCliCommand(cliOptionsJsonC, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runPurpleA11yProcess(cliOptionsJsonC).then((result) => {
                console.log('5', result)
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            console.log('5')
            cy.checkResultFilesCreated(cliOptionsJsonC, purpleA11yResultFolder)
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            console.log('6')
            cy.checkReportHtmlScanData(cliOptionsJsonC, purpleA11yResultFolder)
        });
    });
});
