declare namespace Cypress {
  interface Chainable<Subject> {
    injectPurpleA11yScripts(): Chainable<void>;
    runPurpleA11yScan(options?: PurpleA11yScanOptions): Chainable<void>;
    terminatePurpleA11y(): Chainable<any>;
    runPurpleA11yProcess(cliOptionsJson: CliOptionsJson): Chainable<unknown>;
    checkResultFilesCreated(cliOptionsJson: CliOptionsJson, purpleA11yResultFolder: string, isIntegrationMode?: boolean): Chainable<unknown>;
    checkReportHtmlScanData(cliOptionsJson: CliOptionsJson, purpleA11yResultFolder: string, isIntegrationMode?: boolean): Chainable<unknown>;
  }

  interface PurpleA11yScanOptions {
    elementsToScan?: string[];
    elementsToClick?: string[];
    metadata?: string;
  }

  interface CliOptionsJson {
    d?: string;
    t?: string;
    i?: string;
    a?: string;
    o?: string;
    e?: string;
    j?: string;
    k?: string;
    x?: string;
    b?: string;
    p?: number;
    w?: number;
    s?: string;
    a?: string;
    u?: string;
    c?: string;
    integrationViewport?: viewportSettings;
  }

}

interface ViewportSettings {
  width: number;
  height: number;
}

interface Window {
  runA11yScan: (elementsToScan?: string[]) => Promise<any>;
}
