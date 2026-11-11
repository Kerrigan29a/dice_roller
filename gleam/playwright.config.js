const { defineConfig } = require('@playwright/test');

const port = Number(process.env.PORT || 4174);
const baseURL = `http://127.0.0.1:${port}`;

module.exports = defineConfig({
    testDir: './tests',
    workers: 2,
    use: { baseURL },
    projects: [
        { name: 'chromium', testMatch: 'dice-roller.spec.js', use: { browserName: 'chromium' } },
        { name: 'firefox', testMatch: 'dice-roller.spec.js', use: { browserName: 'firefox' } },
        { name: 'replay', testMatch: 'replay.spec.js' },
    ],
    webServer: {
        command: `python -m http.server ${port} --bind 127.0.0.1 --directory dist`,
        url: baseURL,
    },
});
