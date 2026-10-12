import { RENDER_TARGET_FORMAT_KEYS } from './enums/index.js';
import type { RenderContext } from './render-context.js';
import { Texture, TextureOptions } from './texture.js';
/**
 * A texture that belongs to the engine object that created it (a render
 * target's color attachment, one of the render context's white and black
 * textures, or a texture in its `textureCache`) rather than to whoever
 * samples it. It samples like any other
 * `Texture`, but its contents and lifetime are its owner's: `update` and
 * `dispose` throw, and the owner frees it with `release`.
 */
export declare class OwnedTexture extends Texture {
    private readonly _owner;
    /**
     * Creates an empty texture.
     * @param renderContext - The render context to create the texture in.
     * @param owner - What owns the texture, for error messages.
     * @param options - How the texture is sampled.
     */
    constructor(renderContext: RenderContext, owner: string, options?: Partial<TextureOptions>);
    /**
     * Creates a texture from an image, canvas, `ImageData`, `ImageBitmap` or
     * video frame, like `createTexture`, for an owner that shares it.
     * @param renderContext - The render context to create the texture in.
     * @param owner - What owns the texture, for error messages.
     * @param source - The texture's contents, uploaded as 8-bit RGBA.
     * @param options - How the texture is sampled.
     * @returns The texture.
     */
    static createFromSource(renderContext: RenderContext, owner: string, source: TexImageSource, options?: Partial<TextureOptions>): OwnedTexture;
    /**
     * Creates the color attachment of a render target.
     * @param renderContext - The render context to create the texture in.
     * @param width - The width, in texels.
     * @param height - The height, in texels.
     * @param format - The storage format, already resolved by
     * `resolveRenderTargetFormat` (never a format the context can't render
     * into).
     * @returns The texture, with uninitialized contents (and empty again
     * after a lost context is restored, until its target is drawn into).
     */
    static createRenderTargetColor(renderContext: RenderContext, width: number, height: number, format: RENDER_TARGET_FORMAT_KEYS): OwnedTexture;
    /**
     * Creates a 1x1 texture of one opaque color.
     * @param renderContext - The render context to create the texture in.
     * @param rgba - The texel, as four bytes.
     * @returns The texture.
     */
    static createSolidColor(renderContext: RenderContext, rgba: readonly [number, number, number, number]): OwnedTexture;
    /**
     * Always throws: an owned texture's contents are its owner's.
     * @throws An error naming the texture's owner.
     */
    update(): void;
    /**
     * Always throws: an owned texture is freed by its owner.
     * @throws An error naming the texture's owner.
     */
    dispose(): void;
    /** Frees the GPU texture. Called by the texture's owner. */
    release(): void;
    private _setSource;
}
