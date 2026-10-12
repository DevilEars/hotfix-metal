import { createMixerBus } from './internal/create-mixer-bus.js';
import { getBusInternals, registerMixerInternals, } from './internal/audio-internals.js';
// The events that can unlock audio. Per the HTML specification a touch
// activates the page on release (`pointerup`/`touchend`), not on press, and
// Escape doesn't count as a key press for this.
const gestureEvents = ['pointerup', 'touchend', 'click', 'keydown'];
const gestureListenerOptions = {
    capture: true,
    passive: true,
};
/**
 * Creates a {@link SoundMixer} with a `master` bus.
 *
 * Browsers don't play audio until the player has interacted with the page.
 * The mixer listens for the first click, tap or key press and resumes audio
 * then, and again whenever audio stops without the game asking (Safari
 * interrupts it for calls and other apps). Stop the mixer with
 * {@link SoundMixer.stop} when the game is torn down.
 * @param context - The audio context to play through. Defaults to a new `AudioContext`.
 * @returns The mixer.
 */
export function createSoundMixer(context = new AudioContext()) {
    const internals = {
        context,
        instances: new Set(),
        hasHadGesture: false,
        isStopped: false,
    };
    const buses = new Map();
    let isSuspendedByGame = false;
    let isListeningForGestures = false;
    const master = createMixerBus(internals, 'master', null, context.destination);
    buses.set(master.name, master);
    const getState = () => context.state;
    const handleGesture = (event) => {
        if (event instanceof KeyboardEvent && event.key === 'Escape') {
            return;
        }
        internals.hasHadGesture = true;
        if (!isSuspendedByGame && getState() !== 'running') {
            // A resume from an event the browser doesn't count as a gesture fails;
            // the listeners stay until audio actually runs.
            context.resume().catch(() => { });
        }
    };
    const startListening = () => {
        if (isListeningForGestures) {
            return;
        }
        isListeningForGestures = true;
        for (const type of gestureEvents) {
            window.addEventListener(type, handleGesture, gestureListenerOptions);
        }
    };
    const stopListening = () => {
        if (!isListeningForGestures) {
            return;
        }
        isListeningForGestures = false;
        for (const type of gestureEvents) {
            window.removeEventListener(type, handleGesture, gestureListenerOptions);
        }
    };
    const handleStateChange = () => {
        const state = getState();
        if (state === 'running') {
            stopListening();
            return;
        }
        if (state !== 'closed' && !isSuspendedByGame) {
            startListening();
        }
    };
    const assertNotStopped = (action) => {
        if (internals.isStopped) {
            throw new Error(`Unable to ${action}: the sound mixer has been stopped.`);
        }
    };
    context.addEventListener('statechange', handleStateChange);
    handleStateChange();
    const mixer = {
        master,
        get state() {
            return getState();
        },
        createBus(name, parent = master) {
            assertNotStopped(`create the bus "${name}"`);
            if (buses.has(name)) {
                throw new Error(`Unable to create the bus "${name}": the mixer already has a bus with that name.`);
            }
            const parentInternals = getBusInternals(parent);
            if (parentInternals.mixer !== internals) {
                throw new Error(`Unable to create the bus "${name}": its parent "${parent.name}" belongs to a different sound mixer.`);
            }
            const bus = createMixerBus(internals, name, parent, parentInternals.gain);
            buses.set(name, bus);
            return bus;
        },
        getBus(name) {
            const bus = buses.get(name);
            if (!bus) {
                throw new Error(`The sound mixer has no bus named "${name}".`);
            }
            return bus;
        },
        suspend: async () => {
            assertNotStopped('suspend audio');
            isSuspendedByGame = true;
            stopListening();
            await context.suspend();
        },
        resume: async () => {
            assertNotStopped('resume audio');
            isSuspendedByGame = false;
            handleStateChange();
            await context.resume();
        },
        stop: async () => {
            if (internals.isStopped) {
                return;
            }
            internals.isStopped = true;
            stopListening();
            context.removeEventListener('statechange', handleStateChange);
            for (const instance of [...internals.instances]) {
                instance.stopImmediately();
            }
            if (getState() !== 'closed') {
                await context.close();
            }
        },
    };
    registerMixerInternals(mixer, internals);
    return mixer;
}
