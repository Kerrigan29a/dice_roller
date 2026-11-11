import { createBrowser } from '../../web/browser.mjs';
const browser = createBrowser('elm');
const parse = text => { try { return JSON.parse(text); } catch { return null; } };
const app = window.Elm.Main.init({
    node: document.getElementById('app'),
    flags: {
        session: parse(browser.storedSession()), preferences: parse(browser.storedPreferences()),
        hasState: browser.hasState(), stateToken: browser.stateToken(),
        iconCount: browser.iconCount(), shareBase: browser.shareBase(),
    },
});
const report = message => app.ports.storageIssue.send(message);
app.ports.saveSession.subscribe(({ json, token }) => browser.saveSession(json, token, report));
app.ports.savePreferences.subscribe(value => browser.savePreferences(JSON.stringify(value), report));
app.ports.openSavedResults.subscribe(browser.openSaved);
app.ports.reloadApp.subscribe(browser.reloadApp);
app.ports.copyToClipboard.subscribe(link => browser.copyLink(link, result => app.ports.clipboardResult.send(result)));
app.ports.setDialog.subscribe(({ id, visible }) => browser.setDialog(id, visible));
