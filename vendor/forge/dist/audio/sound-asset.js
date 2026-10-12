/**
 * Makes a {@link SoundAsset} from samples, for sounds synthesized or
 * generated at runtime.
 * @param samples - The sample rate and the samples of each channel.
 * @returns The sound.
 * @throws If there are no channels, the channels are empty, or they differ in length.
 */
export function createSoundAsset(samples) {
    const { sampleRate, channels } = samples;
    if (channels.length === 0) {
        throw new Error('Unable to create a sound asset without any channels.');
    }
    const { length } = channels[0];
    if (length === 0) {
        throw new Error('Unable to create a sound asset from empty channels.');
    }
    if (channels.some((channel) => channel.length !== length)) {
        throw new Error('Unable to create a sound asset: every channel must have the same number of samples.');
    }
    const buffer = new AudioBuffer({
        length,
        numberOfChannels: channels.length,
        sampleRate,
    });
    channels.forEach((channel, index) => {
        buffer.copyToChannel(channel, index);
    });
    return { buffer, durationSeconds: buffer.duration };
}
