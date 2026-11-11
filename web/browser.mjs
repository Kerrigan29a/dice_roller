export function createBrowser(language) {
    const stateKey = language + '-dice-roller-v1';
    const preferencesKey = language + '-dice-roller-preferences';
    const address = new URL(window.location.href);
    let lastSaved = read(stateKey);

    function read(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' })
                .catch(error => console.warn('Could not register the service worker', error));
        });
    }

    const stateParameter = address.search.slice(1).split('&').find((part) => part.startsWith('state='));

    function hasState() {
        return stateParameter !== undefined;
    }

    function stateToken() {
        return stateParameter?.slice(6) ?? '';
    }

    function shareBase() {
        return address.origin + address.pathname;
    }

    function storedSession() {
        return lastSaved ?? '';
    }

    function storedPreferences() {
        return read(preferencesKey) ?? '';
    }

    function setTitle(title) {
        document.title = title;
    }

    function iconCount() {
        return Number(document.documentElement.dataset.iconCount) || 0;
    }

    function freshSeed() {
        const values = new Uint32Array(1);
        const range = 2147483646;
        do {
            crypto.getRandomValues(values);
        } while (values[0] >= range * 2);
        return values[0] % range + 1;
    }

    function now() {
        return Date.now();
    }

    // Display local timestamps with the timezone offset from session startup.
    const offset = new Date().getTimezoneOffset() * 60000;

    function timestamp(milliseconds, local) {
        const date = new Date(local ? milliseconds - offset : milliseconds);
        const pad = (part) => String(part).padStart(2, '0');
        return String(date.getUTCFullYear()) + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate())
            + ' ' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds());
    }

    function loadCatalog(receive) {
        fetch('../assets/icons/icons.json')
            .then((response) => {
                if (!response.ok) throw new Error('Catalog unavailable');
                return response.text();
            })
            .then((text) => receive(text), () => receive(''));
    }

    function saveSession(json, token, report) {
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

    function savePreferences(json, report) {
        try {
            localStorage.setItem(preferencesKey, json);
        } catch {
            report('This browser could not save your preferences.');
        }
    }

    function openSaved() {
        window.location.assign(shareBase());
    }

    function copyLink(link, receive) {
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

    function focus(id) {
        document.getElementById(id)?.focus();
    }

    function setDialog(id, visible) {
        const dialog = document.getElementById(id);
        if (visible && !dialog.open) dialog.showModal();
        if (!visible && dialog.open) dialog.close();
    }

    function reloadApp() {
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

    return { hasState, stateToken, shareBase, storedSession, storedPreferences, setTitle, iconCount, freshSeed, now, timestamp, loadCatalog, saveSession, savePreferences, openSaved, copyLink, focus, setDialog, reloadApp };
}
