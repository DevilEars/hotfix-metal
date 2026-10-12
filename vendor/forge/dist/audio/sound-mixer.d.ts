import type { MixerBus } from './mixer-bus.js';
/**
 * The state of a {@link SoundMixer}'s audio. `'interrupted'` is reported by
 * Safari while another app (or a phone call) has taken over audio.
 */
export type SoundMixerState = AudioContextState | 'interrupted';
/**
 * Owns a game's audio output: the browser's `AudioContext` and a tree of
 * {@link MixerBus | buses} under a `master` bus. Create one per game with
 * {@link createSoundMixer}.
 */
export interface SoundMixer {
    /** The root bus. Every other bus, and so every sound, ends up here. */
    readonly master: MixerBus;
    /**
     * The state of the mixer's audio. Browsers start audio `'suspended'`
     * until the player interacts with the page; the mixer resumes it on the
     * first click, tap or key press.
     */
    readonly state: SoundMixerState;
    /**
     * Creates a bus that feeds into `parent`.
     * @param name - The bus's name, unique within this mixer.
     * @param parent - The bus to feed into. Defaults to `master`.
     * @returns The new bus.
     * @throws If a bus named `name` already exists, or `parent` belongs to a different mixer.
     */
    createBus(name: string, parent?: MixerBus): MixerBus;
    /**
     * Gets a bus by name.
     * @param name - The bus's name. `'master'` returns the master bus.
     * @returns The bus.
     * @throws If this mixer has no bus named `name`.
     */
    getBus(name: string): MixerBus;
    /**
     * Pauses all audio, for example while the game is paused or its tab is
     * hidden. Sounds continue from the same place on {@link SoundMixer.resume}.
     * The mixer doesn't resume on its own while suspended this way.
     * @returns A promise that resolves once audio is suspended.
     */
    suspend(): Promise<void>;
    /**
     * Resumes audio after {@link SoundMixer.suspend}.
     * @returns A promise that resolves once audio is running.
     */
    resume(): Promise<void>;
    /**
     * Stops every sound, closes the `AudioContext` and stops listening for
     * user gestures. The mixer can't play sounds afterwards. Does nothing if
     * the mixer is already stopped.
     * @returns A promise that resolves once the context is closed.
     */
    stop(): Promise<void>;
}
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
export declare function createSoundMixer(context?: AudioContext): SoundMixer;
