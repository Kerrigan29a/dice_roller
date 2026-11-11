const stateKey = 'gleam-dice-roller-v1';
const preferencesKey = 'gleam-dice-roller-preferences';
const address = new URL(window.location.href);
let lastSaved = read(stateKey);

function read(key) {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

const stateParameter = address.search.slice(1).split('&').find((part) => part.startsWith('state='));

export function hasState() {
    return stateParameter !== undefined;
}

export function stateToken() {
    return stateParameter?.slice(6) ?? '';
}

export function shareBase() {
    return address.origin + address.pathname;
}

export function storedSession() {
    return lastSaved ?? '';
}

export function storedPreferences() {
    return read(preferencesKey) ?? '';
}

export function setTitle(title) {
    document.title = title;
}

export function iconCount() {
    return Number(document.documentElement.dataset.iconCount) || 0;
}

export function freshSeed() {
    const values = new Uint32Array(1);
    const range = 2147483646;
    do {
        crypto.getRandomValues(values);
    } while (values[0] >= range * 2);
    return values[0] % range + 1;
}

export function now() {
    return Date.now();
}

// Display local timestamps with the timezone offset from session startup.
const offset = new Date().getTimezoneOffset() * 60000;

export function timestamp(milliseconds, local) {
    const date = new Date(local ? milliseconds - offset : milliseconds);
    const pad = (part) => String(part).padStart(2, '0');
    return String(date.getUTCFullYear()) + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate())
        + ' ' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds());
}

export function loadCatalog(receive) {
    fetch('./icons/icons.json')
        .then((response) => {
            if (!response.ok) throw new Error('Catalog unavailable');
            return response.text();
        })
        .then((text) => receive(text), () => receive(''));
}

export function saveSession(json, token, report) {
    try {
        window.history.replaceState(null, '', shareBase() + '?state=' + token);
    } catch {
        report('This browser could not update the address. Use Share to keep a link to the current results.');
    }
    const failure = 'This browser could not save the current results. You can still keep or share their link.';
    function write() {
        try {
            if (localStorage.getItem(stateKey) !== lastSaved) {
                report('Another tab saved newer results. Share a link to keep the results from this tab.');
                return;
            }
            localStorage.setItem(stateKey, json);
            lastSaved = json;
        } catch {
            report(failure);
        }
    }
    if (navigator.locks) {
        navigator.locks.request(stateKey, write).catch(() => report(failure));
    } else {
        write();
    }
}

export function savePreferences(json, report) {
    try {
        localStorage.setItem(preferencesKey, json);
    } catch {
        report('This browser could not save your preferences.');
    }
}

export function openSaved() {
    window.location.assign(shareBase());
}

export function copyLink(link, receive) {
    const field = document.getElementById('share-link');
    async function copy() {
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(link);
            } else {
                field.focus();
                field.select();
                if (!document.execCommand('copy')) throw new Error('Copy unavailable');
            }
            receive(true);
        } catch {
            field.focus();
            field.select();
            receive(false);
        }
    }
    void copy();
}

export function focus(id) {
    document.getElementById(id)?.focus();
}

export function setDialog(id, visible) {
    const dialog = document.getElementById(id);
    if (visible && !dialog.open) dialog.showModal();
    if (!visible && dialog.open) dialog.close();
}

export function reloadApp() {
    async function update() {
        try {
            const registration = await navigator.serviceWorker?.getRegistration();
            if (!registration) return;
            await registration.update();
            const worker = registration.installing || registration.waiting || registration.active;
            if (!worker) return;
            await new Promise((resolve) => {
                function checkState() {
                    if (worker.state === 'activated' || worker.state === 'redundant') {
                        worker.removeEventListener('statechange', checkState);
                        resolve();
                    }
                }
                worker.addEventListener('statechange', checkState);
                checkState();
            });
        } catch (error) {
            console.warn('Could not update the service worker', error);
        } finally {
            window.location.reload();
        }
    }
    void update();
}
