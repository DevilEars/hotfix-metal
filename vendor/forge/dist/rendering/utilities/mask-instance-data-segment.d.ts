import type { InstanceDataSegment } from './instance-data-segment.js';
/** The number of floats occupied by an instance's mask data. */
export declare const MASK_INSTANCE_DATA_FLOATS_PER_INSTANCE = 14;
/**
 * The instance data segment for the masks an instance is drawn through
 * (`InstanceComponents.mask`), read by the `spriteMaskVertex` include that
 * `sprite.vert` and the glyph vertex shaders use: the clip rect of its rect
 * masks and its linear or radial mask. An unmasked instance binds an
 * unbounded clip rect and no shape. Per instance, so masked and unmasked
 * quads still batch together.
 */
export declare const maskInstanceDataSegment: InstanceDataSegment;
