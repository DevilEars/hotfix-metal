import { RENDER_TARGET_FORMAT, } from './enums/index.js';
import { Texture } from './texture.js';
/**
 * A texture that belongs to the engine object that created it (a render
 * target's color attachment, one of the render context's white and black
 * textures, or a texture in its `textureCache`) rather than to whoever
 * samples it. It samples like any other
 * `Texture`, but its contents and lifetime are its owner's: `update` and
 * `dispose` throw, and the owner frees it with `release`.
 */
export class OwnedTexture extends Texture {
    _owner;
    /**
     * Creates an empty texture.
     * @param renderContext - The render context to create the texture in.
     * @param owner - What owns the texture, for error messages.
     * @param options - How the texture is sampled.
     */
    constructor(renderContext, owner, options = {}) {
        super(renderContext, options);
        this._owner = owner;
    }
    /**
     * Creates a texture from an image, canvas, `ImageData`, `ImageBitmap` or
     * video frame, like `createTexture`, for an owner that shares it.
     * @param renderContext - The render context to create the texture in.
     * @param owner - What owns the texture, for error messages.
     * @param source - The texture's contents, uploaded as 8-bit RGBA.
     * @param options - How the texture is sampled.
     * @returns The texture.
     */
    static createFromSource(renderContext, owner, source, options = {}) {
        const texture = new OwnedTexture(renderContext, owner, options);
        texture._setSource(source);
        return texture;
    }
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
    static createRenderTargetColor(renderContext, width, height, format) {
        const { gl } = renderContext;
        const texture = new OwnedTexture(renderContext, 'its render target');
        const isHdr = format === RENDER_TARGET_FORMAT.hdr;
        texture.allocateStorage(width, height, isHdr ? gl.RGBA16F : gl.RGBA, isHdr ? gl.HALF_FLOAT : gl.UNSIGNED_BYTE);
        return texture;
    }
    /**
     * Creates a 1x1 texture of one opaque color.
     * @param renderContext - The render context to create the texture in.
     * @param rgba - The texel, as four bytes.
     * @returns The texture.
     */
    static createSolidColor(renderContext, rgba) {
        const texture = new OwnedTexture(renderContext, 'the render context');
        texture.uploadPixels(1, 1, new Uint8Array(rgba));
        return texture;
    }
    /**
     * Always throws: an owned texture's contents are its owner's.
     * @throws An error naming the texture's owner.
     */
    update() {
        throw new Error(`This texture belongs to ${this._owner}, so it can't be updated.`);
    }
    /**
     * Always throws: an owned texture is freed by its owner.
     * @throws An error naming the texture's owner.
     */
    dispose() {
        throw new Error(`This texture belongs to ${this._owner}, which disposes it.`);
    }
    /** Frees the GPU texture. Called by the texture's owner. */
    release() {
        this.deleteStorage();
    }
    _setSource(source) {
        super.update(source);
    }
}
