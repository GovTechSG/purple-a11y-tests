describe("Integration", () => {
    it("should generate results after scan", () => {
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
        cy.terminatePurpleA11y();

    });
});