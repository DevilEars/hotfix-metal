import type { RenderContext } from '../../rendering/render-context.js';
import type { FontAtlas } from './font-atlas.js';
/**
 * The two files a font atlas is loaded from. Pass the URLs your bundler
 * gives you for each file (e.g. Vite's `import url from './font.json?url'`
 * and `import url from './font.png'`), so content-hashed file names work.
 */
export interface FontAtlasUrls {
    /** The URL of the atlas's metrics JSON file. */
    metricsUrl: string;
    /** The URL of the atlas's image, generated together with the metrics. */
    imageUrl: string;
}
/**
 * Loads and caches `FontAtlas`es from a metrics JSON file and its atlas
 * image, keyed by the metrics file's URL. Each atlas's texture comes from
 * the render context's `textureCache`, which owns it.
 */
export declare class FontAtlasCache {
    private readonly _renderContext;
    private readonly _loads;
    private readonly _fontAtlases;
    /**
     * Constructs a new instance of the `FontAtlasCache` class.
     * @param renderContext - The render context the atlas textures are
     * created in. Atlas textures load through its `textureCache`.
     */
    constructor(renderContext: RenderContext);
    /**
     * Retrieves a loaded font atlas from the cache.
     * @param metricsUrl - The URL of the font atlas's metrics JSON file.
     * @returns The cached font atlas.
     * @throws Will throw an error if the font atlas hasn't finished loading.
     */
    get(metricsUrl: string): FontAtlas;
    /**
     * Retrieves a font atlas from the cache, loading it the first time it's
     * requested. Concurrent calls for the same atlas share one load.
     * @param urls - The URLs of the atlas's metrics JSON file and image.
     * @returns A promise that resolves to the font atlas.
     * @throws Will throw an error if `urls.metricsUrl` was already requested
     * with a different image URL, if the JSON fails to fetch, is malformed or
     * is an unsupported atlas format, if the image fails to load, or if the
     * image's size doesn't match the metrics' `atlasSize`.
     */
    getOrLoad(urls: FontAtlasUrls): Promise<FontAtlas>;
    private _load;
}
