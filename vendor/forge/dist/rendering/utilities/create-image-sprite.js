import { Color } from '../color.js';
import { resolveNineSliceNativeSize, } from '../nine-slice-options.js';
import { importTexture } from './import-texture.js';
/**
 * Computes a sprite's options from a texture: its world size from
 * `pixelsPerUnit` (and `frameDimensions`, for a sprite sheet), the share of
 * the texture one frame covers, and nine-slice native sizes. Does no GL
 * work, so any number of sprites can be created from one texture.
 *
 * The result has every other field at its default (no emissive map, the
 * render context's sprite material, category `1`); spread it into
 * `addSpriteComponent` with any overrides. `addSpriteComponent` copies its
 * vectors, so one result can be shared by many sprites.
 * @param texture - The texture the sprite draws.
 * @param options - Optional parameters for creating the sprite.
 * @returns The sprite's options.
 */
export function createImageSprite(texture, options = {}) {
    const { frameDimensions, slices, pixelsPerUnit } = options;
    const { worldWidth, worldHeight } = importTexture(texture, {
        pixelsPerUnit,
        width: frameDimensions?.x,
        height: frameDimensions?.y,
    });
    return {
        texture,
        width: worldWidth,
        height: worldHeight,
        pivot: { x: 0.5, y: 0.5 },
        tintColor: Color.white,
        uvOffset: { x: 0, y: 0 },
        uvScale: frameDimensions
            ? {
                x: frameDimensions.x / texture.width,
                y: frameDimensions.y / texture.height,
            }
            : { x: 1, y: 1 },
        emissive: null,
        material: null,
        category: 1,
        layer: 0,
        slices: slices && resolveNineSliceNativeSize(slices, worldWidth, worldHeight),
    };
}
