/**
 * TIMER WORKER
 * Runs setTimeout/setInterval in a Web Worker thread so timers
 * are NOT throttled when the browser tab is in the background.
 *
 * Messages:
 *   { command: 'start', id, delay }  → starts a one-shot timer
 *   { command: 'cancel', id }        → cancels a pending timer
 *   Worker posts back: { id }        → when timer fires
 */

const timers = {};

self.onmessage = function (e) {
    const { command, id, delay } = e.data;

    if (command === 'start') {
        // Cancel any existing timer with this ID
        if (timers[id]) clearTimeout(timers[id]);

        timers[id] = setTimeout(() => {
            delete timers[id];
            self.postMessage({ id });
        }, delay);
    }

    if (command === 'cancel') {
        if (timers[id]) {
            clearTimeout(timers[id]);
            delete timers[id];
        }
    }
};
