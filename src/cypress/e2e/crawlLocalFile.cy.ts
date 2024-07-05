import { getCliCommand } from '../support/e2e';

const constantCliOptionsJson = { "c": Cypress.env("crawlLocalFileCliOption") }

// Main A B C is the testcase for happy flow, where cliOptionsJson A B C are all the permutations of the cli flags 
context("Crawl Local File", () => {
    const cliOptionsJsonA = { ...Cypress.env("cliOptionsJsonA"), ...constantCliOptionsJson, "u": Cypress.env("localHtmlFileDirectory") }
    const cliOptionsJsonB = { ...Cypress.env("cliOptionsJsonB"), ...constantCliOptionsJson, "u": Cypress.env("localHtmFileDirectory") }
    const cliOptionsJsonC = { ...Cypress.env("cliOptionsJsonC"), ...constantCliOptionsJson, "u": Cypress.env("localXhtmlFileDirectory") }
    const cliOptionsJsonD = { ...Cypress.env("cliOptionsJsonA"), ...constantCliOptionsJson, "u": Cypress.env("localXmlFileDirectory") }
    const cliOptionsJsonE = { ...Cypress.env("cliOptionsJsonA"), ...constantCliOptionsJson, "u": Cypress.env("localTxtFileDirectory") }


    describe(`[Main A] ${getCliCommand(cliOptionsJsonA, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runScanAndCheckResultFilesCreated(cliOptionsJsonA).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonA, purpleA11yResultFolder)

        });
    });


    describe(`[Main B] ${getCliCommand(cliOptionsJsonB, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runScanAndCheckResultFilesCreated(cliOptionsJsonB).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonB, purpleA11yResultFolder)

        });
    });


    describe(`[Main C] ${getCliCommand(cliOptionsJsonC, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runScanAndCheckResultFilesCreated(cliOptionsJsonC).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonC, purpleA11yResultFolder)

        });
    });
    
    describe(`[Main D] ${getCliCommand(cliOptionsJsonD, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runScanAndCheckResultFilesCreated(cliOptionsJsonC).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonC, purpleA11yResultFolder)

        });
    });

    describe(`[Main E] ${getCliCommand(cliOptionsJsonE, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runScanAndCheckResultFilesCreated(cliOptionsJsonC).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonC, purpleA11yResultFolder)

        });
    });
});
