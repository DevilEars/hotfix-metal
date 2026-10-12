import type { AssetCache } from '../asset-cache.js';
/**
 * Class to manage the caching and loading of images.
 */
export declare class ImageCache implements AssetCache<HTMLImageElement> {
    /**
     * The loaded images, keyed by the exact path string they were loaded
     * with. Deleting an entry removes the image from the cache.
     */
    assets: Map<string, HTMLImageElement>;
    /**
     * Retrieves an image from the cache.
     * @param path - The path of the image to retrieve.
     * @returns The cached image element.
     * @throws Will throw an error if the image is not found in the cache.
     */
    get(path: string): HTMLImageElement;
    /**
     * Loads an image from the specified path and caches it.
     * @param path - The path of the image to load.
     * @returns A promise that resolves when the image is loaded and cached.
     * @throws Will throw an error if the image fails to load.
     */
    load(path: string): Promise<void>;
    /**
     * Retrieves an image from the cache if it exists, otherwise loads and
     * caches it. A load that's still in progress isn't shared: two calls for
     * the same path made before the first resolves each load the image.
     * @param path - The path of the image to retrieve or load.
     * @returns A promise that resolves to the image element.
     * @throws The promise rejects if the image fails to load.
     */
    getOrLoad(path: string): Promise<HTMLImageElement>;
}
