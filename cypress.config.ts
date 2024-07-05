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

const diffHostnameUrl = "https://lrperzus.github.io/purple-a11y-strategy-test/"
const mainTestHomePageUrl = "https://leeyixuan21.github.io"
const mainTestSitemapXmlUrl = `${mainTestHomePageUrl}/sitemap.xml`
const mainTestSitemapRssUrl = `${mainTestHomePageUrl}/sitemap.rss`
const mainTestSitemapAtomUrl = `${mainTestHomePageUrl}/sitemap.atom`

const commonCliOptions = {
    "o": "purple_a11y_test",
    "e": `${getProjectRootDirectory()}/purpleA11yResults`, 
    "j": "purple a11y test label",
    "k": `${name}:${email}`,
    "x": `${getProjectRootDirectory()}/blacklistedPatterns.txt`
}

const localFilesFolderDirectory = `${getProjectRootDirectory()}/localFilesForTesting`
const localHtmlFileDirectory = `${localFilesFolderDirectory}/a.html`
const localHtmFileDirectory = `${localFilesFolderDirectory}/b.htm`
const localXhtmlFileDirectory = `${localFilesFolderDirectory}/c.xhtml`
const localXmlFileDirectory = `${localFilesFolderDirectory}/d.xml`
const localTxtFileDirectory = `${localFilesFolderDirectory}/e.txt`

const purpleA11y = await purpleA11yInit(
    mainTestHomePageUrl, // initial url to start scan
    "purplea11y test", // label for test. Update gitignore accordingly if change
    name,
    email,
    true, // include screenshots of affected elements in the report
    viewportSettings,
    thresholds,
    scanAboutMetadata,
);


// cliOptionsJson A, B, C are all the permutations of the cli flags
const cliOptionsJsonA = {
    ...commonCliOptions,
    "d": "Desktop",
    "p": 3,  //120
    "h": "yes", 
    "b": "chromium", 
    "t": "20",
    "i": "all", // KIV: need to vary (pdf-only/html-only) for B & C once we are able to create pdfs with accessibility issues
    "a": "screenshots" // TODO: add check to assert that ss file is not there when -a is none
}

const cliOptionsJsonB = {
    ...commonCliOptions,
    "d": "Mobile",
    "p": 3, //110
    "h": "no",
    "b": "chrome", 
    "t": "15",
    "i": "all",
    "a": "none" 
}

const cliOptionsJsonC = {
    ...commonCliOptions,
    "w": 350,
    "p": 3, //100
    "h": "yes",
    "b": "edge", 
    "t": "10",
    "i": "all",
    "a": "screenshots" 
}

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
    `${mainTestHomePageUrl}/2.html`,
    `${mainTestHomePageUrl}/3.html`,
    `${mainTestHomePageUrl}/4.html`,
    `${mainTestHomePageUrl}/5.html`,
    `${mainTestHomePageUrl}/6.html`,
];

export default defineConfig({
    taskTimeout: 120000, // need to extend as screenshot function requires some time
    viewportHeight: viewportSettings.height,
    viewportWidth: viewportSettings.width,
    e2e: {
        setupNodeEvents(on, config) {
            // cypress env variables to use across the project
            config.env.cliOptionsJsonA = cliOptionsJsonA;
            config.env.cliOptionsJsonB = cliOptionsJsonB;
            config.env.cliOptionsJsonC = cliOptionsJsonC;
            config.env.purpleA11yPath = purpleA11yPath;
            config.env.blacklistedPatterns = blacklistedPatterns;
            config.env.crawlDomainEnqueueProcessUrls = crawlDomainEnqueueProcessUrls;
            config.env.crawlDomainCliOption = scanModeCliOption.crawlDomain;
            config.env.crawlSitemapCliOption = scanModeCliOption.crawlSitemap;
            config.env.customFlowCliOption = scanModeCliOption.customFlow;
            config.env.crawlIntelligentCliOption = scanModeCliOption.crawlIntelligent;
            config.env.crawlLocalFileCliOption = scanModeCliOption.crawlLocalFile;
            config.env.diffHostnameUrl = diffHostnameUrl;
            config.env.mainTestHomePageUrl = mainTestHomePageUrl;
            config.env.mainTestSitemapXmlUrl = mainTestSitemapXmlUrl;
            config.env.mainTestSitemapRssUrl = mainTestSitemapRssUrl;
            config.env.mainTestSitemapAtomUrl = mainTestSitemapAtomUrl;
            config.env.IT_RUN_SCAN = "Process should complete & generate result files";
            config.env.IT_CHECK_SCANDATA = "scanData in report.html should correspond to cli command flags";
            config.env.localHtmlFileDirectory = localHtmlFileDirectory;
            config.env.localHtmFileDirectory = localHtmFileDirectory;
            config.env.localXhtmlFileDirectory = localXhtmlFileDirectory;
            config.env.localXmlFileDirectory = localXmlFileDirectory;
            config.env.localTxtFileDirectory = localTxtFileDirectory;



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