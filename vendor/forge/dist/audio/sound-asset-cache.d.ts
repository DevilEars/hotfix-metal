import type { AssetCache } from '../asset-loading/asset-cache.js';
import type { SoundAsset } from './sound-asset.js';
import type { SoundMixer } from './sound-mixer.js';
/**
 * Loads and decodes sound files once, and keeps them for playing as often
 * as needed. Requests for a file that's still loading share that load.
 * Sounds stay usable after the world that played them stops.
 */
export declare class SoundAssetCache implements AssetCache<SoundAsset> {
    /**
     * The loaded sounds, keyed by URL. Deleting an entry removes the sound
     * from the cache.
     */
    assets: Map<string, SoundAsset>;
    private readonly _context;
    private readonly _loading;
    /**
     * Creates a cache that decodes sounds for `mixer`.
     * @param mixer - The mixer whose audio context decodes the sounds.
     */
    constructor(mixer: SoundMixer);
    /**
     * Gets a loaded sound.
     * @param url - The URL the sound was loaded from.
     * @returns The sound.
     * @throws If the sound at `url` hasn't been loaded.
     */
    get(url: string): SoundAsset;
    /**
     * Loads and decodes the sound at `url`, and caches it.
     * @param url - The URL of the sound file.
     * @returns A promise that resolves once the sound is cached.
     * @throws The promise rejects if the file can't be fetched or decoded.
     */
    load(url: string): Promise<void>;
    /**
     * Gets the sound at `url`, loading and decoding it first if it isn't
     * cached yet.
     * @param url - The URL of the sound file.
     * @returns A promise that resolves to the sound.
     * @throws The promise rejects if the file can't be fetched or decoded.
     */
    getOrLoad(url: string): Promise<SoundAsset>;
    private _loadShared;
    private _fetchAndDecode;
}
