context("Crawl domain", () => {
    describe("[Main] Happy flow with cli settings 1", () => {
        it("stdout should contain result file name", () => {
            cy.exec(`cd ${Cypress.env("purpleA11yPath")} && NODE_TLS_REJECT_UNAUTHORIZED=1 ${Cypress.env("cliCommandA")} -c 2`, { failOnNonZeroExit: false }).then((result) => {
                expect(result.stderr).to.be.empty;
                const resultFileNameMatch = result.stdout.match(/Results directory is at .*\/+(\S+)/);
                let resultFileName;
                if (resultFileNameMatch) {
                    resultFileName = resultFileNameMatch[1];
                } else {
                    expect.fail("Result file name not found from stdout")
                }
                cy.log("result file name", resultFileName);
            });
        });

        it("cli flags should work accordingly", () => { //input: cliCommand
            
            //get data from report


            //decode scanItems, check for correctness


        });
    });
});
