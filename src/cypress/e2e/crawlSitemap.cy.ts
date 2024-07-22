import { getCliCommand } from '../support/e2e.js';

const constantCliOptionsJson = { "c": Cypress.env("crawlSitemapCliOption") }

// Main A B C is the testcase for happy flow, where cliOptionsJson A B C are all the permutations of the cli flags 
context("Crawl Sitemap", () => {
    const cliOptionsJsonA = { ...Cypress.env("cliOptionsJsonA"), ...constantCliOptionsJson, "u": Cypress.env("mainTestSitemapXmlUrl") }
    const cliOptionsJsonB = { ...Cypress.env("cliOptionsJsonB"), ...constantCliOptionsJson, "u": Cypress.env("mainTestSitemapAtomUrl") }
    const cliOptionsJsonC = { ...Cypress.env("cliOptionsJsonC"), ...constantCliOptionsJson, "u": Cypress.env("mainTestSitemapRssUrl") }

    describe(`[Main A] ${getCliCommand(cliOptionsJsonA, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runPurpleA11yProcess(cliOptionsJsonA).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            cy.checkResultFilesCreated(cliOptionsJsonA, purpleA11yResultFolder)
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonA, purpleA11yResultFolder)
        });
    });

    describe(`[Main B] ${getCliCommand(cliOptionsJsonB, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runPurpleA11yProcess(cliOptionsJsonB).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            cy.checkResultFilesCreated(cliOptionsJsonB, purpleA11yResultFolder)
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonB, purpleA11yResultFolder)
        });
    });

    describe(`[Main C] ${getCliCommand(cliOptionsJsonC, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runPurpleA11yProcess(cliOptionsJsonC).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            cy.checkResultFilesCreated(cliOptionsJsonC, purpleA11yResultFolder)
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonC, purpleA11yResultFolder)
        });
    });
});
