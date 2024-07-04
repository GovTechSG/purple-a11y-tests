const scanModeCliOptionJson = { "c": Cypress.env("crawlDomainCliOption") }
context("Crawl Domain", () => {
    describe("[Main] Happy flow with cli settings 1", () => {
        let purpleA11yResultFolder;
        const cliOptionsJson = { ...Cypress.env("cliOptionsJsonA"), ...scanModeCliOptionJson }

        it("Process should complete & generate result files", () => {
            cy.runScanAndCheckResultFilesCreated(cliOptionsJson).then((result) => {
                purpleA11yResultFolder = result;
            })
        });

        it("scanData in report.html should correspond to cli command flags", () => {
            cy.checkReportHtmlScanData(cliOptionsJson, purpleA11yResultFolder)

        });
    });
});
