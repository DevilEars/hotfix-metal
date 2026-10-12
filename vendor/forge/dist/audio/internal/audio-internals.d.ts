import type { MixerBus } from '../mixer-bus.js';
import type { SoundMixer } from '../sound-mixer.js';
/**
 * The state of a sound instance the mixer needs, to stop every sound when
 * it's stopped.
 */
export interface StoppableInstance {
    stopImmediately(): void;
}
/**
 * The parts of a {@link SoundMixer} that playback needs but games don't.
 */
export interface MixerInternals {
    readonly context: AudioContext;
    /** Every instance currently playing (or fading out) through this mixer. */
    readonly instances: Set<StoppableInstance>;
    /** Set on the first user gesture, and never cleared. */
    hasHadGesture: boolean;
    isStopped: boolean;
}
/**
 * The parts of a {@link MixerBus} that playback needs but games don't.
 */
export interface BusInternals {
    readonly mixer: MixerInternals;
    /** The node sounds and child buses connect to. */
    readonly gain: GainNode;
}
export declare const registerMixerInternals: (mixer: SoundMixer, internals: MixerInternals) => void;
export declare const registerBusInternals: (bus: MixerBus, internals: BusInternals) => void;
/**
 * Gets the internals of a mixer made by `createSoundMixer`.
 * @param mixer - The mixer.
 * @returns Its internals.
 * @throws If `mixer` wasn't made by `createSoundMixer`.
 */
export declare const getMixerInternals: (mixer: SoundMixer) => MixerInternals;
/**
 * Gets the internals of a bus made by `SoundMixer.createBus`.
 * @param bus - The bus.
 * @returns Its internals.
 * @throws If `bus` wasn't made by a `SoundMixer`.
 */
export declare const getBusInternals: (bus: MixerBus) => BusInternals;
/**
 * Whether a non-looping sound requested now should play. Until the player
 * has interacted with the page, a context that isn't running can't play
 * anything, and a sound effect queued until the first click would play
 * late, together with every other one queued, so it's dropped instead. A
 * context that's already running (the browser allowed autoplay, e.g. after
 * navigating within a site the player already interacted with) plays it.
 * @param mixer - The mixer the sound would play through.
 * @returns `true` if the sound should be started.
 */
export declare const canStartOneShot: (mixer: MixerInternals) => boolean;
/**
 * Throws if `mixer` has been stopped.
 * @param mixer - The mixer a sound would play through.
 * @throws If the mixer has been stopped.
 */
export declare const assertMixerNotStopped: (mixer: MixerInternals) => void;
/**
 * Throws unless `volume` is a finite gain of at least 0.
 * @param volume - The volume to check.
 * @param owner - What the volume belongs to, for the error message.
 * @throws If `volume` is negative or not finite.
 */
export declare const assertValidVolume: (volume: number, owner: string) => void;
/**
 * Throws unless `rate` is a finite playback rate above 0.
 * @param rate - The rate to check.
 * @throws If `rate` is 0 or less, or not finite.
 */
export declare const assertValidRate: (rate: number) => void;
/**
 * How quickly a gain follows a new volume, in seconds: the time constant of
 * `setTargetAtTime`, so the change is about 99% done after five of these.
 * Fast enough to sound immediate, slow enough not to click.
 */
export declare const gainSmoothingSeconds = 0.01;
/**
 * Moves `param` smoothly to `value`, replacing any change still scheduled.
 * @param param - The parameter to change.
 * @param value - The value to move to.
 * @param now - The context's current time.
 */
export declare const smoothParamTo: (param: AudioParam, value: number, now: number) => void;
