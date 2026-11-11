const { test, expect, chromium, firefox } = require('@playwright/test');

const engines = { chromium, firefox };
const storageKey = 'gleam-dice-roller-v1';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const tab = (page, name) => page.getByRole('tab', { name, exact: true });

async function share(page) {
    await button(page, 'Share').click();
    const dialog = page.getByRole('dialog', { name: 'Share results' });
    const link = await dialog.getByRole('textbox', { name: 'Results link' }).inputValue();
    await button(dialog, 'Close').click();
    return link;
}

async function showAllHistory(page) {
    const expand = page.getByRole('button', { name: /^View all \d+ results$/ });
    if (await expand.count()) await expand.click();
}

function outcomes(page) {
    return page.locator('.history-item').evaluateAll((items) => items.map((item) => ({
        dice: [...item.querySelectorAll('.die-group')].map((die) => ({
            rolls: die.textContent,
            kept: die.classList.contains('kept'),
        })),
        score: item.querySelector('.aggregate-result')?.textContent ?? null,
        word: item.querySelector('.word-result')?.textContent ?? null,
        icons: [...item.querySelectorAll('img')].map((icon) => icon.getAttribute('src')),
        timestamp: item.querySelector('time').getAttribute('datetime'),
    })));
}

function withoutTimes(items) {
    return items.map(({ timestamp, ...item }) => item);
}

async function roll(page, sides, count, mode) {
    await tab(page, 'Dice').click();
    await button(page, 'd' + sides).click();
    await page.locator('#dice-amount').fill(String(count));
    await page.getByRole('checkbox', { name: 'Exploding' }).check();
    await page.getByRole('radio', { name: mode, exact: true }).check();
    const label = (mode === 'All' ? '' : mode + ' ') + count + 'd' + sides + '!';
    await button(page, 'Roll ' + label).click();
    await expect(page.locator('.result-content .die-group')).toHaveCount(count);
}

async function ask(page) {
    await tab(page, 'Words').click();
    await button(page, 'Ask').click();
    await expect(page.locator('.result-content .word-result')).toBeVisible();
}

async function icons(page, count) {
    await tab(page, 'Pictograms').click();
    await page.locator('#icon-amount').fill(String(count));
    await button(page, 'Show icons').click();
    await expect(page.locator('.result-content img')).toHaveCount(count);
}

for (const [from, to, seed] of [['chromium', 'firefox', 73], ['firefox', 'chromium', 2147483646]]) {
    test(`${from} links replay and continue identically in a fresh ${to} browser`, async ({ baseURL }) => {
        const sourceBrowser = await engines[from].launch();
        const targetBrowser = await engines[to].launch();
        try {
            const source = await sourceBrowser.newContext({ baseURL, timezoneId: 'Europe/Madrid' });
            const target = await targetBrowser.newContext({ baseURL, timezoneId: 'America/Los_Angeles' });
            await source.addInitScript(({ key, seed }) => {
                if (localStorage.getItem(key) === null) {
                    localStorage.setItem(key, JSON.stringify({
                        format: 'gleam-dice-roller', version: 2, seed, theme: 'dark', actions: [],
                    }));
                }
            }, { key: storageKey, seed });
            const sourcePage = await source.newPage();
            const targetPage = await target.newPage();
            const errors = [];
            sourcePage.on('pageerror', (error) => errors.push(error.message));
            targetPage.on('pageerror', (error) => errors.push(error.message));
            await sourcePage.goto('/');
            for (const mode of ['All', 'Max', 'Min', 'Sum']) await roll(sourcePage, 6, 5, mode);
            await ask(sourcePage);
            await icons(sourcePage, 4);
            await showAllHistory(sourcePage);
            await expect(sourcePage.locator('.history-item')).toHaveCount(6);
            const expected = await outcomes(sourcePage);
            const link = await share(sourcePage);
            const archive = JSON.parse(Buffer.from(new URL(link).searchParams.get('state'), 'base64').toString('utf8'));
            expect(archive).toMatchObject({ format: 'gleam-dice-roller', version: 2, seed, theme: 'dark' });
            expect(archive.actions).toHaveLength(6);

            await targetPage.goto(link);
            await expect(button(targetPage, 'Roll 1d6')).toBeEnabled();
            await expect(targetPage.locator('.app-shell')).toHaveAttribute('data-theme', 'dark');
            await showAllHistory(targetPage);
            await expect(targetPage.locator('.history-item img')).toHaveCount(4);
            expect(await outcomes(targetPage)).toEqual(expected);
            await expect.poll(() => targetPage.evaluate((key) => JSON.parse(localStorage.getItem(key)), storageKey)).toEqual(archive);
            for (const page of [sourcePage, targetPage]) {
                await roll(page, 4, 4, 'Sum');
                await ask(page);
                await icons(page, 6);
                await showAllHistory(page);
                await expect(page.locator('.history-item')).toHaveCount(9);
            }
            const continued = await outcomes(sourcePage);
            expect(withoutTimes(await outcomes(targetPage))).toEqual(withoutTimes(continued));

            const continuedLink = await share(targetPage);
            expect(continuedLink).toBe(targetPage.url());
            expect(new URL(continuedLink).searchParams.has('session')).toBe(false);
            await sourcePage.goto(continuedLink);
            await expect(button(sourcePage, 'Show icons')).toBeEnabled();
            await showAllHistory(sourcePage);
            await expect(sourcePage.locator('.history-item img')).toHaveCount(10);
            expect(withoutTimes(await outcomes(sourcePage))).toEqual(withoutTimes(continued));
            await targetPage.goto(link);
            await showAllHistory(targetPage);
            await expect(targetPage.locator('.history-item')).toHaveCount(6);
            expect(await outcomes(targetPage)).toEqual(expected);
            expect(errors).toEqual([]);
        } finally {
            await sourceBrowser.close();
            await targetBrowser.close();
        }
    });
}
