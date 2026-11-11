async function start() {
    try {
        const { main } = await import('../build/dev/javascript/dice_roller/dice_roller.mjs');
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
