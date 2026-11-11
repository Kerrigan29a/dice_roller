async function start() {
    try {
        const { main } = await import('../build/dev/javascript/gleam_pwa/gleam_pwa.mjs');
        main();
    } catch (error) {
        const status = document.getElementById('startup') ?? document.createElement('p');
        status.setAttribute('role', 'status');
        status.textContent = 'Dice Roller could not start. Try reloading the page.';
        document.getElementById('app').replaceChildren(status);
        console.error(error);
    }
}

void start();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js', { updateViaCache: 'none' })
            .catch((error) => console.warn('Could not register the service worker', error));
    });
}
