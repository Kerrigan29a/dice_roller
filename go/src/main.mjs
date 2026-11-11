import { createBrowser } from '../../web/browser.mjs';
window.diceBrowser = createBrowser('go');
const go = new Go();
try {
    const response = await fetch('app.wasm');
    if (!response.ok) throw new Error('WebAssembly download failed');
    const { instance } = await WebAssembly.instantiateStreaming(response, go.importObject);
    void go.run(instance);
} catch (error) {
    document.getElementById('startup').textContent = 'Dice Roller could not start. Try reloading the page.';
    console.error(error);
}
