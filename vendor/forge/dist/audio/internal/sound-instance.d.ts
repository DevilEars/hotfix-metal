import type { SoundAsset } from '../sound-asset.js';
import { BusInternals, StoppableInstance } from './audio-internals.js';
/**
 * How a {@link SoundInstance} starts playing.
 */
export interface SoundInstanceOptions {
    volume: number;
    rate: number;
    loop: boolean;
    /** Where in the sound to start, in seconds. */
    offsetSeconds: number;
}
/**
 * One playback of a sound: a one-use `AudioBufferSourceNode` feeding its own
 * `GainNode`, connected to a bus. Changes to volume and rate apply while it
 * plays, and it can move to another bus of the same mixer without
 * restarting.
 */
export declare class SoundInstance implements StoppableInstance {
    private _bus;
    private readonly _sound;
    private readonly _source;
    private readonly _gain;
    private _rate;
    private _loop;
    private _segmentStartPositionSeconds;
    private _segmentStartTime;
    private _hasEnded;
    private _isStopping;
    /**
     * Starts playing `sound` on `bus`.
     * @param bus - The bus to play through.
     * @param sound - The sound to play.
     * @param options - How to play it.
     * @throws If the bus's mixer has been stopped, or the volume or rate is invalid.
     */
    constructor(bus: BusInternals, sound: SoundAsset, options: SoundInstanceOptions);
    /**
     * Whether the sound is still playing: it hasn't ended or been stopped.
     */
    get isPlaying(): boolean;
    /**
     * Whether the sound has ended, either by playing to its end, by being
     * stopped, or because its mixer was stopped.
     */
    get hasEnded(): boolean;
    /**
     * How far into the sound playback is, in seconds of the sound itself
     * (so at a rate of 2, it advances two seconds per second).
     */
    get positionSeconds(): number;
    /**
     * Changes the volume smoothly.
     * @param volume - The new volume.
     * @throws If `volume` is negative or not finite.
     */
    setVolume(volume: number): void;
    /**
     * Changes the playback rate (and so the pitch) from now on.
     * @param rate - The new rate.
     * @throws If `rate` is 0 or less, or not finite.
     */
    setRate(rate: number): void;
    /**
     * Turns looping on or off without restarting.
     * @param loop - Whether to loop.
     */
    setLoop(loop: boolean): void;
    /**
     * Moves the sound to another bus of the same mixer, without restarting.
     * @param bus - The bus to move to.
     * @throws If `bus` belongs to a different mixer.
     */
    setBus(bus: BusInternals): void;
    /**
     * Fades the sound out over a few milliseconds and stops it. Does nothing
     * if it's already stopping or has ended.
     */
    stop(): void;
    /**
     * Stops the sound at once, without waiting for the context to report it
     * ended, which a closing context never does.
     */
    stopImmediately(): void;
    private _startNewSegment;
    private _end;
    private readonly _handleEnded;
}
