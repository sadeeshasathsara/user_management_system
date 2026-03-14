// Global setup/teardown for E2E tests.
beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
});

afterEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
});
