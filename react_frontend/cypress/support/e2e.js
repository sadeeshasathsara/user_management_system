// Global setup/teardown for E2E tests.
beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
});

afterEach(function () {
    const title = (this.currentTest?.fullTitle?.() || 'test')
        .replace(/[^a-zA-Z0-9-_ ]/g, '')
        .replace(/\s+/g, '_')
        .slice(0, 120);

    // Keep visual evidence for every run (including passed tests).
    cy.screenshot(`run-${Cypress.spec.name}-${title}`, { capture: 'viewport' });

    cy.clearCookies();
    cy.clearLocalStorage();
});
