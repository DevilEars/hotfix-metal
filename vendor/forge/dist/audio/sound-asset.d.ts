/**
 * Decoded audio, ready to play any number of times, on any bus, at once.
 * Load sounds from files with a `SoundAssetCache`, or make one from samples
 * with {@link createSoundAsset}.
 */
export interface SoundAsset {
    /** The decoded samples. */
    readonly buffer: AudioBuffer;
    /** How long the sound lasts at a playback rate of 1, in seconds. */
    readonly durationSeconds: number;
}
/**
 * Samples to make a {@link SoundAsset} from.
 */
export interface SoundAssetSamples {
    /** Samples per second, e.g. `44100`. */
    sampleRate: number;
    /**
     * One array of samples per channel (one for mono, two for stereo), each
     * in the range -1 to 1, and all the same length.
     */
    channels: readonly Float32Array<ArrayBuffer>[];
}
/**
 * Makes a {@link SoundAsset} from samples, for sounds synthesized or
 * generated at runtime.
 * @param samples - The sample rate and the samples of each channel.
 * @returns The sound.
 * @throws If there are no channels, the channels are empty, or they differ in length.
 */
export declare function createSoundAsset(samples: SoundAssetSamples): SoundAsset;
