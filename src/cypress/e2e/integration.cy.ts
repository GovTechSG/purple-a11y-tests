

const constantCliOptionsJson = { "c": Cypress.env("customFlowCliOption") }

context("Integration", () => {
    const cliOptionsJsonIntegration = { ...Cypress.env("cliOptionsJsonIntegration"), ...constantCliOptionsJson, "u": Cypress.env("mainTestHomePageUrl") }

    describe("Visit a page and do a purpleA11y scan (happy flow)", () => {
        let purpleA11yResultFolder;
        it(Cypress.env("IT_CHECK_RESULTS_CREATION"), () => {
            cy.visit(Cypress.env("mainTestHomePageUrl"));
            cy.injectPurpleA11yScripts();
            cy.runPurpleA11yScan();
            cy.get("#button-manual-nav-onclick-to-3").click()
            // Run a scan on <input> and <button> elements
            cy.injectPurpleA11yScripts();
            cy.runPurpleA11yScan({
                elementsToScan: ["input", "button"],
                elementsToClick: ["button[onclick=\"toggleSecondSection()\"]"],
                metadata: "Clicked button"
            });
            cy.terminatePurpleA11y().then((result) => {
                purpleA11yResultFolder = result
                cy.checkResultFilesCreated(cliOptionsJsonIntegration, purpleA11yResultFolder, true)
            });
        });

        it(Cypress.env("IT_CHECK_SCANDATA"), () => {
            cy.checkReportHtmlScanData(cliOptionsJsonIntegration, purpleA11yResultFolder, true)
        });
    })
});