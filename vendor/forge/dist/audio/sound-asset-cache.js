import { getMixerInternals } from './internal/audio-internals.js';
/**
 * Loads and decodes sound files once, and keeps them for playing as often
 * as needed. Requests for a file that's still loading share that load.
 * Sounds stay usable after the world that played them stops.
 */
export class SoundAssetCache {
    /**
     * The loaded sounds, keyed by URL. Deleting an entry removes the sound
     * from the cache.
     */
    assets = new Map();
    _context;
    _loading = new Map();
    /**
     * Creates a cache that decodes sounds for `mixer`.
     * @param mixer - The mixer whose audio context decodes the sounds.
     */
    constructor(mixer) {
        this._context = getMixerInternals(mixer).context;
    }
    /**
     * Gets a loaded sound.
     * @param url - The URL the sound was loaded from.
     * @returns The sound.
     * @throws If the sound at `url` hasn't been loaded.
     */
    get(url) {
        const sound = this.assets.get(url);
        if (!sound) {
            throw new Error(`Sound with URL "${url}" not found in the cache.`);
        }
        return sound;
    }
    /**
     * Loads and decodes the sound at `url`, and caches it.
     * @param url - The URL of the sound file.
     * @returns A promise that resolves once the sound is cached.
     * @throws The promise rejects if the file can't be fetched or decoded.
     */
    async load(url) {
        await this._loadShared(url);
    }
    /**
     * Gets the sound at `url`, loading and decoding it first if it isn't
     * cached yet.
     * @param url - The URL of the sound file.
     * @returns A promise that resolves to the sound.
     * @throws The promise rejects if the file can't be fetched or decoded.
     */
    getOrLoad(url) {
        const sound = this.assets.get(url);
        if (sound) {
            return Promise.resolve(sound);
        }
        return this._loadShared(url);
    }
    _loadShared(url) {
        const loading = this._loading.get(url);
        if (loading) {
            return loading;
        }
        const load = this._fetchAndDecode(url).finally(() => {
            this._loading.delete(url);
        });
        this._loading.set(url, load);
        return load;
    }
    async _fetchAndDecode(url) {
        let bytes;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            bytes = await response.arrayBuffer();
        }
        catch (error) {
            throw new Error(`Failed to load the sound at "${url}".`, {
                cause: error,
            });
        }
        let buffer;
        try {
            buffer = await this._context.decodeAudioData(bytes);
        }
        catch (error) {
            throw new Error(`Unable to decode the sound at "${url}". Use a format every browser decodes, such as MP3, AAC or WAV.`, { cause: error });
        }
        const sound = { buffer, durationSeconds: buffer.duration };
        this.assets.set(url, sound);
        return sound;
    }
}
