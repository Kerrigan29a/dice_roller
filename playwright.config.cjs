const { defineConfig } = require('@playwright/test');
const port = Number(process.env.PORT || 4177);
const origin = `http://127.0.0.1:${port}`;
module.exports = defineConfig({
    testDir: './tests', workers: 2, timeout: 45000,
    projects: ['elm', 'gleam', 'go'].flatMap(language => [
        ...['chromium', 'firefox'].map(browserName => ({
            name: `${language}-${browserName}`, testMatch: 'dice-roller.spec.cjs',
            metadata: { language }, use: { browserName, baseURL: `${origin}/${language}/` },
        })),
        { name: `${language}-replay`, testMatch: 'replay.spec.cjs', metadata: { language }, use: { baseURL: `${origin}/${language}/` } },
    ]),
    webServer: { command: `python3 -m http.server ${port} --bind 127.0.0.1 --directory dist`, url: origin, stdout: 'ignore', stderr: 'ignore' },
});
