const defaultImportTextureOptions = { pixelsPerUnit: 100 };
/**
 * Runs a texture through Forge's texture import pipeline, converting its
 * pixel dimensions into a world-unit size via `pixelsPerUnit`, the way an
 * art pipeline's per-texture import settings would. Hand the result's
 * `worldWidth`/`worldHeight` to `createSprite`/`addSpriteComponent` instead
 * of authoring a sprite's world size by hand from pixel dimensions.
 * @param texture - The texture to import.
 * @param options - Options for configuring the import. `width`/`height`
 * default to the texture's own size in texels; `pixelsPerUnit` defaults to
 * `100`.
 * @returns The resulting imported texture.
 * @throws An error if `pixelsPerUnit`, `width`, or `height` is not positive.
 */
export function importTexture(texture, options = {}) {
    const pixelsPerUnit = options.pixelsPerUnit ?? defaultImportTextureOptions.pixelsPerUnit;
    const width = options.width ?? texture.width;
    const height = options.height ?? texture.height;
    if (pixelsPerUnit <= 0) {
        throw new Error(`importTexture requires a positive pixelsPerUnit, received ${pixelsPerUnit}.`);
    }
    if (width <= 0 || height <= 0) {
        throw new Error(`importTexture requires a positive width and height, received width=${width}, height=${height}.`);
    }
    return {
        texture,
        pixelsPerUnit,
        width,
        height,
        worldWidth: width / pixelsPerUnit,
        worldHeight: height / pixelsPerUnit,
    };
}
