import { defineConfig } from "cypress";
import purpleA11yInit from "purplea11y";
import mochawesome from 'cypress-mochawesome-reporter/plugin';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';
import safe from 'safe-regex';

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

const getProjectRootDirectory = () => {
    let currentDir = dirname(fileURLToPath(import.meta.url));
    while (!fs.existsSync(resolve(currentDir, 'package.json'))) {
        const parentDir = dirname(currentDir);
        if (parentDir === currentDir) {
            throw new Error('Could not find project root');
        }
        currentDir = parentDir;
    }
    return currentDir;
}

const scanModeCliOption = {
    "crawlSitemap": "1",
    "crawlDomain": "2",
    "customFlow": "3",
    "crawlIntelligent": "4",
    "crawlLocalFile": "5",
}

const commonCliOptions = {
    "u": "https://leeyixuan21.github.io",
    "o": "purple_a11y_test",
    "e": `${getProjectRootDirectory()}/purpleA11yResults`, 
    "j": "purple a11y test label",
    "k": `${name}:${email}`,
    "x": `${getProjectRootDirectory()}/blacklistedPatterns.txt`
}

const purpleA11y = await purpleA11yInit(
    commonCliOptions.u, // initial url to start scan
    "purplea11y test", // label for test. Update gitignore accordingly if change
    name,
    email,
    true, // include screenshots of affected elements in the report
    viewportSettings,
    thresholds,
    scanAboutMetadata,
);


// cli options A, B, C are all the permutations of the cli flags

const cliOptionsJsonA = {
    "u": commonCliOptions.u,
    "d": "Desktop",
    "o": commonCliOptions.o, 
    "p": 100, //to vary (105)
    "h": "no", //yes
    "b": "chromium", //to vary
    "s": "same-domain",
    "e": commonCliOptions.e, 
    "j": commonCliOptions.j,
    "k": `${name}:${email}`,
    "t": "20",
    "i": "all",
    "x": commonCliOptions.x,
    "a": "screenshots" //need to vary
}

// const cliOptionsJsonB = {
//     u: defaultTestUrl,
//     d: "Mobile",
//     o: zipName, 
//     p: 100, //to vary
//     h: "no",
//     b: "chrome", //to vary
//     s: "same-hostname",
//     // e: 'here', // UNSURE
//     j: customFlowLabel,
//     k: `${name}:${email}`,
//     t: "15",
//     i: "pdf-only",
//     "x": blacklistedPatternsFileDir,
//     a: "none" //need to vary
// }

// const cliOptionsJsonC = {
//     u: defaultTestUrl,
//     w: 350,
//     o: zipName, 
//     p: 90, //to vary
//     h: "yes",
//     b: "edge", //to vary
//     s: "same-domain",
//     // e: 'here', // UNSURE
//     j: customFlowLabel,
//     k: `${name}:${email}`,
//     t: "10",
//     i: "html-only",
//     "x": blacklistedPatternsFileDir,
//     a: "screenshots" //need to vary
// }

const purpleA11yPath = "node_modules/purplea11y"

const getBlackListedPatterns = (blacklistedPatternsFilename: string|null): string[] | null=> {
    let exclusionsFile: any = null;
    if (blacklistedPatternsFilename) {
      exclusionsFile = blacklistedPatternsFilename;
    }
  
    if (!exclusionsFile) {
      return null;
    }
  
    const rawPatterns = fs.readFileSync(exclusionsFile).toString();
    const blacklistedPatterns = rawPatterns
      .split('\n')
      .map(p => p.trim())
      .filter(p => p !== '');
  
    const unsafe = blacklistedPatterns.filter(pattern => !safe(pattern));
    if (unsafe.length > 0) {
      const unsafeExpressionsError = `Unsafe expressions detected: ${unsafe} Please revise ${exclusionsFile}`;
      throw new Error(unsafeExpressionsError);
    }
  
    return blacklistedPatterns;
  };

  const blacklistedPatterns = getBlackListedPatterns(commonCliOptions.x)

  // urls that must be scanned to verify that crawl domain's customEnqueueLinksByClickingElements & enqueueLinks functions work
  const crawlDomainEnqueueProcessUrls = [
    `${commonCliOptions.u}/2.html`,
    `${commonCliOptions.u}/3.html`,
    `${commonCliOptions.u}/4.html`,
    `${commonCliOptions.u}/5.html`,
    `${commonCliOptions.u}/6.html`,
];

export default defineConfig({
    taskTimeout: 120000, // need to extend as screenshot function requires some time
    viewportHeight: viewportSettings.height,
    viewportWidth: viewportSettings.width,
    e2e: {
        setupNodeEvents(on, config) {
            // cypress env variables to use across the project
            // config.env.cliCommandA = cliCommandA;
            config.env.cliOptionsJsonA = cliOptionsJsonA;
            config.env.purpleA11yPath = purpleA11yPath;
            config.env.blacklistedPatterns = blacklistedPatterns;
            config.env.crawlDomainEnqueueProcessUrls = crawlDomainEnqueueProcessUrls;
            config.env.crawlDomainCliOption = scanModeCliOption.crawlDomain;
            config.env.crawlSitemapCliOption = scanModeCliOption.crawlSitemap;
            config.env.customFlowCliOption = scanModeCliOption.customFlow;
            config.env.crawlIntelligentCliOption = scanModeCliOption.crawlIntelligent;
            config.env.CrawlLocalFileCliOption = scanModeCliOption.crawlLocalFile;
            

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
                checkFileExist(filename) {
                    return fs.existsSync(filename)
                },
                readFile(filename) {
                    return fs.readFileSync(filename, { encoding: "utf-8" })
                }
                
                
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