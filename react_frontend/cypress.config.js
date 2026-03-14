import { defineConfig } from 'cypress';

export default defineConfig({
    video: true,
    screenshotOnRunFailure: true,
    e2e: {
        baseUrl: 'http://localhost:5173',
        viewportWidth: 1366,
        viewportHeight: 768,
        supportFile: 'cypress/support/e2e.js',
        specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
        setupNodeEvents(on, config) {
            return config;
        },
    },
});
