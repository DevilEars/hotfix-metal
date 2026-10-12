import type { InstanceDataSegment } from '../../rendering/utilities/instance-data-segment.js';
/**
 * The number of floats occupied by a glyph's text effect instance data
 * (outline color/width, shadow color/offset/softness).
 */
export declare const TEXT_EFFECTS_INSTANCE_DATA_FLOATS_PER_INSTANCE = 12;
/**
 * The instance data segment for the MSDF text vertex shader's (`msdf.vert`)
 * outline/shadow parameters.
 *
 * Binds `InstanceComponents.textEffects` (set by `pushTextRenderCommands`
 * for every glyph instance) and wires it up to the `a_instanceOutlineColor`,
 * `a_instanceShadowColor` and `a_instanceEffectParams` (outline width,
 * shadow offset, shadow softness) attributes - all uniform across a whole
 * `TextEcsComponent`, so every glyph instance of the same text entity binds
 * the same values.
 *
 * Combine this with `spriteInstanceDataSegment` via
 * `combineInstanceDataSegments` to build the MSDF text `Renderable`'s
 * instance data layout (see `createTextRenderables`) - per-instance, rather
 * than a material uniform, so that text entities sharing the same
 * `FontAtlas` but different outline/shadow settings still batch into a
 * single draw call.
 */
export declare const textEffectsInstanceDataSegment: InstanceDataSegment;
