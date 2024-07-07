import 'cypress-mochawesome-reporter/register';

Cypress.Commands.add("injectPurpleA11yScripts", () => {
    cy.task("getPurpleA11yScripts").then((s) => {
        cy.window().then((win) => {
            win.eval(s);
        });
    });
});

Cypress.Commands.add("runPurpleA11yScan", (items = {}) => {
    cy.window().then(async (win) => {
        const { elementsToScan, elementsToClick, metadata } = items;
        const res = await win.runA11yScan(elementsToScan);
        cy.task("pushPurpleA11yScanResults", { res, metadata, elementsToClick }).then((count) => { return count; });
        cy.task("pushPurpleA11yScanResults", { res, metadata, elementsToClick }).then((count) => { return count; });
        cy.task("finishPurpleA11yTestCase"); // test the accumulated number of issue occurrences against specified thresholds. If exceed, terminate purpleA11y instance.
    });
});

Cypress.Commands.add("terminatePurpleA11y", () => {
    cy.task("terminatePurpleA11y");
});

// toRunInPurpleA11yDirectly argument is used to show cliCommand youd use to run in purpleA11y terminal directly
export const getCliCommand = (cliOptionsJson, toRunInPurpleA11yDirectly = false) => {
    let command = 'npm run cli --';
    for (const [key, value] of Object.entries(cliOptionsJson)) {
        if (typeof value === 'string') {
            command += ` -${key} "${value}"`;
        }
        else {
            command += ` -${key} ${value}`;
        }
    }

    if (toRunInPurpleA11yDirectly) {
        return command
    } else {
        return `cd ${Cypress.env("purpleA11yPath")} && NODE_TLS_REJECT_UNAUTHORIZED=1 ${command}`; // NODE_TLS_REJECT_UNAUTHORIZED=1 env variable prevents a stderr warning caused by cy.exec
    }
};

const base64Decode = (data) => {
    const compressedBytes = Uint8Array.from(atob(data), c => c.charCodeAt(0));
    const jsonString = new TextDecoder().decode(compressedBytes);
    return JSON.parse(jsonString);
};

// This function runs a purple a11y scan and checks if result path is printed in stdout and all result files are created
Cypress.Commands.add('runScanAndCheckResultFilesCreated', (cliOptionsJson) => {
    let purpleA11yExportDir;
    let purpleA11yResultFolder;
    const cliCommand = getCliCommand(cliOptionsJson);
    return cy.exec(cliCommand, { failOnNonZeroExit: false, timeout: 300000 })
        .then((result) => {

            // TEST CASE: scan process complete successfully
            expect(result.stderr, "stderr occurred after running Purple A11y process").to.be.empty;

            const purpleA11yResultsPathRegex = result.stdout.match(/Results directory is at (\S+)/);

            // TEST CASE: result directory is printed in stdout
            expect(purpleA11yResultsPathRegex, "Purple A11y results directory cannot be found in the stdout after process completion").to.be.ok;

            let purpleA11yResultsPath;
            purpleA11yResultsPath = purpleA11yResultsPathRegex[1];
            const lastSlashIndex = purpleA11yResultsPath.lastIndexOf('/');
            purpleA11yExportDir = purpleA11yResultsPath.substring(0, lastSlashIndex);
            purpleA11yResultFolder = purpleA11yResultsPath.substring(lastSlashIndex + 1);

            // TEST CASE: result zip created & naming is based on the flag -o
            return cy.task('checkFileExist', `${Cypress.env("purpleA11yPath")}/${cliOptionsJson.o}.zip`)
        }).then((exists) => {
            expect(exists, `result zip file is not created`).to.be.true;

            // TEST CASE: result folder is created at path based on the flag -e
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}`)
        }).then((exists) => {
            expect(exists, `result folder is not created at path based on the flag -e`).to.be.true;

            // TEST CASE: screenshot folder is created based on flag -a
            if (cliOptionsJson.a == "screenshots") {
                return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/elemScreenshots`)
            } else {
                return null; // Ensures the chain continues
            }

        }).then((exists) => {
            if (cliOptionsJson.a === "screenshots") {
                expect(exists, `screenshot folder is not created based on flag -a`).to.be.true;
            }

            // TEST CASE: report.csv is created 
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/report.csv`)
        }).then((exists) => {
            expect(exists, `report.csv is not created`).to.be.true;

            // TEST CASE: report.html is created 
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/report.html`);
        }).then((exists) => {
            expect(exists, `report.html is not created`).to.be.true;

            // TEST CASE: scanDetails.csv is created 
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/scanDetails.csv`);
        }).then((exists) => {
            expect(exists, `scanDetails.csv is not created`).to.be.true;

            // TEST CASE: summary.pdf is created 
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/summary.pdf`);
        }).then((exists) => {
            expect(exists, `summary.pdf is not created`).to.be.true;

            return purpleA11yResultFolder;
        });


});
Cypress.Commands.add('checkReportHtmlScanData', (cliOptionsJson, purpleA11yResultFolder) => {
    return cy.task('readFile', `${cliOptionsJson.e}/${purpleA11yResultFolder}/report.html`)
        .then((reportHtmlData) => {
            const scanDataEncoded = reportHtmlData.match(/scanData\s*=\s*base64Decode\('([^']+)'\)/)[1];
            const scanDataDecodedJson = base64Decode(scanDataEncoded);
            
            // TEST CASE: scanData.scanType should be according to the flag -c
            let expectedScanType;
            switch (cliOptionsJson.c) {
                case '1':
                    expectedScanType = 'Sitemap';
                    break;
                case '2':
                    expectedScanType = 'Website';
                    break;
                case '3':
                    expectedScanType = 'Custom';
                    break;
                case '4':
                    expectedScanType = 'Intelligent';
                    break;
                case '5':
                    expectedScanType = 'LocalFile';
                    break;
                default:
                    throw new Error(`Unexpected cliOptionsJson.c value: ${cliOptionsJson.c}`);
            }
            expect(scanDataDecodedJson.scanType, `scanData.scanType should be according to the flag -c`).to.equal(expectedScanType);

            // TEST CASE: scanData.urlScanned should be according to the flag -u
            const normalizeUrl = (url) => {
                let normalizedUrl = url.replace(/\/+$/, '');
                normalizedUrl = normalizedUrl.toLowerCase();
                return normalizedUrl;
            };
            expect(normalizeUrl(scanDataDecodedJson.urlScanned), `scanData.urlScanned should be according to the flag -u`).to.equal(normalizeUrl(cliOptionsJson.u));
        

            // TEST CASE: scanData.viewport should be according to the flag -d or -w
            if (cliOptionsJson.d){
                expect(scanDataDecodedJson.viewport, `scanData.viewport should be according to the flag -d`).to.equal(cliOptionsJson.d);
            } else if (cliOptionsJson.w){
                expect(scanDataDecodedJson.viewport, `scanData.viewport should be according to the flag -w`).to.equal(`CustomWidth_${cliOptionsJson.w}px`); //TODO: check if scandata is string or number
            }

            // TEST CASE: scanData.totalPagesScanned should be <= to the flag -p. 
            expect(scanDataDecodedJson.totalPagesScanned, `scanData.totalPagesScanned should be <= to the flag -p`).to.be.lte(Number(cliOptionsJson.p));

            // TEST CASE: scanData.customFlowLabel should be according to the flag -j
            expect(scanDataDecodedJson.customFlowLabel, `scanData.customFlowLabel should be according to the flag -j`).to.equal(cliOptionsJson.j);

            // TEST CASE: scanData.pagesScanned should not contain blacklisted urls according to the flag -x (blacklisted)
            // TEST CASE: scanData.pagesScanned should not contain certain links according to the flag -s (strategy)
            const blacklistedPatternsSet = new Set(Cypress.env("blacklistedPatterns"));
            const urlsWithDiffHostnameSet = new Set(Cypress.env("diffHostnameUrl"));
            scanDataDecodedJson.pagesScanned.forEach(page => {
                expect(blacklistedPatternsSet.has(page.url), `scanData.pagesScanned should not contain ${page.url} according to the flag -x (blacklisted)`).to.be.false;
                (cliOptionsJson.s == "same-hostname") ? expect(urlsWithDiffHostnameSet.has(page.url), `scanData.pagesScanned should not contain ${page.url} according to the flag -s (strategy)`).to.be.false : undefined;
            });

            // TEST CASE: scanData.pagesScanned should not have any duplicates
            cy.wrap(scanDataDecodedJson.pagesScanned).then(pagesScanned => {
                const urls = pagesScanned.map(page => page.url);
                const uniqueUrls = new Set(urls);
                expect(uniqueUrls.size, `scanData.pagesScanned should not have any duplicates`).to.equal(urls.length);
            });

            // TEST CASE: [crawlDomain] customEnqueueLinksByClickingElements & enqueueLinks functions work
            if (cliOptionsJson.c == Cypress.env("crawlDomainCliOption")) {
                cy.wrap(scanDataDecodedJson.pagesScanned).then(pagesScanned => {
                    const urls = pagesScanned.map(page => page.url);
                    Cypress.env("crawlDomainEnqueueProcessUrls").forEach(expectedUrl => {
                        expect(urls).to.include(expectedUrl, `URL ${expectedUrl} should be in scanData.pagesScanned to verify that customEnqueueLinksByClickingElements & enqueueLinks functions work`);
                    });
                });
            }





        });
    });




    // [KIV - BECAUSE UNABLE TO CREATE INACCESSIBLE PDF TO ADD IN TEST WEBSITE] TEST CASE: scanData.pagesScanned should be according to the flag -i (filetypes) 