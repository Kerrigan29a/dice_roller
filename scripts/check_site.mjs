// Exercise the actual published directory layout, including PWA scope isolation.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../gleam/package.json', import.meta.url));
const { chromium, firefox } = require('@playwright/test');
const base = new URL(process.argv[2] || 'http://127.0.0.1:4176/dice_roller/');

for (const [name, engine] of Object.entries({ chromium, firefox })) {
    const browser = await engine.launch();
    try {
        const context = await browser.newContext();
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        page.on('response', response => {
            if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
        });
        await page.goto(base.href);
        await page.getByRole('heading', { name: 'Dice Roller', exact: true }).waitFor();
        for (const language of ['elm', 'gleam', 'go']) {
            assert.equal(await page.locator(`nav a[href="${language}/"]`).count(), 1);
        }
        for (const width of [1280, 390, 320]) {
            await page.setViewportSize({ width, height: 800 });
            assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Landing page overflows');
        }
        if (name === 'chromium') {
            await page.screenshot({ path: '/private/tmp/dice-roller-landing-mobile.png', fullPage: true });
            await page.setViewportSize({ width: 1280, height: 850 });
            await page.screenshot({ path: '/private/tmp/dice-roller-landing-desktop.png', fullPage: true });
        }
        for (const language of ['elm', 'gleam', 'go']) {
            // Intentionally omit the slash; the host must redirect to the directory.
            const app = new URL(language, base);
            await page.goto(app.href);
            assert.equal(new URL(page.url()).pathname, app.pathname + '/');
            const roll = page.getByRole('button', { name: /^Roll(?: |$)/ });
            await roll.waitFor();
            await roll.click();
            const result = language === 'go' ? page.locator('#output') : page.locator('.result-content .die-group');
            await result.waitFor();
            if (language !== 'go') assert.match(await result.first().innerText(), /\d/);
            else assert.match(await result.innerText(), /\d/);
            await page.evaluate(async () => {
                const ready = await navigator.serviceWorker.ready;
                if (!navigator.serviceWorker.controller) {
                    await new Promise(resolve => navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }));
                }
                return ready.scope;
            });
            assert.equal(await page.evaluate(() => new URL(navigator.serviceWorker.controller.scriptURL).pathname), app.pathname + '/service-worker.js');
            await context.setOffline(true);
            await page.reload();
            await roll.waitFor();
            await roll.click();
            await result.waitFor();
            await context.setOffline(false);
        }
        await page.goto(base.href);
        assert.equal(await page.evaluate(() => navigator.serviceWorker.controller), null, 'An app worker controls the landing page');
        const scopes = await page.evaluate(async () => (await navigator.serviceWorker.getRegistrations()).map(worker => new URL(worker.scope).pathname).sort());
        assert.deepEqual(scopes, ['elm', 'gleam', 'go'].map(language => base.pathname + language + '/').sort());
        assert.deepEqual(errors, []);
        console.log(`${name}: landing, links, redirects, three apps, isolated workers and offline reload passed`);
        await context.close();
    } finally {
        await browser.close();
    }
}
