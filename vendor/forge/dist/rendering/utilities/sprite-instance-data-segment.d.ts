import type { Rect } from '../../math/index.js';
import type { InstanceComponents } from '../renderable.js';
import type { InstanceDataSegment } from './instance-data-segment.js';
/**
 * The number of floats occupied by the standard sprite instance data
 * (position, rotation, scale, size, pivot, texture coordinates and tint).
 */
export declare const SPRITE_INSTANCE_DATA_FLOATS_PER_INSTANCE = 17;
/**
 * Computes the world-space axis-aligned bounds of the quad `sprite.vert`
 * draws for one instance: `sprite`'s `width`/`height` around its `pivot`,
 * scaled (and flipped), rotated and placed at `position.world`, matching
 * the instance data `spriteInstanceDataSegment` binds. The render system
 * skips instances whose bounds are outside a camera's view.
 * @param components - The instance's components.
 * @param result - The rect to write the bounds into, so a caller testing
 * many instances can reuse one.
 * @returns `result`.
 */
export declare function computeSpriteInstanceBounds(components: InstanceComponents, result: Rect): Rect;
/**
 * The instance data segment for the standard sprite vertex shader (`sprite.vert`).
 *
 * Binds position, rotation, scale, size, pivot, texture coordinates and tint
 * from an entity's `SpriteEcsComponent`, and wires them up to the
 * `a_instancePosScale` (position and scale), `a_instanceRot`,
 * `a_instanceSizePivot` (size and pivot), `a_instanceTexRect` (UV offset and
 * size) and `a_instanceTint` attributes.
 *
 * Use this with `combineInstanceDataSegments` to reuse the sprite vertex
 * shader with a custom fragment shader, or to extend it with additional
 * per-instance attributes.
 */
export declare const spriteInstanceDataSegment: InstanceDataSegment;
