import { Vector2 } from '../../math/index.js';
import { NineSliceOptions } from '../nine-slice-options.js';
/**
 * A single quad, in a sliced sprite's own local sprite-space, that the
 * render system draws in place of the sprite's single quad when it has
 * `NineSliceOptions` set.
 */
export interface NineSliceRegion {
    /**
     * This region's center, as an offset from the sprite's pivot-adjusted
     * anchor point, in the sprite's unscaled local units (before rotation and
     * `ScaleEcsComponent` are applied).
     */
    offset: Vector2;
    /** This region's rendered width/height, in the same unscaled units. */
    size: Vector2;
    /** The top-left corner of this region's texture rect, 0 to 1. */
    uvOffset: Vector2;
    /** The width/height of this region's texture rect, 0 to 1. */
    uvScale: Vector2;
}
/**
 * Computes the nine-slice regions for a sprite, given its current size, and
 * cuts each stretching band into tiled segments where its mode is `'tile'`.
 *
 * Corner regions are always a single, fixed-size quad. Edge regions stretch
 * or tile along their one free axis (`edgeMode`); the center region
 * stretches or tiles along both axes (`centerMode`). A border with an inset
 * of `0` (the default for any axis with no slicing) collapses to just its
 * center band, so a sprite with no insets at all degenerates to the single
 * region a non-sliced sprite would render.
 * @param width - The sprite's current width, in unscaled sprite-space units.
 * @param height - The sprite's current height, in unscaled sprite-space units.
 * @param pivot - The sprite's pivot, normalized to its own size and Y-up
 * (`(0, 0)` is bottom-left, `(1, 1)` is top-right), matching
 * `SpriteEcsComponent.pivot`.
 * @param uvOffset - The sprite's texture rect offset, 0 to 1.
 * @param uvScale - The sprite's texture rect size, 0 to 1.
 * @param slices - The nine-slice configuration. `nativeWidth`/`nativeHeight`
 * are normally already resolved by `createImageSprite`/`addSpriteComponent`;
 * if they're still omitted (e.g. `slices` was assigned to an
 * already-attached sprite), the current `width`/`height` is used, which only
 * samples the intended border art while the sprite is at that size.
 * @returns Up to nine regions, each a quad to draw in place of the sprite's
 * single quad.
 */
export declare function computeNineSliceRegions(width: number, height: number, pivot: Vector2, uvOffset: Vector2, uvScale: Vector2, slices: NineSliceOptions): NineSliceRegion[];
