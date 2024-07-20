import 'cypress-mochawesome-reporter/register';

Cypress.Commands.add("injectPurpleA11yScripts", () => {
    cy.task("getPurpleA11yScripts").then((s: string) => {
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
        cy.task("finishPurpleA11yTestCase"); // test the accumulated number of issue occurrences against specified thresholds. If exceed, terminate purpleA11y instance.
    });
});

Cypress.Commands.add("terminatePurpleA11y", () => {
    return cy.task("terminatePurpleA11y")
        .then((randomToken) => {
            // cy.log('randomToken A:', randomToken);
            return randomToken
        });
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

Cypress.Commands.add('runPurpleA11yProcess', (cliOptionsJson) => {
    let purpleA11yResultFolder;
    const cliCommand = getCliCommand(cliOptionsJson);
    return cy.exec(cliCommand, { failOnNonZeroExit: false, timeout: 420000 })
        .then((result) => {

            // TEST CASE: scan process complete successfully
            expect(result.stdout, "stdout should be non-empty after Purple A11y process completes").to.not.be.empty;


            const purpleA11yResultsPathRegex = result.stdout.match(/Results directory is at (\S+)/);

            // TEST CASE: result directory is printed in stdout
            expect(purpleA11yResultsPathRegex, "result directory should be printed in stdout").to.be.ok;

            let purpleA11yResultsPath;
            purpleA11yResultsPath = purpleA11yResultsPathRegex[1];
            const lastSlashIndex = purpleA11yResultsPath.lastIndexOf('/');
            purpleA11yResultFolder = purpleA11yResultsPath.substring(lastSlashIndex + 1);
            return purpleA11yResultFolder
        })
})

Cypress.Commands.add('checkResultFilesCreated', (cliOptionsJson, purpleA11yResultFolder, isIntegrationMode = false) => {
    let resultZipExpectedDir;
    if (isIntegrationMode) {
        resultZipExpectedDir = `${cliOptionsJson.o}.zip`
    } else {
        resultZipExpectedDir = `${Cypress.env("purpleA11yPath")}/${cliOptionsJson.o}.zip`
    }

    // TEST CASE: result zip created & naming is based on the flag -o
    return cy.task('checkFileExist', resultZipExpectedDir)
        .then((exists) => {
            expect(exists, `result zip should be created & naming should be based on the flag -o, or based on purpleA11yInit() if running integration mode`).to.be.true;
            exists ? cy.task('deleteFile', resultZipExpectedDir) : undefined // delete result zip file so that next testcase can check if purplea11y scan did generate the result zip file

            // TEST CASE: result folder is created at directory based on the flag -e
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}`)
        }).then((exists) => {
            expect(exists, `result folder should be created at directory based on the flag -e / purpleA11yInit() if integration mode`).to.be.true;

            // TEST CASE: screenshot folder is created based on flag -a
            if (cliOptionsJson.a == "screenshots") {
                return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/elemScreenshots`)
            } else {
                return null; // Ensures the chain continues
            }

        }).then((exists) => {
            if (cliOptionsJson.a === "screenshots") {
                expect(exists, `screenshot folder should be created based on flag -a`).to.be.true;
            } else {
                expect(exists, `screenshot folder should be created based on flag -a`).to.be.null;
            }

            // TEST CASE: report.csv is created 
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/report.csv`)
        }).then((exists) => {
            expect(exists, `report.csv should be created`).to.be.true;

            // TEST CASE: report.html is created 
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/report.html`);
        }).then((exists) => {
            expect(exists, `report.html should be created`).to.be.true;

            // TEST CASE: scanDetails.csv is created 
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/scanDetails.csv`);
        }).then((exists) => {
            expect(exists, `scanDetails.csv should be created`).to.be.true;

            // TEST CASE: summary.pdf is created 
            return cy.task('checkFileExist', `${cliOptionsJson.e}/${purpleA11yResultFolder}/summary.pdf`);
        }).then((exists) => {
            expect(exists, `summary.pdf should be created`).to.be.true;

        });
});

Cypress.Commands.add('checkReportHtmlScanData', (cliOptionsJson, purpleA11yResultFolder, isIntegrationMode = false) => {
    return cy.task('readFile', `${cliOptionsJson.e}/${purpleA11yResultFolder}/report.html`)
        .then((reportHtmlData: string) => {
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
            if (cliOptionsJson.u != Cypress.env("mainTestBasicAuthUrl")) {
                expect(normalizeUrl(scanDataDecodedJson.urlScanned), `scanData.urlScanned should be according to the flag -u`).to.equal(normalizeUrl(cliOptionsJson.u));
            }

            // TEST CASE: scanData.viewport should be according what viewport was set in purpleA11yInit()
            if (isIntegrationMode) {
                const normalizeIntegrationViewport = (integrationViewport) => {
                    return `${integrationViewport.width} x ${integrationViewport.height}`
                };
                const normalizedIntegrationViewport = normalizeIntegrationViewport(cliOptionsJson.integrationViewport)
                expect(scanDataDecodedJson.viewport, `scanData.viewport should be ${normalizedIntegrationViewport} which is set in purpleA11yInit()`).to.equal(normalizedIntegrationViewport);
            } else {
                // TEST CASE: scanData.viewport should be according to the flag -d or -w
                if (cliOptionsJson.d) {
                    expect(scanDataDecodedJson.viewport, `scanData.viewport should be according to the flag -d`).to.equal(cliOptionsJson.d);
                } else if (cliOptionsJson.w) {
                    expect(scanDataDecodedJson.viewport, `scanData.viewport should be according to the flag -w`).to.equal(`CustomWidth_${cliOptionsJson.w}px`);
                }

                // TEST CASE: if p flag is specified, scanData.totalPagesScanned should be <= to the flag -p. 
                cliOptionsJson.p ? expect(scanDataDecodedJson.totalPagesScanned, `scanData.totalPagesScanned should be <= to the flag -p`).to.be.lte(Number(cliOptionsJson.p)) : undefined;

                // TEST CASE: scanData.customFlowLabel should be according to the flag -j
                expect(scanDataDecodedJson.customFlowLabel, `scanData.customFlowLabel should be according to the flag -j`).to.equal(cliOptionsJson.j);

                const blacklistedPatternsSet = new Set(Cypress.env("blacklistedPatterns"));
                let isMetaRedirectedUrlScanned = false;
                let isDiffHostnameUrlScanned = false;

                scanDataDecodedJson.pagesScanned.forEach(page => {
                    let pageUrl = normalizeUrl(page.url)

                    // TEST CASE: scanData.pagesScanned should not contain blacklisted urls according to the flag -x (blacklisted)
                    if (blacklistedPatternsSet.has(pageUrl)) {
                        expect(blacklistedPatternsSet.has(pageUrl), `scanData.pagesScanned should not contain ${pageUrl} according to the flag -x (blacklisted)`).to.be.false;
                    }

                    if (pageUrl == Cypress.env("diffHostnameUrl")) {
                        isDiffHostnameUrlScanned = true;
                    }

                    if (pageUrl == Cypress.env("metaRedirectedUrl")) {
                        isMetaRedirectedUrlScanned = true;
                    }
                });

                // TEST CASE: scanData.pagesScanned should not have any duplicates
                const pagesScannedurls = scanDataDecodedJson.pagesScanned.map(page => page.url);
                const uniquePagesScannedUrls = new Set(pagesScannedurls);
                expect(uniquePagesScannedUrls.size, `scanData.pagesScanned should not have any duplicates`).to.equal(pagesScannedurls.length);

                //testcases specific to crawlDomain scan mode
                if (cliOptionsJson.c == Cypress.env("crawlDomainCliOption") && cliOptionsJson.u != Cypress.env("mainTestBasicAuthUrl")) {
                    // TODO: this bug of the test case below is not fixed in purplea11y even though it should be
                    // TEST CASE: [crawlDomain] scanData.pagesScanned should contain meta redirected url
                    // expect(isMetaRedirectedUrlScanned, "scanData.pagesScanned should contain meta redirected url (/7.html)").to.be.true;

                    // TEST CASE: scanData.pagesScanned should not contain certain links according to the flag -s (strategy)
                    if (cliOptionsJson.s == "same-hostname") {
                        expect(isDiffHostnameUrlScanned, `scanData.pagesScanned should not contain urls of different hostname according to the flag -s (strategy)`).to.be.false;
                    } else if (cliOptionsJson.s == "same-domain") {
                        expect(isDiffHostnameUrlScanned, `scanData.pagesScanned should contain urls of different hostname but same domain according to the flag -s (strategy)`).to.be.true;
                    }

                    // TEST CASE: [crawlDomain] customEnqueueLinksByClickingElements & enqueueLinks functions work
                    Cypress.env("crawlDomainEnqueueProcessUrls").forEach(expectedUrl => {
                        expect(pagesScannedurls).to.include(expectedUrl, `URL ${expectedUrl} should be in scanData.pagesScanned to verify that customEnqueueLinksByClickingElements & enqueueLinks functions work`);
                    });
                }

                // TEST CASE: Basic auth functionality: There should be more than 90 pages scanned in the basic auth website, which has 100 anchor tags to pages with basic auth
                if (cliOptionsJson.u == Cypress.env("mainTestBasicAuthUrl")) {
                    expect(scanDataDecodedJson.totalPagesScanned, `[crawl domain basic auth functionality] scanData.totalPagesScanned should be > 90 for scanning the basic auth main website which has 100 anchor tags to pages with basic auths`).to.be.gt(90)
                }

            }

        });
});




// [KIV - BECAUSE UNABLE TO CREATE INACCESSIBLE PDF TO ADD IN TEST WEBSITE] TEST CASE: scanData.pagesScanned should be according to the flag -i (filetypes) 