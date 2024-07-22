import { getCliCommand } from '../support/e2e.js';

const constantCliOptionsJson = { "c": Cypress.env("crawlLocalFileCliOption") }

// need to remove p flag as some local file types cannot accept a p flag
const { p: maxPageA, ...cliOptionsJsonAWithoutP } = Cypress.env("cliOptionsJsonA");
const { p: maxPageB, ...cliOptionsJsonBWithoutP } = Cypress.env("cliOptionsJsonB");
const { p: maxPageC, ...cliOptionsJsonCWithoutP } = Cypress.env("cliOptionsJsonC");

// Main A B C is the testcase for happy flow, where cliOptionsJson A B C are all the permutations of the cli flags 
context("Crawl Local File", () => {
    const cliOptionsJsonA = { ...cliOptionsJsonAWithoutP, ...constantCliOptionsJson, "u": Cypress.env("localHtmlFileDirectory") }
    const cliOptionsJsonB = { ...cliOptionsJsonBWithoutP, ...constantCliOptionsJson, "u": Cypress.env("localHtmFileDirectory") }
    const cliOptionsJsonC = { ...cliOptionsJsonCWithoutP, ...constantCliOptionsJson, "u": Cypress.env("localXhtmlFileDirectory") }
    const cliOptionsJsonD = { ...cliOptionsJsonAWithoutP, ...constantCliOptionsJson, "u": Cypress.env("localXmlFileDirectory") }
    const cliOptionsJsonE = { ...cliOptionsJsonAWithoutP, ...constantCliOptionsJson, "u": Cypress.env("localTxtFileDirectory") }


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
    
    describe(`[Main D] ${getCliCommand(cliOptionsJsonD, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runPurpleA11yProcess(cliOptionsJsonD).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            cy.checkResultFilesCreated(cliOptionsJsonD, purpleA11yResultFolder)
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonD, purpleA11yResultFolder)
        });
    });

    describe(`[Main E] ${getCliCommand(cliOptionsJsonE, true)}`, () => {
        let purpleA11yResultFolder;

        it(Cypress.env("IT_RUN_SCAN"), () => {
            cy.runPurpleA11yProcess(cliOptionsJsonE).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            cy.checkResultFilesCreated(cliOptionsJsonE, purpleA11yResultFolder)
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonE, purpleA11yResultFolder)
        });
    });

});
