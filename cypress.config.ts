import { defineConfig } from "cypress";
import purpleA11yInit from "purplea11y";
import mochawesome from 'cypress-mochawesome-reporter/plugin';

interface ViewportSettings {
    width: number;
    height: number;
}

interface Thresholds {
    mustFix: number;
    goodToFix: number;
}

interface ScanAboutMetadata {
    browser: string;
}

// viewport used in tests to optimise screenshots
const viewportSettings: ViewportSettings = { width: 1920, height: 1040 };
// specifies the number of occurrences before error is thrown for test failure
const thresholds: Thresholds = { mustFix: 20, goodToFix: 20 };
// additional information to include in the "Scan About" section of the report
const scanAboutMetadata: ScanAboutMetadata = { browser: 'Chrome (Desktop)' };

const name: string = "PurpleA11y functional test";
const email: string = "accessibility@tech.gov.sg"
const defaultTestUrl: string = "https://www.tech.gov.sg"

const purpleA11y = await purpleA11yInit(
    defaultTestUrl, // initial url to start scan
    "purplea11y test", // label for test. Update gitignore accordingly if change
    name,
    email,
    true, // include screenshots of affected elements in the report
    viewportSettings,
    thresholds,
    scanAboutMetadata,
);

const zipName = "purple_a11y_test"
const customFlowLabel = "purple a11y test label"

// cli options A, B, C are all the permutations of the cli flags
//X and E UNSURE
const cliOptionsA = {
    u: defaultTestUrl,
    d: "Desktop",
    o: zipName, 
    p: 1, //to vary (105)
    h: "yes",
    b: "chromium", //to vary
    s: "same-domain",
    // e: 'here', // UNSURE
    j: customFlowLabel,
    k: `${name}:${email}`,
    t: "20",
    i: "all",
    // x: "something", //UNSURE
    a: "screenshots" //need to vary
}

const cliOptionsB = {
    u: defaultTestUrl,
    d: "Mobile",
    o: zipName, 
    p: 100, //to vary
    h: "no",
    b: "chrome", //to vary
    s: "same-hostname",
    // e: 'here', // UNSURE
    j: customFlowLabel,
    k: `${name}:${email}`,
    t: "15",
    i: "pdf-only",
    // x: "something", //UNSURE
    a: "none" //need to vary
}

const cliOptionsC = {
    u: defaultTestUrl,
    w: 350,
    o: zipName, 
    p: 90, //to vary
    h: "yes",
    b: "edge", //to vary
    s: "same-domain",
    // e: 'here', // UNSURE
    j: customFlowLabel,
    k: `${name}:${email}`,
    t: "10",
    i: "html-only",
    // x: "something", //UNSURE
    a: "screenshots" //need to vary
}

const generateCliCommand = (cliOptions) => {
    // Start the command with the base command
    let command = 'npm run cli --';
  
    // Loop through each property in the settings object
    for (const [key, value] of Object.entries(cliOptions)) {
      // Check the type of the value and format it accordingly
      if (typeof value === 'string') {
        command += ` -${key} "${value}"`;
      } else {
        command += ` -${key} ${value}`;
      }
    }
  
    return command;
  };

const cliCommandA = generateCliCommand(cliOptionsA)
const purpleA11yPath = "node_modules/purplea11y"

export default defineConfig({
    taskTimeout: 120000, // need to extend as screenshot function requires some time
    viewportHeight: viewportSettings.height,
    viewportWidth: viewportSettings.width,
    e2e: {
        setupNodeEvents(on, config) {
            process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "1"; //this prevents a warning in stderr when cy.exec() is called
            config.env.cliCommandA = cliCommandA;
            config.env.purpleA11yPath = purpleA11yPath;


            mochawesome(on);
            on("task", {
                getPurpleA11yScripts(): string {
                    return purpleA11y.getScripts();
                },
                async pushPurpleA11yScanResults({ res, metadata, elementsToClick }: { res: any, metadata: any, elementsToClick: any[] }): Promise<{ mustFix: number, goodToFix: number }> {
                    return await purpleA11y.pushScanResults(res, metadata, elementsToClick);
                },
                returnResultsDir(): string {
                    return `results/${purpleA11y.randomToken}_${purpleA11y.scanDetails.urlsCrawled.scanned.length}pages/reports/report.html`;
                },
                finishPurpleA11yTestCase(): null {
                    purpleA11y.testThresholds();
                    return null;
                },
                async terminatePurpleA11y(): Promise<null> {
                    return await purpleA11y.terminate();
                },
            });
            return config;
        },
        supportFile: 'dist/cypress/support/e2e.js',
        specPattern: 'dist/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        reporter: 'cypress-mochawesome-reporter',
        reporterOptions: {
            reportDir: 'cypress/reports',
            overwrite: true,
            html: true,
            json: true,
        },
    },
});