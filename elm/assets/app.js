(() => {
    const ownKey = 'dice-roller-v1';
    const preferencesKey = 'dice-roller-preferences';
    const copyPrefix = 'dice-roller-copy:';
    const address = new URL(window.location.href);
    const copyId = address.searchParams.get('session');
    const isCopy = copyId !== null;
    const sessionKey = isCopy ? copyPrefix + copyId : ownKey;

    function read(key) {
        try {
            return localStorage.getItem(key);
        } catch {
            return null;
        }
    }

    function parse(value) {
        try {
            return JSON.parse(value);
        } catch {
            return null;
        }
    }

    function sessionAddress() {
        const url = new URL(window.location.href);
        url.searchParams.delete('state');
        url.searchParams.delete('session');
        url.hash = '';
        return url;
    }

    async function updateWorker() {
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
    }

    let lastSaved = isCopy && !/^[0-9a-f]{24}$/.test(copyId) ? null : read(sessionKey);
    let app;
    try {
        app = Elm.Main.init({
            flags: {
                session: parse(lastSaved),
                preferences: parse(read(preferencesKey)),
                copy: isCopy,
                iconCount: Number(document.documentElement.dataset.iconCount) || 0,
                shareBase: address.origin + address.pathname,
            },
        });
    } catch (error) {
        document.getElementById('startup').textContent = 'Dice Roller could not start. Try reloading the page.';
        console.error(error);
        return;
    }

    function reportStorage(message) {
        app.ports.storageIssue.send(message);
    }

    app.ports.saveSession.subscribe((session) => {
        function write() {
            try {
                if (localStorage.getItem(sessionKey) !== lastSaved) {
                    reportStorage('Another tab saved this session. Save your current results as a copy to keep both.');
                    return;
                }
                const next = JSON.stringify(session);
                localStorage.setItem(sessionKey, next);
                lastSaved = next;
            } catch {
                reportStorage('This browser could not save the session. You can still share a link to the current results.');
            }
        }

        if (navigator.locks) {
            navigator.locks.request(sessionKey, write).catch(() => {
                reportStorage('This browser could not save the session. You can still share a link to the current results.');
            });
        } else {
            write();
        }
    });

    app.ports.savePreferences.subscribe((preferences) => {
        try {
            localStorage.setItem(preferencesKey, JSON.stringify(preferences));
        } catch {
            reportStorage('This browser could not save your preferences.');
        }
    });

    app.ports.createCopy.subscribe((session) => {
        try {
            const id = Array.from(crypto.getRandomValues(new Uint8Array(12)),
                (byte) => byte.toString(16).padStart(2, '0')).join('');
            localStorage.setItem(copyPrefix + id, JSON.stringify(session));
            const url = sessionAddress();
            url.searchParams.set('session', id);
            window.location.assign(url);
        } catch {
            reportStorage('This browser could not create a local copy. You can still share the current results.');
        }
    });

    app.ports.ownSession.subscribe(() => window.location.assign(sessionAddress()));

    app.ports.copyToClipboard.subscribe(async (link) => {
        const field = document.getElementById('share-link');
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(link);
            } else {
                field.focus();
                field.select();
                if (!document.execCommand('copy')) throw new Error('Copy unavailable');
            }
            app.ports.clipboardResult.send(true);
        } catch {
            field.focus();
            field.select();
            app.ports.clipboardResult.send(false);
        }
    });

    app.ports.setDialog.subscribe(({ id, visible }) => {
        const dialog = document.getElementById(id);
        if (visible && !dialog.open) dialog.showModal();
        if (!visible && dialog.open) dialog.close();
    });

    app.ports.reloadApp.subscribe(async () => {
        try {
            await updateWorker();
        } catch (error) {
            console.warn('Could not update the service worker', error);
        } finally {
            window.location.reload();
        }
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' })
                .catch((error) => console.warn('Could not register the service worker', error));
        });
    }
})();
