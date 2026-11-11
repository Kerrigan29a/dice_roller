const { test, expect } = require('@playwright/test');

const storageKey = 'gleam-dice-roller-v1';
const button = (page, name) => page.getByRole('button', { name, exact: true });
const tab = (page, name) => page.getByRole('tab', { name, exact: true });
const resultMode = (page, name) => page.getByRole('radio', { name, exact: true });
const result = (page) => page.locator('.result-content');
const history = (page) => page.locator('.history-item');

function archive(fields = {}) {
    return { format: 'gleam-dice-roller', version: 2, seed: 73, theme: 'auto', actions: [], ...fields };
}

function readState(page, key = storageKey) {
    return page.evaluate((name) => JSON.parse(localStorage.getItem(name)), key);
}

function linkedState(page) {
    const token = new URL(page.url()).searchParams.get('state');
    return JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
}

function pictogramOffset(page) {
    return result(page).locator('.pictograms').evaluate((group) => {
        const images = [...group.querySelectorAll('img')].map((image) => image.getBoundingClientRect());
        const bounds = group.getBoundingClientRect();
        const middle = (Math.min(...images.map((image) => image.left)) + Math.max(...images.map((image) => image.right))) / 2;
        return Math.abs(middle - (bounds.left + bounds.right) / 2);
    });
}

function stateLink(state) {
    return '/?state=' + encodeURIComponent(Buffer.from(JSON.stringify(state)).toString('base64'));
}

async function openApp(page) {
    await page.goto('/');
    await expect(button(page, 'Roll 1d6')).toBeEnabled();
    await expect.poll(async () => (await readState(page))?.seed).toBeGreaterThan(0);
}

async function shareLink(page) {
    await button(page, 'Share').click();
    const dialog = page.getByRole('dialog', { name: 'Share results' });
    const field = dialog.getByRole('textbox', { name: 'Results link' });
    await expect(field).toHaveValue(/\?state=/);
    const url = await field.inputValue();
    await button(dialog, 'Close').click();
    return url;
}

test('header controls are direct on desktop and collapse into More on mobile', async ({ page }) => {
    await openApp(page);
    const session = page.locator('.more-menu summary');
    const theme = page.getByRole('combobox', { name: 'Theme', exact: true });
    await expect(session).toBeHidden();
    await expect(theme).toBeVisible();
    await expect(button(page, 'Clear history…')).toBeVisible();
    await expect(page.locator('.brand .app-version')).toHaveText('v0.9.0');
    await expect(page.locator('.header-actions .app-version')).toHaveCount(0);
    const shareBounds = await button(page, 'Share').boundingBox();
    const themeBounds = await theme.boundingBox();
    const clearBounds = await button(page, 'Clear history…').boundingBox();
    const middle = (bounds) => bounds.y + bounds.height / 2;
    expect(Math.abs(middle(shareBounds) - middle(themeBounds))).toBeLessThan(1);
    expect(Math.abs(middle(shareBounds) - middle(clearBounds))).toBeLessThan(1);
    expect(clearBounds.x - (themeBounds.x + themeBounds.width))
        .toBeGreaterThan(themeBounds.x - (shareBounds.x + shareBounds.width));
    const labelTarget = await page.locator('label[for="theme-desktop"]').evaluate((label) => {
        const bounds = label.getBoundingClientRect();
        return document.elementFromPoint(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2).id;
    });
    expect(labelTarget).toBe('theme-desktop');
    await button(page, 'Share').focus();
    await page.keyboard.press('Tab');
    await expect(theme).toBeFocused();
    await page.keyboard.press('l');
    await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'light');

    await page.setViewportSize({ width: 320, height: 568 });
    await expect(session).toBeVisible();
    await expect(session).toHaveAccessibleName('More');
    await expect(theme).toBeHidden();
    const textCenters = await page.evaluate(() => {
        function center(selector) {
            const element = document.querySelector(selector);
            const text = [...element.childNodes].find((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim());
            const range = document.createRange();
            range.selectNodeContents(text);
            const bounds = range.getBoundingClientRect();
            return bounds.y + bounds.height / 2;
        }
        return [center('.header-utilities > button'), center('.more-menu summary')];
    });
    expect(Math.abs(textCenters[0] - textCenters[1])).toBeLessThan(1);
    await session.click();
    await expect(theme).toBeVisible();
    await theme.selectOption('dark');
    await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'dark');
    await button(page, 'Clear history…').click();
    const dialog = page.getByRole('dialog', { name: 'Clear history?' });
    await expect(dialog).toBeVisible();
    await button(dialog, 'Cancel').click();
});

test('number fields can be erased, validated and edited from the keyboard', async ({ page }) => {
    await openApp(page);
    const amount = page.locator('#dice-amount');
    await amount.press('ControlOrMeta+A');
    await amount.press('Backspace');
    await expect(amount).toHaveValue('');
    await button(page, 'Roll').click();
    await expect(amount).toBeFocused();
    await expect(amount).toHaveAttribute('aria-invalid', 'true');
    await amount.pressSequentially('2');
    await expect(button(page, 'Roll 2d6')).toBeEnabled();

    await button(page, 'Custom').click();
    const sides = page.locator('#dice-sides');
    await expect(sides).toBeFocused();
    await sides.fill('');
    await sides.pressSequentially('8');
    await sides.press('Enter');
    await expect(result(page).locator('.die-group')).toHaveCount(2);

    await tab(page, 'Pictograms').click();
    const icons = page.locator('#icon-amount');
    await icons.press('ControlOrMeta+A');
    await icons.press('Backspace');
    await expect(icons).toHaveValue('');
    await button(page, 'Show icons').click();
    await expect(icons).toHaveAttribute('aria-invalid', 'true');
    await icons.pressSequentially('4');
    await button(page, 'Show icons').click();
    await expect(result(page).getByRole('img')).toHaveCount(4);
    expect(await pictogramOffset(page)).toBeLessThan(1);
    const latest = history(page).first();
    await expect(latest.getByRole('img')).toHaveCount(4);

    await tab(page, 'Dice').click();
    await expect(amount).toHaveValue('2');
    await expect(sides).toHaveValue('8');
    await page.reload();
    await expect(button(page, 'Roll 2d8')).toBeEnabled();
});

test('touch buttons adjust the dice count without focusing the editor', async ({ browser, browserName, baseURL }) => {
    const context = await browser.newContext({ baseURL, hasTouch: true, isMobile: browserName === 'chromium', viewport: { width: 320, height: 568 } });
    try {
        const page = await context.newPage();
        await openApp(page);
        const amount = page.locator('#dice-amount');
        const fewer = button(page, 'Fewer dice');
        const more = button(page, 'More dice');
        await expect(fewer).toBeDisabled();
        await more.tap();
        await more.tap();
        await expect(amount).toHaveValue('3');
        await expect(amount).not.toBeFocused();
        await page.getByRole('checkbox', { name: 'Exploding' }).tap();
        await resultMode(page, 'Max').tap();
        await button(page, 'Roll Max 3d6!').tap();
        await expect(result(page).locator('.aggregate-result')).toBeInViewport({ ratio: 1 });
        expect(await page.evaluate(() => window.scrollY)).toBe(0);
        await fewer.tap();
        await expect(amount).toHaveValue('2');
        await page.reload();
        await expect(button(page, 'Roll Max 2d6!')).toBeEnabled();
        await tab(page, 'Pictograms').tap();
        const icons = page.getByRole('textbox', { name: 'Pictogram count' });
        const original = Number(await icons.inputValue());
        await button(page, 'More pictograms').tap();
        await expect(icons).toHaveValue(String(original + 1));
        await expect(icons).not.toBeFocused();
    } finally {
        await context.close();
    }
});

test('mobile and desktop keep the result beside its controls and make repeat explicit', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 820 });
    await openApp(page);
    await expect(page.locator('.topbar img')).toHaveAttribute('src', 'brand-die.png');
    const workspace = page.locator('.workspace');
    const columns = () => workspace.evaluate((node) => getComputedStyle(node).gridTemplateColumns.split(' ').length);
    expect(await columns()).toBe(1);
    expect(await page.locator('body').evaluate((node) => node.scrollWidth)).toBeLessThanOrEqual(320);
    await button(page, 'Roll 1d6').click();
    await expect(result(page).locator('.die-group')).toBeVisible();
    await expect(history(page)).toHaveCount(1);
    await history(page).first().locator('.history-content').click();
    await expect(history(page)).toHaveCount(1);
    await button(page, 'Repeat 1d6').click();
    await expect(history(page)).toHaveCount(2);
    await expect(page.getByRole('heading', { name: 'Latest result' })).toBeFocused();

    await page.setViewportSize({ width: 1280, height: 820 });
    expect(await columns()).toBe(2);
    await expect(result(page).locator('.die-group')).toBeVisible();
    const output = await result(page).boundingBox();
    const controls = await page.getByRole('tabpanel', { name: 'Dice' }).boundingBox();
    const earlier = await page.getByRole('complementary', { name: 'History' }).boundingBox();
    expect(output.x).toBeGreaterThanOrEqual(controls.x + controls.width);
    expect(output.y).toBeLessThan(controls.y + controls.height);
    expect(earlier.y).toBeGreaterThanOrEqual(output.y + output.height);
});

test('tool tabs and result modes support keyboard navigation', async ({ page }) => {
    await openApp(page);
    await tab(page, 'Dice').focus();
    await page.keyboard.press('ArrowRight');
    await expect(tab(page, 'Words')).toBeFocused();
    await expect(tab(page, 'Words')).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: 'Words' })).toBeVisible();
    await page.keyboard.press('End');
    await expect(tab(page, 'Pictograms')).toBeFocused();
    await page.keyboard.press('ArrowRight');
    await expect(tab(page, 'Dice')).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(button(page, 'd4')).toBeFocused();
    await resultMode(page, 'All').focus();
    await page.keyboard.press('ArrowRight');
    await expect(resultMode(page, 'Max')).toBeChecked();
    await page.keyboard.press('Tab');
    const roll = button(page, 'Roll Max 1d6');
    await expect(roll).toBeFocused();
    await expect(history(page)).toHaveCount(0);
    await page.keyboard.press('Enter');
    await expect(result(page).locator('.aggregate-result')).toBeVisible();
    await expect(roll).toBeFocused();
});

test('tables are searchable and the last choice is remembered', async ({ page }) => {
    await openApp(page);
    await tab(page, 'Words').click();
    await button(page, 'Change table').click();
    const chooser = page.getByRole('dialog', { name: 'Choose a table' });
    const search = chooser.getByRole('searchbox', { name: 'Search Mythic 2e tables' });
    await expect(search).toBeFocused();
    await search.fill('no-such-table');
    await expect(chooser.getByRole('status')).toHaveText('No matching tables.');
    await search.fill('plot twists');
    await button(chooser, 'Plot Twists').click();
    await expect(chooser).toBeHidden();
    await button(page, 'Ask').click();
    await expect(result(page).locator('.result-meta')).toHaveText('Plot Twists');
    await page.reload();
    await expect(button(page, 'Ask')).toBeEnabled();
    await expect(page.locator('.table-choice strong')).toHaveText('Plot Twists');
});

test('the explicit theme controls pictogram contrast independently of the system', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await openApp(page);
    await tab(page, 'Pictograms').click();
    await button(page, 'Show icons').click();
    const firstIcon = history(page).first().getByRole('img').first();
    await expect(firstIcon).toHaveCSS('filter', 'invert(1)');
    await expect(result(page).getByRole('img').first()).toHaveCSS('filter', 'invert(1)');
    expect(await pictogramOffset(page)).toBeLessThan(1);
    const surface = page.locator('.result-panel');
    const brightness = () => surface.evaluate((element) => {
        const rgb = getComputedStyle(element).backgroundColor.match(/\d+/g).slice(0, 3).map(Number);
        return rgb.reduce((sum, value) => sum + value, 0) / 3;
    });
    expect(await brightness()).toBeGreaterThan(220);
    await page.getByRole('combobox', { name: 'Theme', exact: true }).selectOption('dark');
    await expect(firstIcon).toHaveCSS('filter', 'none');
    await expect(result(page).getByRole('img').first()).toHaveCSS('filter', 'none');
    expect(await brightness()).toBeLessThan(100);
    await page.reload();
    await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'dark');
    expect(await brightness()).toBeLessThan(100);
});

test('a one-sided exploding die terminates and current state links reproduce fixed results', async ({ page }) => {
    await openApp(page);
    await button(page, 'Custom').click();
    await page.locator('#dice-sides').fill('1');
    await page.locator('#dice-amount').fill('3');
    await page.getByRole('checkbox', { name: 'Exploding' }).check();
    await button(page, 'Roll 3d1!').click();
    await expect(result(page).locator('.die-group')).toHaveText(['1', '1', '1']);
    await expect.poll(async () => (await readState(page)).version).toBe(2);

    const link = stateLink(archive({ actions: [
        { tag: 'roll', sides: 6, amount: 3, explode: true, resultMode: 'all', ts: 1 },
        { tag: 'ask', table: 'Mythic 2e: Actions', ts: 2 },
        { tag: 'show', iconAmount: 3, ts: 3 },
    ] }));
    await page.goto(link);
    await expect(history(page).nth(2).locator('.die-group')).toHaveText(['1', '1', '6 + 2']);
    await expect(history(page).nth(1)).toContainText('Inspect Business');
    await expect(result(page).getByRole('img')).toHaveCount(3);
    await expect(result(page).getByRole('img', { name: 'back pain' })).toBeVisible();
    await expect(result(page).getByRole('img', { name: 'tank tread' })).toBeVisible();
    await expect(result(page).getByRole('img', { name: 'heart shield' })).toBeVisible();
    await expect.poll(() => linkedState(page).version).toBe(2);
});

test('the updated catalog includes the new tarot icons and keeps them available offline', async ({ page, context }) => {
    await page.goto(stateLink(archive({ seed: 5654, actions: [
        { tag: 'show', iconAmount: 1, ts: 1 },
    ] })));
    const icon = result(page).getByRole('img');
    await expect(icon).toHaveAttribute('src', './icons/ffffff/transparent/1x1/caro-asercion/tarot-21-the-world.svg');
    await expect.poll(() => icon.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const address = await shareLink(page);
    await context.setOffline(true);
    await page.goto(address);
    await expect(icon).toHaveAttribute('src', './icons/ffffff/transparent/1x1/caro-asercion/tarot-21-the-world.svg');
    await expect.poll(() => icon.evaluate((image) => image.complete && image.naturalWidth > 0)).toBe(true);
});

test('Max, Min and Sum use per-die explosion totals and survive sharing and repeat', async ({ page }) => {
    const initial = archive();
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
        { key: storageKey, value: initial });

    for (const [mode, score, kept] of [['Max', '8', '6 + 2'], ['Min', '1', '1'], ['Sum', '10', null]]) {
        await page.goto('/');
        await page.locator('#dice-amount').fill('3');
        const exploding = page.getByRole('checkbox', { name: 'Exploding' });
        await exploding.uncheck();
        await resultMode(page, mode).check();
        await expect(button(page, 'Roll ' + mode + ' 3d6')).toBeEnabled();
        await exploding.check();
        const label = mode + ' 3d6!';
        await button(page, 'Roll ' + label).click();
        await expect(result(page).locator('.result-meta')).toHaveText(label);
        await expect(history(page).first().locator('.history-meta')).toContainText(label);
        await expect(result(page).locator('.aggregate-result')).toHaveText(score);
        const groups = result(page).locator('.die-group');
        await expect(groups).toHaveCount(3);
        if (kept) {
            await expect(result(page).locator('.kept')).toHaveCount(1);
            await expect(result(page).locator('.kept')).toContainText(kept);
            await expect(result(page).locator('.kept')).not.toContainText('✓');
        } else {
            await expect(groups).toHaveText(['1', '1', '6 + 2']);
            await expect(result(page).locator('.kept')).toHaveCount(0);
        }
        await expect.poll(async () => (await readState(page)).actions[0]?.resultMode).toBe(mode.toLowerCase());
        expect((await readState(page)).version).toBe(2);
        expect((await readState(page)).format).toBe('gleam-dice-roller');
        const link = await shareLink(page);
        await page.goto(link);
        await expect(result(page).locator('.aggregate-result')).toHaveText(score);
    }

    await button(page, 'Repeat Sum 3d6!').click();
    await expect(history(page)).toHaveCount(2);
    await expect(result(page).locator('.result-meta')).toHaveText('Sum 3d6!');
    await expect(result(page).locator('.aggregate-result')).toBeVisible();
});

test('clearing requires confirmation and removes the saved results', async ({ page }) => {
    await openApp(page);
    await button(page, 'Roll 1d6').click();
    await expect(history(page)).toHaveCount(1);
    await button(page, 'Clear history…').click();
    const dialog = page.getByRole('dialog', { name: 'Clear history?' });
    await expect(dialog).toContainText('1 result');
    await button(dialog, 'Cancel').click();
    await expect(history(page)).toHaveCount(1);
    await button(page, 'Clear history…').click();
    await button(dialog, 'Clear history').click();
    await expect(history(page)).toHaveCount(0);
    await expect(result(page)).toContainText('No result yet.');
    await expect.poll(async () => (await readState(page)).actions).toEqual([]);
    await page.reload();
    await expect(history(page)).toHaveCount(0);
});

test('state links are editable, replace the single local save and track the current results', async ({ page }) => {
    await openApp(page);
    await button(page, 'Roll 1d6').click();
    await expect(history(page)).toHaveCount(1);
    const theme = page.getByRole('combobox', { name: 'Theme', exact: true });
    await theme.selectOption('dark');
    await expect.poll(() => linkedState(page).theme).toBe('dark');
    const address = page.url();
    const snapshot = await shareLink(page);
    expect(snapshot).toBe(address);
    await expect(page).toHaveURL(address);
    await theme.selectOption('light');
    await button(page, 'Roll 1d6').click();
    await expect(history(page)).toHaveCount(2);
    await expect.poll(async () => (await readState(page)).actions.length).toBe(2);
    await expect.poll(() => linkedState(page).actions.length).toBe(2);
    await page.reload();
    await expect(history(page)).toHaveCount(2);

    await page.goto(snapshot);
    await expect(history(page)).toHaveCount(1);
    await expect(button(page, 'Roll 1d6')).toBeEnabled();
    await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'dark');
    await expect.poll(async () => (await readState(page)).actions.length).toBe(1);
    await button(page, 'Roll 1d6').click();
    await expect(history(page)).toHaveCount(2);
    await expect.poll(async () => (await readState(page)).actions.length).toBe(2);
    await expect.poll(() => linkedState(page).actions.length).toBe(2);
    expect(new URL(page.url()).searchParams.has('session')).toBe(false);
    expect(await page.evaluate(() => Object.keys(localStorage).some((key) => key.startsWith('gleam-dice-roller-copy:')))).toBe(false);
    await page.reload();
    await expect(history(page)).toHaveCount(2);
    await page.goto(snapshot);
    await expect(history(page)).toHaveCount(1);
    await page.goto('/');
    await expect(history(page)).toHaveCount(1);
    await expect(page.locator('.app-shell')).toHaveAttribute('data-theme', 'dark');
});

test('a denied clipboard displays a manual copy option and reports the real outcome', async ({ page }) => {
    await page.addInitScript(() => {
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: async () => { throw new Error('Clipboard denied'); } },
        });
    });
    await openApp(page);
    const address = page.url();
    await button(page, 'Share').click();
    const dialog = page.getByRole('dialog', { name: 'Share results' });
    await button(dialog, 'Copy link').click();
    await expect(dialog.getByRole('status')).toContainText('Copy failed');
    const field = dialog.getByRole('textbox', { name: 'Results link' });
    await expect(field).toBeFocused();
    expect(await field.evaluate((input) => input.selectionEnd)).toBe((await field.inputValue()).length);
    await expect(page).toHaveURL(address);
});

test('an incompatible state link preserves saved results and offers recovery', async ({ page }) => {
    const localState = archive({ seed: 123, theme: 'dark' });
    await page.addInitScript(({ key, value }) => {
        if (localStorage.getItem(key) === null) localStorage.setItem(key, JSON.stringify(value));
    }, { key: storageKey, value: localState });
    await page.goto(stateLink(archive({ version: 3 })));
    await expect(page.getByRole('heading', { name: 'Newer version detected' })).toBeVisible();
    expect(await readState(page)).toEqual(localState);
    await button(page, 'Open saved results').click();
    await expect(page).toHaveURL(/\?state=/);
    await expect(button(page, 'Roll 1d6')).toBeEnabled();
    expect(await readState(page)).toEqual(localState);
});

test('Gleam storage stays separate from Elm and foreign snapshots are rejected', async ({ page }) => {
    const elm = { version: 2, seed: 73, theme: 'dark', actions: [] };
    await page.addInitScript((value) => localStorage.setItem('dice-roller-v1', JSON.stringify(value)), elm);
    await openApp(page);
    await button(page, 'Roll 1d6').click();
    await expect.poll(async () => (await readState(page)).actions.length).toBe(1);
    const saved = await readState(page);
    for (const foreign of [elm, archive({ format: 'another-app' }), archive({ version: 0 }), archive({ version: 1 })]) {
        await page.goto(stateLink(foreign));
        await expect(page.getByRole('heading', { name: 'Shared link unavailable', exact: true })).toBeVisible();
        expect(await readState(page)).toEqual(saved);
    }
    expect(await readState(page, 'dice-roller-v1')).toEqual(elm);
});

test('a catalog failure leaves saved dice visible and the dice generator usable', async ({ page, context }) => {
    await context.route('**/icons/icons.json', (route) => route.abort());
    const localState = archive({ actions: [
        { tag: 'roll', sides: 6, amount: 3, explode: true, resultMode: 'all', ts: 1 },
        { tag: 'show', iconAmount: 3, ts: 2 },
    ] });
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, JSON.stringify(value)),
        { key: storageKey, value: localState });
    await page.goto('/');
    await expect(history(page).nth(1).locator('.die-group')).toHaveText(['1', '1', '6 + 2']);
    await tab(page, 'Pictograms').click();
    await expect(page.getByText('Pictograms are unavailable.', { exact: true })).toBeVisible();
    await expect(button(page, 'Show icons')).toBeDisabled();
    await tab(page, 'Dice').click();
    await button(page, 'Roll 1d6').click();
    await expect(result(page).locator('.die-group')).toHaveCount(1);
});

test('a stale tab keeps a portable state link without overwriting the newer local save', async ({ page, context, browser }) => {
    await openApp(page);
    const second = await context.newPage();
    await second.goto('/');
    await button(page, 'Roll 1d6').click();
    await expect.poll(async () => (await readState(page)).actions.length).toBe(1);
    await tab(second, 'Words').click();
    await button(second, 'Ask').click();
    await expect(second.getByText(/Another tab saved newer results/)).toBeVisible();
    expect((await readState(page)).actions[0].tag).toBe('roll');
    const word = await result(second).locator('.word-result').textContent();
    const link = await shareLink(second);
    expect(link).toBe(second.url());
    const isolated = await browser.newContext();
    try {
        const reopened = await isolated.newPage();
        await reopened.goto(link);
        await expect(result(reopened).locator('.word-result')).toHaveText(word);
        expect((await readState(page)).actions[0].tag).toBe('roll');
    } finally {
        await isolated.close();
    }
});

test('the address reproduces results and supports continuation when local storage is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
        Object.defineProperty(window, 'localStorage', {
            get() { throw new Error('Storage unavailable'); },
        });
    });
    await page.goto('/');
    await expect(button(page, 'Roll 1d6')).toBeEnabled();
    await expect(page).toHaveURL(/\?state=/);
    await button(page, 'Roll 1d6').click();
    await expect(history(page)).toHaveCount(1);
    await expect.poll(() => linkedState(page).actions.length).toBe(1);
    const dice = await result(page).locator('.die-group').allTextContents();
    const address = page.url();
    expect(await shareLink(page)).toBe(address);
    await page.reload();
    await expect(result(page).locator('.die-group')).toHaveText(dice);
    await button(page, 'Roll 1d6').click();
    await expect(history(page)).toHaveCount(2);
    await expect.poll(() => linkedState(page).actions.length).toBe(2);
});

test('offline snapshots and pictograms still use the cached icon pack', async ({ page, context }) => {
    await openApp(page);
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
    const paths = await page.evaluate(async () => {
        const name = (await caches.keys()).find((key) => key.startsWith('dice-roller:/:'));
        return (await (await caches.open(name)).keys()).map((request) => new URL(request.url).pathname);
    });
    expect(paths).toContain('/offline-icons.json');
    expect(paths).toContain('/app.js');
    expect(paths).toContain('/inter.woff2');
    expect(paths).toContain('/ibm-plex-mono-regular.woff2');
    expect(paths).toContain('/dm-sans.woff2');
    expect(paths).toContain('/brand-die.png');
    expect(paths.some((path) => path.startsWith('/icons/') && path.endsWith('.svg'))).toBe(false);

    await button(page, 'Roll 1d6').click();
    await expect(history(page)).toHaveCount(1);
    const link = await shareLink(page);
    await context.setOffline(true);
    await page.goto(link);
    await expect(result(page).locator('.die-group')).toHaveText(/^[1-6]$/);
    await expect(button(page, 'Roll 1d6')).toBeEnabled();
    await tab(page, 'Pictograms').click();
    await button(page, 'Show icons').click();
    const icons = result(page).getByRole('img');
    await expect(icons).toHaveCount(3);
    await expect.poll(() => icons.evaluateAll((images) =>
        images.every((image) => image.complete && image.naturalWidth > 0))).toBe(true);
    await expect.poll(() => linkedState(page).actions.length).toBe(2);
    await page.reload();
    await expect(history(page)).toHaveCount(2);
    await expect(result(page).getByRole('img')).toHaveCount(3);
});
