const { defineConfig } = require('@playwright/test');

const baseURL = 'http://127.0.0.1:4173';

module.exports = defineConfig({
    testDir: './tests',
    use: { baseURL },
    webServer: {
        command: 'python -m http.server 4173 --bind 127.0.0.1 --directory dist',
        url: baseURL,
    },
});
