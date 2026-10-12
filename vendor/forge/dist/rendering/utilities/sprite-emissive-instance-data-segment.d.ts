import type { InstanceDataSegment } from './instance-data-segment.js';
/**
 * The number of floats occupied by a sprite's emissive color.
 */
export declare const SPRITE_EMISSIVE_INSTANCE_DATA_FLOATS_PER_INSTANCE = 3;
/**
 * The instance data segment for a sprite's emissive color, read by
 * `sprite.vert` as `a_instanceEmissive`. Per instance rather than a
 * material uniform, so sprites glowing in different colors still share a
 * material and batch together.
 */
export declare const spriteEmissiveInstanceDataSegment: InstanceDataSegment;
