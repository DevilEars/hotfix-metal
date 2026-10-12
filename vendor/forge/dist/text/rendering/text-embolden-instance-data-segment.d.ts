import type { InstanceDataSegment } from '../../rendering/utilities/instance-data-segment.js';
/** The number of floats occupied by a glyph's faux-bold edge shift. */
export declare const TEXT_EMBOLDEN_INSTANCE_DATA_FLOATS_PER_INSTANCE = 1;
/**
 * The instance data segment for a glyph's faux-bold edge shift
 * (`GlyphQuad.embolden`, set by a `<b>` rich text tag), read by both MSDF
 * vertex shaders (`msdf-fill.vert` and `msdf.vert`) as
 * `a_instanceEmbolden`.
 *
 * Binds `InstanceComponents.textEmbolden`, set by `pushTextRenderCommands`
 * for every glyph instance. Per instance rather than a material uniform, so
 * bold and regular glyphs of the same `FontAtlas` still batch into one draw
 * call.
 */
export declare const textEmboldenInstanceDataSegment: InstanceDataSegment;
