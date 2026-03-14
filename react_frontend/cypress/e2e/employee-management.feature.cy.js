describe('Employee Management Feature', () => {
    beforeEach(() => {
        cy.fixture('employee-management.fixture').as('employeeData');
    });

    it('loads employee list and filters by search term', function () {
        cy.intercept('GET', '**/api/v1/check-auth', {
            statusCode: 200,
            body: this.employeeData.checkAuthResponse,
        }).as('checkAuth');

        cy.intercept('GET', '**/api/v1/emp*', {
            statusCode: 200,
            body: this.employeeData.employeesResponse,
        }).as('getEmployees');

        cy.intercept('GET', '**/api/v1/department*', {
            statusCode: 200,
            body: this.employeeData.departmentsResponse,
        }).as('getDepartments');

        cy.visit('/employees');

        cy.wait('@checkAuth');
        cy.wait('@getEmployees');

        cy.contains('Employee Management').should('be.visible');
        cy.contains('Alice Johnson').should('be.visible');
        cy.contains('Bob Perera').should('be.visible');

        cy.get('input[placeholder="Search employees..."]').type('Alice');
        cy.contains('Alice Johnson').should('be.visible');
        cy.contains('Bob Perera').should('not.exist');
    });

    it('deletes an employee from the details modal', function () {
        cy.intercept('GET', '**/api/v1/check-auth', {
            statusCode: 200,
            body: this.employeeData.checkAuthResponse,
        }).as('checkAuth');

        cy.intercept('GET', '**/api/v1/emp*', {
            statusCode: 200,
            body: this.employeeData.employeesResponse,
        }).as('getEmployees');

        cy.intercept('GET', '**/api/v1/department*', {
            statusCode: 200,
            body: this.employeeData.departmentsResponse,
        }).as('getDepartments');

        cy.intercept('DELETE', '**/api/v1/emp/emp-1', {
            statusCode: 200,
            body: this.employeeData.deleteEmployeeResponse,
        }).as('deleteEmployee');

        cy.visit('/employees');

        cy.wait('@checkAuth');
        cy.wait('@getEmployees');

        cy.contains('Alice Johnson').click();
        cy.get('button[title="Delete Employee"]').click();
        cy.contains('button', 'Delete Employee').last().click();

        cy.wait('@deleteEmployee');
        cy.contains('Employee Deleted').should('be.visible');
    });
});
