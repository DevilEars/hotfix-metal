import { assertMixerNotStopped, assertValidRate, assertValidVolume, canStartOneShot, getBusInternals, } from './internal/audio-internals.js';
import { SoundInstance } from './internal/sound-instance.js';
import { withDefaults } from '../utilities/with-defaults.js';
const defaultPlaySoundOptions = {
    volume: 1,
    rate: 1,
    loop: false,
};
/**
 * Plays `sound` on `bus`. Any number of sounds, including the same one, can
 * play at once.
 *
 * Until the player first interacts with the page, browsers keep audio
 * suspended. A looping sound requested before then starts as soon as audio
 * runs; a non-looping one is dropped (its handle reports `isPlaying` as
 * `false`), so a burst of stale sound effects doesn't play on the first
 * click. A sound requested in the handler of that first click plays.
 * @param bus - The bus to play through, which sets which volume and mute settings apply.
 * @param sound - The sound to play.
 * @param options - The volume, rate and looping to play it with.
 * @returns A handle to change the sound's volume or stop it.
 * @throws If the bus's mixer was stopped, or the volume or rate is invalid.
 */
export function playSound(bus, sound, options = {}) {
    const { volume, rate, loop } = withDefaults(defaultPlaySoundOptions, options);
    const busInternals = getBusInternals(bus);
    assertMixerNotStopped(busInternals.mixer);
    assertValidVolume(volume, 'a sound');
    assertValidRate(rate);
    if (!loop && !canStartOneShot(busInternals.mixer)) {
        return createDroppedSound(volume);
    }
    const instance = new SoundInstance(busInternals, sound, {
        volume,
        rate,
        loop,
        offsetSeconds: 0,
    });
    let currentVolume = volume;
    return {
        get volume() {
            return currentVolume;
        },
        set volume(value) {
            instance.setVolume(value);
            currentVolume = value;
        },
        get isPlaying() {
            return instance.isPlaying;
        },
        stop: () => {
            instance.stop();
        },
    };
}
const createDroppedSound = (volume) => {
    let currentVolume = volume;
    return {
        get volume() {
            return currentVolume;
        },
        set volume(value) {
            assertValidVolume(value, 'a sound');
            currentVolume = value;
        },
        isPlaying: false,
        stop: () => { },
    };
};
